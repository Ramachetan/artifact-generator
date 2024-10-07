import React from 'react';
import ReactMarkdown from 'react-markdown';
import CodeBlock from './CodeBlock';



const MarkdownRenderer = ({ content }) => (
    <ReactMarkdown
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <CodeBlock language={match[1]} value={String(children).replace(/\n$/, '')} {...props} />
          ) : (
            <code className={`bg-gray-200 px-1 py-0.5 rounded text-sm ${className} break-words`} {...props}>
              {children}
            </code>
          );
        },
        p: ({ children }) => <p className="break-words whitespace-pre-wrap">{children}</p>,
        img: ({ src, alt }) => <img src={src} alt={alt} className="max-w-full h-auto" />,
      }}
    >
      {content}
    </ReactMarkdown>
  );

export default MarkdownRenderer;