import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse, parse_qs, urlencode
from flask import Flask, render_template_string, request, render_template, redirect
import markdown

YOUR_API_KEY = "<Your-Gemini-API-KEY>"

init_prompt = """
                Please summarize the following transcript and list out the key points.
            """

def extract_video_id(url):
    # Parse the URL
    url_parsed = urlparse(url)

    # Check if the netloc is 'youtu.be'
    if url_parsed.netloc == 'youtu.be':
        return url_parsed.path[1:]

    # Check if the netloc is 'www.youtube.com' or 'youtube.com'
    if url_parsed.netloc in ('www.youtube.com', 'youtube.com'):
        if url_parsed.path == '/watch':
            p = parse_qs(url_parsed.query)
            return p['v'][0]

    # If neither condition is met, return None
    return url


def get_transcript(id):
    base_url = 'https://youtubetranscript.com'
    query_params = urlencode({'server_vid2': id})
    url = f"{base_url}?{query_params}"
    
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    error = soup.select_one('error')

    if error:
        raise Exception(error.text)

    transcript_text = soup.select('transcript text')
    transcript = [
        {
            'text': elem.get_text(),
            'start': float(elem.get('start', 0)),
            'duration': float(elem.get('dur', 0))
        }
        for elem in transcript_text
    ]
    return transcript


# Set the base URL for the API
base_url = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={YOUR_API_KEY}'

def interact_with_gemini(prompt):
  """
  Sends a prompt to Gemini and returns the generated text.

  Args:
      prompt: The text prompt to send to Gemini.

  Returns:
      The generated text by Gemini, or an error message if unsuccessful.
  """

  # Prepare the request data
  data = {
    "contents": [
      {
        "parts": [
          {
            "text": prompt
          }
        ]
      }
    ]
  }

  headers = {'Content-Type': 'application/json'}

  try:
    response = requests.post(base_url, headers=headers, json=data)
    response.raise_for_status()  # Raise an exception for unsuccessful status codes

    gemini_response = response.json()["candidates"][0]["content"]["parts"][0]["text"]
    return gemini_response

  except requests.exceptions.RequestException as e:
    return f"Error: {e}"

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def home():
    if request.method == 'POST':
        text = request.form['text']
        # Now you can use the text variable to process the text as needed
        id = extract_video_id(text)
        transcript_dict = get_transcript(id)
        transcript = " ".join([ line['text'] for line in transcript_dict ])
        response = interact_with_gemini(init_prompt + transcript)
        content = markdown.markdown(response)
        return render_template('display.html', text=content, video_id=id)
    else:
        return render_template('form.html')
    
@app.route('/back')
def back():
    return redirect("/")

if __name__ == "__main__":
    port = 3000
    app.run(host='0.0.0.0', port=port)

