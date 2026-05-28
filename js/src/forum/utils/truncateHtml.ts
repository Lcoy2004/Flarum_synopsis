/**
 * Safely truncate an HTML string without breaking opening/closing tags.
 * Only characters in text nodes count towards the length.
 * Only keeps the first image, video, or iframe element.
 * @param html
 * @param length
 * @param mediaMaxHeight - 0 means hide all media
 */
export default function (html: string, length: number, mediaMaxHeight?: number): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const body = doc.body;

  if (mediaMaxHeight === 0) {
    const allMedia = body.querySelectorAll('img, video, iframe');
    allMedia.forEach((el) => el.remove());
  } else {
    const mediaElements = body.querySelectorAll('img, video, iframe');
    for (let i = 1; i < mediaElements.length; i++) {
      mediaElements[i].remove();
    }
  }

  let remaining = length;

  const truncateNode = (node: Node): void => {
    if (remaining === 0) {
      node.parentNode!.removeChild(node);
      return;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const tagName = (node as Element).tagName.toLowerCase();
      if (tagName === 'img' || tagName === 'video' || tagName === 'iframe') {
        return;
      }
    }

    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent!;
      if (text.length < remaining) {
        remaining -= text.length;
      } else {
        node.textContent = text.substring(0, remaining) + '\u2026';
        remaining = 0;
      }
      return;
    }

    const children = Array.from(node.childNodes);
    for (let i = 0; i < children.length; i++) {
      truncateNode(children[i]);
    }
  };

  truncateNode(body);

  return body.innerHTML;
}
