import { useMemo } from 'react';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';

export type MarkdownRendererProps = {
  content: string;
  className?: string;
};

export function MarkdownRenderer({
  content,
  className = '',
}: MarkdownRendererProps) {
  const htmlContent = useMemo(() => {
    try {
      const result = remark()
        .use(remarkGfm)
        .use(remarkHtml, { sanitize: false })
        .processSync(content);

      return result;
    } catch (error) {
      console.error('Error processing markdown:', error);
      return '<p>Error rendering markdown content</p>';
    }
  }, [content]);

  return (
    <div
      className={`prose prose-sm max-w-none dark:prose-invert ${className}`}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
