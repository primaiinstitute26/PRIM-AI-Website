import DOMPurify from 'dompurify';

DOMPurify.addHook('uponSanitizeAttribute', (_node, data) => {
  if (data.attrName === 'style') {
    const match = data.attrValue.match(
      /^text-align:\s*(left|right|center|justify);?\s*$/,
    );
    if (!match) {
      data.keepAttr = false;
    } else {
      data.attrValue = `text-align: ${match[1]};`;
    }
  }
});

export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 's',
      'h2', 'h3',
      'ul', 'ol', 'li',
      'blockquote',
      'pre', 'code',
      'a', 'img',
      'hr',
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'style'],
  });
}
