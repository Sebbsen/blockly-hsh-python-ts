const escapeHtml = (value: string): string => {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

const renderInlineMarkdown = (value: string): string => {
  const codeSpans: string[] = [];
  const escapedWithCodePlaceholders = escapeHtml(value).replace(/`([^`]+)`/g, (_, code) => {
    const index = codeSpans.length;
    codeSpans.push(`<code>${code}</code>`);
    return `@@CODE${index}@@`;
  });

  return escapedWithCodePlaceholders
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/__([^_]+)__/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/_([^_]+)_/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')
    .replace(/@@CODE(\d+)@@/g, (_, index) => codeSpans[Number(index)] ?? '');
};

const renderList = (items: string[], ordered: boolean): string => {
  const tag = ordered ? 'ol' : 'ul';
  return `<${tag}>${items.map((item) => `<li>${renderInlineMarkdown(item)}</li>`).join('')}</${tag}>`;
};

const renderParagraph = (lines: string[]): string => {
  return `<p>${renderInlineMarkdown(lines.join(' '))}</p>`;
};

export const renderMarkdown = (markdown: string): string => {
  const lines = markdown.replace(/\r\n?/g, '\n').split('\n');
  const html: string[] = [];
  let paragraphLines: string[] = [];
  let listItems: string[] = [];
  let orderedList = false;
  let inCodeBlock = false;
  let codeLanguage = '';
  let codeLines: string[] = [];

  const flushParagraph = (): void => {
    if (paragraphLines.length === 0) return;
    html.push(renderParagraph(paragraphLines));
    paragraphLines = [];
  };

  const flushList = (): void => {
    if (listItems.length === 0) return;
    html.push(renderList(listItems, orderedList));
    listItems = [];
  };

  const flushCodeBlock = (): void => {
    const languageClass = codeLanguage ? ` class="language-${escapeHtml(codeLanguage)}"` : '';
    html.push(`<pre><code${languageClass}>${escapeHtml(codeLines.join('\n'))}</code></pre>`);
    codeLanguage = '';
    codeLines = [];
  };

  lines.forEach((line) => {
    const codeFenceMatch = line.match(/^```\s*([a-zA-Z0-9_-]*)\s*$/);
    if (codeFenceMatch) {
      if (inCodeBlock) {
        flushCodeBlock();
        inCodeBlock = false;
      } else {
        flushParagraph();
        flushList();
        inCodeBlock = true;
        codeLanguage = codeFenceMatch[1] || '';
        codeLines = [];
      }
      return;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      return;
    }

    if (line.trim() === '') {
      flushParagraph();
      flushList();
      return;
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      flushParagraph();
      flushList();
      const level = headingMatch[1].length;
      html.push(`<h${level}>${renderInlineMarkdown(headingMatch[2])}</h${level}>`);
      return;
    }

    const unorderedMatch = line.match(/^\s*[-*]\s+(.+)$/);
    if (unorderedMatch) {
      flushParagraph();
      if (listItems.length > 0 && orderedList) {
        flushList();
      }
      orderedList = false;
      listItems.push(unorderedMatch[1]);
      return;
    }

    const orderedMatch = line.match(/^\s*\d+\.\s+(.+)$/);
    if (orderedMatch) {
      flushParagraph();
      if (listItems.length > 0 && !orderedList) {
        flushList();
      }
      orderedList = true;
      listItems.push(orderedMatch[1]);
      return;
    }

    flushList();
    paragraphLines.push(line.trim());
  });

  if (inCodeBlock) {
    flushCodeBlock();
  }
  flushParagraph();
  flushList();

  return html.join('');
};
