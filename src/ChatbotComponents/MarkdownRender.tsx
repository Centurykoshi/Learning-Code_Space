import React from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ 
  content, 
  className = "" 
}) => {
  // Parse inline markdown (bold, italic, code, strikethrough)
  const parseInlineMarkdown = (text: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    let keyCounter = 0;

    // Split by markdown patterns while preserving them
    const segments = text.split(/(\*\*.*?\*\*|__.*?__|(?<!\*)\*(?!\*).*?(?<!\*)\*(?!\*)|(?<!_)_(?!_).*?(?<!_)_(?!_)|`.*?`|~~.*?~~)/);

    segments.forEach((segment, index) => {
      if (!segment) return;

      // Bold: **text** or __text__
      if (segment.match(/^\*\*(.*)\*\*$/)) {
        const content = segment.replace(/\*\*/g, '');
        parts.push(<strong key={keyCounter++} className="font-bold">{content}</strong>);
      } else if (segment.match(/^__(.*?)__$/)) {
        const content = segment.replace(/__/g, '');
        parts.push(<strong key={keyCounter++} className="font-bold">{content}</strong>);
      }
      // Italic: *text* or _text_ (but not part of bold)
      else if (segment.match(/^\*([^*]*)\*$/) && !segment.includes('**')) {
        const content = segment.replace(/\*/g, '');
        parts.push(<em key={keyCounter++} className="italic">{content}</em>);
      } else if (segment.match(/^_([^_]*)_$/) && !segment.includes('__')) {
        const content = segment.replace(/_/g, '');
        parts.push(<em key={keyCounter++} className="italic">{content}</em>);
      }
      // Inline code: `text`
      else if (segment.match(/^`(.*)`$/)) {
        const content = segment.replace(/`/g, '');
        parts.push(
          <code key={keyCounter++} className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono text-red-600 dark:text-red-400">
            {content}
          </code>
        );
      }
      // Strikethrough: ~~text~~
      else if (segment.match(/^~~(.*)~~$/)) {
        const content = segment.replace(/~~/g, '');
        parts.push(
          <span key={keyCounter++} className="line-through opacity-75">{content}</span>
        );
      }
      // Plain text
      else {
        parts.push(segment);
      }
    });

    return parts;
  };

  // Parse the entire markdown content
  const parseMarkdown = (text: string): React.ReactNode => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];
      
      // Code blocks (```language)
      if (line.trim().startsWith('```')) {
        const language = line.trim().slice(3);
        const codeLines: string[] = [];
        i++;
        
        while (i < lines.length && !lines[i].trim().startsWith('```')) {
          codeLines.push(lines[i]);
          i++;
        }
        
        elements.push(
          <div key={`code-block-${i}`} className="my-4">
            <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
              {language && (
                <div className="bg-gray-800 px-4 py-2 text-sm text-gray-400 border-b border-gray-700 flex justify-between items-center">
                  <span className="font-mono">{language}</span>
                  <button 
                    onClick={() => navigator.clipboard.writeText(codeLines.join('\n'))}
                    className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded transition-colors duration-200"
                  >
                    Copy code
                  </button>
                </div>
              )}
              <pre className="p-4 overflow-x-auto text-sm">
                <code className="block text-gray-300 font-mono leading-relaxed">
                  {codeLines.join('\n')}
                </code>
              </pre>
            </div>
          </div>
        );
        i++;
        continue;
      }

      // Headers
      if (line.startsWith('#')) {
        const level = line.match(/^#+/)?.[0].length || 1;
        const text = line.replace(/^#+\s*/, '');
        const clampedLevel = Math.min(level, 6);
        
        const headerClassName = `font-bold mt-6 mb-3 text-gray-900 dark:text-gray-100 ${
          level === 1 ? 'text-2xl border-b border-gray-200 dark:border-gray-700 pb-2' :
          level === 2 ? 'text-xl' :
          level === 3 ? 'text-lg' :
          'text-base'
        }`;

        // Use explicit JSX elements instead of React.createElement
        if (clampedLevel === 1) {
          elements.push(<h1 key={`header-${i}`} className={headerClassName}>{parseInlineMarkdown(text)}</h1>);
        } else if (clampedLevel === 2) {
          elements.push(<h2 key={`header-${i}`} className={headerClassName}>{parseInlineMarkdown(text)}</h2>);
        } else if (clampedLevel === 3) {
          elements.push(<h3 key={`header-${i}`} className={headerClassName}>{parseInlineMarkdown(text)}</h3>);
        } else if (clampedLevel === 4) {
          elements.push(<h4 key={`header-${i}`} className={headerClassName}>{parseInlineMarkdown(text)}</h4>);
        } else if (clampedLevel === 5) {
          elements.push(<h5 key={`header-${i}`} className={headerClassName}>{parseInlineMarkdown(text)}</h5>);
        } else {
          elements.push(<h6 key={`header-${i}`} className={headerClassName}>{parseInlineMarkdown(text)}</h6>);
        }
        
        i++;
        continue;
      }

      // Unordered lists
      if (line.trim().match(/^[-*+]\s/)) {
        const listItems: string[] = [];
        while (i < lines.length && lines[i].trim().match(/^[-*+]\s/)) {
          listItems.push(lines[i].trim().replace(/^[-*+]\s/, ''));
          i++;
        }
        
        elements.push(
          <ul key={`ul-${i}`} className="list-disc list-inside my-3 space-y-2 ml-4">
            {listItems.map((item, idx) => (
              <li key={idx} className="text-gray-700 dark:text-gray-300">
                {parseInlineMarkdown(item)}
              </li>
            ))}
          </ul>
        );
        continue;
      }

      // Ordered lists
      if (line.trim().match(/^\d+\.\s/)) {
        const listItems: string[] = [];
        let startNumber = 1;
        const firstMatch = line.trim().match(/^(\d+)\.\s/);
        if (firstMatch) {
          startNumber = parseInt(firstMatch[1]);
        }
        
        while (i < lines.length && lines[i].trim().match(/^\d+\.\s/)) {
          listItems.push(lines[i].trim().replace(/^\d+\.\s/, ''));
          i++;
        }
        
        elements.push(
          <ol key={`ol-${i}`} className="list-decimal list-inside my-3 space-y-2 ml-4" start={startNumber}>
            {listItems.map((item, idx) => (
              <li key={idx} className="text-gray-700 dark:text-gray-300">
                {parseInlineMarkdown(item)}
              </li>
            ))}
          </ol>
        );
        continue;
      }

      // Blockquotes
      if (line.trim().startsWith('>')) {
        const quoteLines: string[] = [];
        while (i < lines.length && lines[i].trim().startsWith('>')) {
          quoteLines.push(lines[i].trim().replace(/^>\s?/, ''));
          i++;
        }
        
        elements.push(
          <blockquote key={`quote-${i}`} className="border-l-4 border-blue-500 pl-4 my-4 italic text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 py-2 rounded-r">
            {quoteLines.map((quoteLine, idx) => (
              <div key={idx}>{parseInlineMarkdown(quoteLine)}</div>
            ))}
          </blockquote>
        );
        continue;
      }

      // Horizontal rules
      if (line.trim().match(/^(---+|___+|\*\*\*+)$/)) {
        elements.push(
          <hr key={`hr-${i}`} className="my-6 border-gray-300 dark:border-gray-600" />
        );
        i++;
        continue;
      }

      // Empty lines
      if (line.trim() === '') {
        i++;
        continue;
      }

      // Regular paragraphs
      const paragraphLines: string[] = [];
      while (i < lines.length && lines[i].trim() !== '' && 
             !lines[i].startsWith('#') && 
             !lines[i].trim().startsWith('```') &&
             !lines[i].trim().match(/^[-*+]\s/) &&
             !lines[i].trim().match(/^\d+\.\s/) &&
             !lines[i].trim().startsWith('>') &&
             !lines[i].trim().match(/^(---+|___+|\*\*\*+)$/)) {
        paragraphLines.push(lines[i]);
        i++;
      }
      
      if (paragraphLines.length > 0) {
        elements.push(
          <p key={`p-${i}`} className="my-3 text-gray-700 dark:text-gray-300 leading-relaxed">
            {parseInlineMarkdown(paragraphLines.join(' '))}
          </p>
        );
      }
    }

    return elements;
  };

  return (
    <div className={`prose prose-sm max-w-none ${className}`}>
      <div className="text-foreground">
        {parseMarkdown(content)}
      </div>
    </div>
  );
};

// Simple hook for easy markdown rendering (keeping your original export)
export const useMarkdown = (content: string) => {
  return <MarkdownRenderer content={content} />;
};