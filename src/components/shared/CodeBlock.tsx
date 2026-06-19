import { useMemo } from 'react'

const KEYWORDS = /\b(const|let|var|function|return|if|else|for|while|import|export|from|default|new|class|extends|async|await|try|catch|throw|typeof|null|undefined|true|false|this|=>)\b/g

// Lightweight JSX/JS highlighter — token-cheap, no deps.
function highlight(code: string): string {
  let html = code
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  // comments
  html = html.replace(/(\/\/[^\n]*)/g, '<span class="tok-com">$1</span>')
  // strings
  html = html.replace(/(`[^`]*`|'[^']*'|"[^"]*")/g, '<span class="tok-str">$1</span>')
  // jsx tags
  html = html.replace(/(&lt;\/?)([A-Za-z][\w.]*)/g, '$1<span class="tok-tag">$2</span>')
  // numbers
  html = html.replace(/\b(\d+\.?\d*)\b/g, '<span class="tok-num">$1</span>')
  // keywords
  html = html.replace(KEYWORDS, '<span class="tok-key">$1</span>')
  // function calls
  html = html.replace(/\b([a-zA-Z_]\w*)(\()/g, '<span class="tok-fn">$1</span>$2')
  return html
}

export function CodeBlock({ code, className = '' }: { code: string; className?: string }) {
  const html = useMemo(() => highlight(code.trim()), [code])
  return (
    <pre className={`code-block ${className}`}>
      <code dangerouslySetInnerHTML={{ __html: html }} />
    </pre>
  )
}
