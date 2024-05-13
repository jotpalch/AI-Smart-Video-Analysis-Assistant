import './markdown.scss'

import ReactMarkdown from "react-markdown";
// import "katex/dist/katex.min.css";
import RemarkMath from "remark-math";
import RemarkBreaks from "remark-breaks";
import RehypeKatex from "rehype-katex";
import RemarkGfm from "remark-gfm";
import RehypeHighlight from "rehype-highlight";
import { useRef, useState, useEffect, useMemo } from "react";

// import LoadingIcon from "../icons/three-dots.svg";
import React from "react";
// import { useDebouncedCallback } from "use-debounce";

export async function copyToClipboard(text) {
	try {
		await navigator.clipboard.writeText(text);

		// showToast(Locale.Copy.Success);
	} catch (error) {
		const textArea = document.createElement("textarea");
		textArea.value = text;
		document.body.appendChild(textArea);
		textArea.focus();
		textArea.select();
		try {
			document.execCommand("copy");
			// showToast(Locale.Copy.Success);
		} catch (error) {
			// showToast(Locale.Copy.Failed);
		}
		document.body.removeChild(textArea);
	}
}

export function PreCode(props) {
	const ref = useRef(null);
	const refText = ref.current?.innerText;

	return (
		<>
			<pre ref={ref}>
				<span
					className="copy-code-button"
					onClick={() => {
						if (ref.current) {
							const code = ref.current.innerText;
							copyToClipboard(code);
						}
					}}
				></span>
				{props.children}
			</pre>
		</>
	);
}

function escapeDollarNumber(text) {
	let escapedText = "";

	for (let i = 0; i < text?.length; i += 1) {
		let char = text[i];
		const nextChar = text[i + 1] || " ";

		if (char === "$" && nextChar >= "0" && nextChar <= "9") {
			char = "\\$";
		}

		escapedText += char;
	}

	return escapedText;
}

function escapeBrackets(text) {
	const pattern =
		/(```[\s\S]*?```|`.*?`)|\\\[([\s\S]*?[^\\])\\\]|\\\((.*?)\\\)/g;
	return text.replace(
		pattern,
		(match, codeBlock, squareBracket, roundBracket) => {
			if (codeBlock) {
				return codeBlock;
			} else if (squareBracket) {
				return `$$${squareBracket}$$`;
			} else if (roundBracket) {
				return `$${roundBracket}$`;
			}
			return match;
		}
	);
}

function _MarkDownContent(props) {
	const escapedContent = useMemo(() => {
		return escapeBrackets(escapeDollarNumber(props.content));
	}, [props.content]);

	return (
		<ReactMarkdown
			remarkPlugins={[RemarkMath, RemarkGfm, RemarkBreaks]}
			rehypePlugins={[
				RehypeKatex,
				[
					RehypeHighlight,
					{
						detect: false,
						ignoreMissing: true,
					},
				],
			]}
			components={{
				pre: PreCode,
				p: (pProps) => <p {...pProps} dir="auto" />,
				a: (aProps) => {
					const href = aProps.href || "";
					const isInternal = /^\/#/i.test(href);
					const target = isInternal ? "_self" : aProps.target ?? "_blank";
					return <a {...aProps} target={target} />;
				},
			}}
		>
			{escapedContent}
		</ReactMarkdown>
	);
}

export const MarkdownContent = React.memo(_MarkDownContent);

export function Markdown(props) {
	const mdRef = useRef(null);

	return (
		<div
			className="markdown-body"
			style={{
				fontSize: `${props.fontSize ?? 14}px`,
			}}
			ref={mdRef}
			onContextMenu={props.onContextMenu}
			onDoubleClickCapture={props.onDoubleClickCapture}
			dir="auto"
		>
			{props.loading ? (
				// <LoadingIcon />
				<div> Loading... </div>
			) : (
				<MarkdownContent content={props.content} />
			)}
		</div>
	);
}
