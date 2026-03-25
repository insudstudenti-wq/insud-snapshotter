import { useRef, useState, useCallback, useEffect } from 'react';
import type React from 'react';
import { Bold, Italic, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}

export function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Scrivi qui...", 
  rows = 6,
  className = ""
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Execute formatting command
  const execCommand = useCallback((command: string, value: string = '') => {
    document.execCommand(command, false, value);
    // Sync content after command
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  // Handle bold
  const toggleBold = useCallback(() => {
    execCommand('bold');
  }, [execCommand]);

  // Handle italic
  const toggleItalic = useCallback(() => {
    execCommand('italic');
  }, [execCommand]);

  // Handle link insertion
  const insertLink = useCallback(() => {
    const selection = window.getSelection();
    const selectedText = selection?.toString() || '';
    const url = prompt('Inserisci URL:', 'https://');
    if (url && url !== 'https://') {
      if (selectedText) {
        // Replace selected text with link
        execCommand('createLink', url);
      } else {
        // Insert new link with placeholder text
        const linkHtml = `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-sky hover:underline">${url}</a>`;
        execCommand('insertHTML', linkHtml);
      }
    }
  }, [execCommand]);

  // Convert markdown-style links [text](url) to HTML links
  const convertMarkdownLinks = useCallback(() => {
    if (!editorRef.current) return;
    
    let html = editorRef.current.innerHTML;
    let hasChanges = false;
    
    // Only process text nodes, not inside existing HTML tags
    // Look for markdown links that are NOT already inside an <a> tag
    // Use a temporary element to parse and process
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    // Walk through text nodes and convert markdown links
    const walker = document.createTreeWalker(
      tempDiv,
      NodeFilter.SHOW_TEXT,
      null
    );
    
    const textNodes: Text[] = [];
    let node: Node | null;
    while (node = walker.nextNode()) {
      // Only process text nodes that are not inside an <a> tag
      if (node.parentElement?.tagName !== 'A') {
        textNodes.push(node as Text);
      }
    }
    
    // Process each text node
    textNodes.forEach(textNode => {
      const text = textNode.textContent || '';
      // Check for markdown link pattern [text](url)
      const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      
      if (markdownLinkRegex.test(text)) {
        hasChanges = true;
        // Reset regex
        markdownLinkRegex.lastIndex = 0;
        
        // Create a fragment to replace the text node
        const fragment = document.createDocumentFragment();
        let lastIndex = 0;
        let match: RegExpExecArray | null;
        
        while ((match = markdownLinkRegex.exec(text)) !== null) {
          // Add text before the match
          if (match.index > lastIndex) {
            fragment.appendChild(
              document.createTextNode(text.slice(lastIndex, match.index))
            );
          }
          
          // Create the link element
          const link = document.createElement('a');
          link.href = match[2];
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          link.className = 'text-sky hover:underline';
          link.textContent = match[1];
          fragment.appendChild(link);
          
          lastIndex = match.index + match[0].length;
        }
        
        // Add remaining text
        if (lastIndex < text.length) {
          fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
        }
        
        // Replace the text node with the fragment
        textNode.parentNode?.replaceChild(fragment, textNode);
      }
    });
    
    if (hasChanges) {
      editorRef.current.innerHTML = tempDiv.innerHTML;
      // Trigger onChange to update parent state
      onChange(tempDiv.innerHTML);
    }
  }, [onChange]);

  // Handle input changes
  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      // Don't save "<br>" or empty paragraph as content
      const isEmpty = html === '<br>' || html === '<p><br></p>' || html === '' || html === '<div><br></div>';
      onChange(isEmpty ? '' : html);
    }
  }, [onChange]);

  // Handle keyup to convert markdown links after typing
  const handleKeyUp = useCallback((e: React.KeyboardEvent) => {
    // Convert markdown links when user types ')' which could complete a link
    if (e.key === ')') {
      convertMarkdownLinks();
    }
  }, [convertMarkdownLinks]);

  // Handle paste to clean up unwanted formatting while preserving bold/italic/links
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    
    // Get clipboard data as HTML
    const clipboardData = e.clipboardData;
    let pastedData = clipboardData.getData('text/html');
    
    // If no HTML, get plain text
    if (!pastedData) {
      pastedData = clipboardData.getData('text/plain');
      // Escape HTML entities to prevent injection
      pastedData = pastedData
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      // Convert plain text newlines to <br> or <p>
      pastedData = pastedData
        .split('\n\n')
        .map(para => para.trim() ? `<p>${para.replace(/\n/g, '<br>')}</p>` : '')
        .join('');
    } else {
      // Clean up HTML - only allow specific tags
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = pastedData;
      
      // Remove unwanted tags and attributes
      const allowedTags = ['B', 'I', 'STRONG', 'EM', 'A', 'P', 'BR', 'UL', 'OL', 'LI', 'SPAN', 'DIV'];
      const allElements = tempDiv.querySelectorAll('*');
      
      allElements.forEach(el => {
        const tagName = el.tagName.toUpperCase();
        
        // Remove disallowed tags but keep their content
        if (!allowedTags.includes(tagName)) {
          const parent = el.parentNode;
          while (el.firstChild) {
            parent?.insertBefore(el.firstChild, el);
          }
          parent?.removeChild(el);
        } else if (tagName === 'A') {
          // Clean up links - keep href and add styling
          const href = el.getAttribute('href');
          el.removeAttribute('style');
          el.setAttribute('target', '_blank');
          el.setAttribute('rel', 'noopener noreferrer');
          // Add Tailwind classes for blue link color
          el.className = 'text-sky hover:underline';
          if (href) {
            el.setAttribute('href', href);
          }
        } else if (tagName === 'SPAN' || tagName === 'DIV') {
          // Convert spans and divs to plain text or remove while preserving content
          const parent = el.parentNode;
          while (el.firstChild) {
            parent?.insertBefore(el.firstChild, el);
          }
          parent?.removeChild(el);
        } else {
          // Remove styles from allowed elements (p, b, i, etc.)
          el.removeAttribute('style');
          el.removeAttribute('class');
        }
      });
      
      pastedData = tempDiv.innerHTML;
    }
    
    // Insert the cleaned HTML
    execCommand('insertHTML', pastedData);
  }, [execCommand]);

  // Sync editor when value changes externally
  const setEditorContent = useCallback((node: HTMLDivElement | null) => {
    if (node && node !== editorRef.current) {
      editorRef.current = node;
      // Set initial content
      if (value && node.innerHTML !== value) {
        node.innerHTML = value;
      } else if (!value) {
        node.innerHTML = '';
      }
    }
  }, [value]);
  
  // Update editor content when value prop changes (for external updates)
  useEffect(() => {
    if (editorRef.current) {
      const currentHtml = editorRef.current.innerHTML;
      const newHtml = value || '';
      // Only update if different to avoid cursor jumps
      if (currentHtml !== newHtml && 
          !(currentHtml === '<br>' && newHtml === '') &&
          !(currentHtml === '' && newHtml === '<br>')) {
        editorRef.current.innerHTML = newHtml;
      }
    }
  }, [value]);

  return (
    <div className={`border rounded-lg overflow-hidden ${isFocused ? 'ring-1 ring-indigo-500 border-indigo-500' : 'border-slate-200'} ${className}`}>
      {/* Toolbar */}
      <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={toggleBold}
          className="h-8 w-8 p-0 hover:bg-slate-200"
          title="Grassetto (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={toggleItalic}
          className="h-8 w-8 p-0 hover:bg-slate-200"
          title="Corsivo (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </Button>
        <div className="w-px h-5 bg-slate-300 mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={insertLink}
          className="h-8 w-8 p-0 hover:bg-slate-200"
          title="Inserisci link"
        >
          <LinkIcon className="w-4 h-4" />
        </Button>
      </div>

      {/* Editor */}
      <div
        ref={setEditorContent}
        contentEditable
        onInput={handleInput}
        onPaste={handlePaste}
        onKeyUp={handleKeyUp}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="rich-text-editor p-3 min-h-[120px] text-sm outline-none whitespace-pre-wrap empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400"
        data-placeholder={placeholder}
        style={{ minHeight: `${rows * 20}px` }}
        suppressContentEditableWarning
      />
      
      {/* Help text */}
      <div className="px-3 py-1.5 bg-slate-50 border-t border-slate-200 text-xs text-slate-500">
        Puoi usare la toolbar o digitare <code className="bg-slate-200 px-1 rounded">[testo](URL)</code> per i link
      </div>
    </div>
  );
}

// Helper component to render rich text content safely
interface RichTextContentProps {
  html: string;
  className?: string;
}

export function RichTextContent({ html, className = "" }: RichTextContentProps) {
  // Clean HTML to only allow safe tags
  const cleanHtml = (input: string): string => {
    if (!input) return '';
    
    // SSR-safe: return input as-is if document is not available
    if (typeof document === 'undefined') {
      return input;
    }
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = input;
    
    // Remove script and style tags
    const scripts = tempDiv.querySelectorAll('script, style, iframe, object, embed');
    scripts.forEach(el => el.remove());
    
    // Ensure links open in new tab
    const links = tempDiv.querySelectorAll('a');
    links.forEach(link => {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
      link.classList.add('text-sky', 'hover:underline');
    });
    
    // Ensure bold/italic tags are properly styled
    const bolds = tempDiv.querySelectorAll('b, strong');
    bolds.forEach(el => el.classList.add('font-bold'));
    
    const italics = tempDiv.querySelectorAll('i, em');
    italics.forEach(el => el.classList.add('italic'));
    
    return tempDiv.innerHTML;
  };

  return (
    <div 
      className={`rich-text-content ${className}`}
      dangerouslySetInnerHTML={{ __html: cleanHtml(html) }}
    />
  );
}

// Helper to strip HTML tags for plain text display (e.g., excerpts)
export function stripHtml(html: string): string {
  if (!html) return '';
  // SSR-safe: use regex fallback if document is not available
  if (typeof document === 'undefined') {
    return html.replace(/<[^>]*>/g, '');
  }
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}
