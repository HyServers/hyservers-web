import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';

// Configure marked for security
marked.setOptions({
	gfm: true, // GitHub Flavored Markdown
	breaks: true // Convert \n to <br>
});

// Configure DOMPurify to allow safe HTML elements
const ALLOWED_TAGS = [
	'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
	'p', 'br', 'hr',
	'ul', 'ol', 'li',
	'blockquote', 'pre', 'code',
	'strong', 'em', 'b', 'i', 'u', 's', 'del', 'ins',
	'a', 'img',
	'table', 'thead', 'tbody', 'tr', 'th', 'td',
	'div', 'span'
];

const ALLOWED_ATTR = [
	'href', 'src', 'alt', 'title',
	'class', 'id',
	'target', 'rel'
];

/**
 * Renders markdown to sanitized HTML
 * Safe against XSS attacks
 */
export function renderMarkdown(content: string): string {
	if (!content) return '';

	// Parse markdown to HTML
	const rawHtml = marked.parse(content, { async: false }) as string;

	// Sanitize the HTML
	const cleanHtml = DOMPurify.sanitize(rawHtml, {
		ALLOWED_TAGS,
		ALLOWED_ATTR,
		ALLOW_DATA_ATTR: false,
		ADD_ATTR: ['target', 'rel'],
		// Force all links to open in new tab with security attributes
		RETURN_DOM: false,
		RETURN_DOM_FRAGMENT: false
	});

	// Post-process to add rel="noopener noreferrer" to external links
	return cleanHtml.replace(
		/<a\s+href="(https?:\/\/[^"]+)"/g,
		'<a href="$1" target="_blank" rel="noopener noreferrer"'
	);
}
