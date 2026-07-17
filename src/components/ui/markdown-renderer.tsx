'use client';

import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBlockContent: string[] = [];
  let codeBlockLang = '';

  const flushCodeBlock = (key: string) => {
    if (codeBlockContent.length > 0) {
      elements.push(
        <pre key={key} className="overflow-x-auto rounded-lg bg-zinc-900 p-4 text-xs text-green-400 dark:bg-zinc-950">
          <code>{codeBlockContent.join('\n')}</code>
        </pre>,
      );
      codeBlockContent = [];
    }
  };

  let elementIndex = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const key = `line-${i}`;

    // Code block handling
    if (line.trimStart().startsWith('```')) {
      if (inCodeBlock) {
        flushCodeBlock(`code-${elementIndex++}`);
        inCodeBlock = false;
        codeBlockLang = '';
      } else {
        inCodeBlock = true;
        codeBlockLang = line.trim().slice(3).trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockContent.push(line);
      continue;
    }

    // Empty line
    if (line.trim() === '') {
      elements.push(<br key={key} />);
      continue;
    }

    const processedLine = processInline(line);

    // Headings
    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={key} className="mb-3 mt-6 text-xl font-bold text-zinc-900 dark:text-zinc-100 first:mt-0">
          {processedLine}
        </h2>,
      );
      continue;
    }
    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={key} className="mb-2 mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          {processedLine}
        </h3>,
      );
      continue;
    }

    // Unordered list
    if (line.match(/^[\s]*[-*+]\s/)) {
      elements.push(
        <li key={key} className="ml-5 list-disc text-sm text-zinc-700 dark:text-zinc-300">
          {processInline(line.replace(/^[\s]*[-*+]\s/, ''))}
        </li>,
      );
      continue;
    }

    // Ordered list
    if (line.match(/^\d+\.\s/)) {
      elements.push(
        <li key={key} className="ml-5 list-decimal text-sm text-zinc-700 dark:text-zinc-300">
          {processInline(line.replace(/^\d+\.\s/, ''))}
        </li>,
      );
      continue;
    }

    // Blockquote
    if (line.trimStart().startsWith('> ')) {
      elements.push(
        <blockquote key={key} className="border-l-4 border-zinc-300 bg-zinc-50 py-2 pl-4 text-sm italic text-zinc-600 dark:border-zinc-600 dark:bg-zinc-800/50 dark:text-zinc-400">
          {processInline(line.trim().slice(2))}
        </blockquote>,
      );
      continue;
    }

    // Horizontal rule
    if (line.match(/^---$/)) {
      elements.push(<hr key={key} className="my-4 border-zinc-200 dark:border-zinc-700" />);
      continue;
    }

    // Regular paragraph
    elements.push(
      <p key={key} className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
        {processedLine}
      </p>,
    );
  }

  // Flush any remaining code block
  if (inCodeBlock && codeBlockContent.length > 0) {
    flushCodeBlock(`code-${elementIndex++}`);
  }

  return <div className="space-y-1">{elements}</div>;
}

function processInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // Bold (**text**)
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    // Italic (*text*)
    const italicMatch = remaining.match(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/);
    // Inline code (`text`)
    const codeMatch = remaining.match(/`(.+?)`/);
    // Link [text](url)
    const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/);

    // Find the nearest match
    const matches: { index: number; length: number; render: React.ReactNode }[] = [];

    if (boldMatch) {
      matches.push({
        index: boldMatch.index!,
        length: boldMatch[0].length,
        render: <strong key={key++} className="font-semibold">{boldMatch[1]}</strong>,
      });
    }
    if (italicMatch) {
      matches.push({
        index: italicMatch.index!,
        length: italicMatch[0].length,
        render: <em key={key++}>{italicMatch[1]}</em>,
      });
    }
    if (codeMatch) {
      matches.push({
        index: codeMatch.index!,
        length: codeMatch[0].length,
        render: (
          <code key={key++} className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200">
            {codeMatch[1]}
          </code>
        ),
      });
    }
    if (linkMatch) {
      matches.push({
        index: linkMatch.index!,
        length: linkMatch[0].length,
        render: (
          <a key={key++} href={linkMatch[2]} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
            {linkMatch[1]}
          </a>
        ),
      });
    }

    if (matches.length === 0) {
      // No more matches — push remaining text
      parts.push(remaining);
      break;
    }

    // Sort by index (nearest first)
    matches.sort((a, b) => a.index - b.index);
    const nearest = matches[0];

    // Push text before match
    if (nearest.index > 0) {
      parts.push(remaining.slice(0, nearest.index));
    }

    // Push the matched element
    parts.push(nearest.render);

    // Advance remaining
    remaining = remaining.slice(nearest.index + nearest.length);
  }

  return parts;
}
