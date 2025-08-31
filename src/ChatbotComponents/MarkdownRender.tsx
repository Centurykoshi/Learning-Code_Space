import React from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ 
  content, 
  className = "" 
}) => {
  // Function to parse and render markdown
  const parseMarkdown = (text: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    let currentIndex = 0;
    let keyCounter = 0;

    // Regular expressions for different markdown patterns
    const patterns = [
      // Bold: **text** or __text__
      { regex: /\*\*(.*?)\*\*/g, component: (match: string) => <strong key={keyCounter++} className="font-bold">{match}</strong> },
      { regex: /__(.*?)__/g, component: (match: string) => <strong key={keyCounter++} className="font-bold">{match}</strong> },
      
      // Italic: *text* or _text_
      { regex: /\*(.*?)\*/g, component: (match: string) => <em key={keyCounter++} className="italic">{match}</em> },
      { regex: /_(.*?)_/g, component: (match: string) => <em key={keyCounter++} className="italic">{match}</em> },
      
      // Code: `text`
      { regex: /`(.*?)`/g, component: (match: string) => (
        <code key={keyCounter++} className="bg-muted/50 px-1.5 py-0.5 rounded text-sm font-mono">
          {match}
        </code>
      )},
      
      // Strikethrough: ~~text~~
      { regex: /~~(.*?)~~/g, component: (match: string) => (
        <span key={keyCounter++} className="line-through opacity-75">{match}</span>
      )},
    ];

    // Split text by all patterns and render accordingly
    const segments = text.split(/(\*\*.*?\*\*|__.*?__|(?<!\*)\*(?!\*).*?(?<!\*)\*(?!\*)|(?<!_)_(?!_).*?(?<!_)_(?!_)|`.*?`|~~.*?~~)/g);

    segments.forEach((segment, index) => {
      if (!segment) return;

      let matched = false;
      
      // Check each pattern
      for (const pattern of patterns) {
        const match = segment.match(pattern.regex);
        if (match) {
          // Extract content inside the markdown syntax
          let content = '';
          if (pattern.regex.source.includes('\\*\\*')) {
            content = segment.replace(/\*\*/g, '');
          } else if (pattern.regex.source.includes('__')) {
            content = segment.replace(/__/g, '');
          } else if (pattern.regex.source.includes('\\*')) {
            content = segment.replace(/\*/g, '');
          } else if (pattern.regex.source.includes('_')) {
            content = segment.replace(/_/g, '');
          } else if (pattern.regex.source.includes('`')) {
            content = segment.replace(/`/g, '');
          } else if (pattern.regex.source.includes('~~')) {
            content = segment.replace(/~~/g, '');
          }
          
          parts.push(pattern.component(content));
          matched = true;
          break;
        }
      }

      // If no pattern matched, add as plain text
      if (!matched) {
        parts.push(segment);
      }
    });

    return parts;
  };

  // Parse line breaks and render each line
  const renderWithLineBreaks = (text: string): React.ReactNode => {
    return text.split('\n').map((line, index, array) => (
      <React.Fragment key={index}>
        {parseMarkdown(line)}
        {index < array.length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div className={`prose prose-sm max-w-none ${className}`}>
      <div className="text-foreground leading-relaxed">
        {renderWithLineBreaks(content)}
      </div>
    </div>
  );
};

// Simple hook for easy markdown rendering
export const useMarkdown = (content: string) => {
  return <MarkdownRenderer content={content} />;
};