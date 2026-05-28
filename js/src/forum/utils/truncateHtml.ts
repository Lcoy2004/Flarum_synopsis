/**
 * Safely truncate an HTML string without breaking opening/closing tags.
 * Only characters in text nodes count towards the length.
 * Keeps a configurable number of image, video, or iframe elements.
 * @param html
 * @param length
 * @param mediaMaxHeight - 0 means hide all media
 * @param mediaCount - maximum number of media elements to keep (default: 1)
 */
const MAX_MEDIA_COUNT = 10;

export default function (html: string, length: number, mediaMaxHeight?: number, mediaCount: number = 1): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const body = doc.body;

  const safeMediaCount = Math.min(Math.max(0, mediaCount), MAX_MEDIA_COUNT);

  if (mediaMaxHeight === 0 || safeMediaCount === 0) {
    const allMedia = body.querySelectorAll('img, video, iframe');
    allMedia.forEach((el) => el.remove());
  } else {
    const mediaElements = body.querySelectorAll('img, video, iframe');
    for (let i = safeMediaCount; i < mediaElements.length; i++) {
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

  removeEmptyElements(body);
  collapseBreaks(body);

  wrapMediaRow(body, doc);

  return body.innerHTML;
}

function collapseBreaks(root: HTMLElement): void {
  const allBr = Array.from(root.querySelectorAll('br'));
  for (const br of allBr) {
    const parent = br.parentElement;
    if (!parent) continue;

    const siblings = Array.from(parent.childNodes);
    const idx = siblings.indexOf(br);

    const prev: ChildNode | undefined = siblings[idx - 1];
    const next: ChildNode | undefined = siblings[idx + 1];

    const prevIsBreakOrNothing = !prev || (prev.nodeType === Node.ELEMENT_NODE && (prev as Element).tagName.toLowerCase() === 'br');
    const nextIsBreakOrNothing = !next || (next.nodeType === Node.ELEMENT_NODE && (next as Element).tagName.toLowerCase() === 'br');

    if (prevIsBreakOrNothing || nextIsBreakOrNothing) {
      br.remove();
      continue;
    }

    const prevHasText = prev.nodeType === Node.TEXT_NODE && (prev.textContent?.trim().length ?? 0) > 0;
    const nextHasText = next.nodeType === Node.TEXT_NODE && (next.textContent?.trim().length ?? 0) > 0;

    if (!prevHasText && !nextHasText) {
      br.remove();
    }
  }
}

const VOID_ELEMENTS = new Set(['br', 'hr', 'img', 'input', 'area', 'base', 'col', 'embed', 'source', 'track', 'wbr']);

function removeEmptyElements(root: HTMLElement): void {
  let removed = true;

  while (removed) {
    removed = false;

    const elementsToRemove: Element[] = [];
    const walker = root.ownerDocument!.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);

    let node;
    while ((node = walker.nextNode())) {
      const el = node as Element;
      if (el === root) continue;
      if (VOID_ELEMENTS.has(el.tagName.toLowerCase())) continue;

      const hasMedia = el.querySelector('img, video, iframe') !== null;
      if (hasMedia) continue;

      const textContent = el.textContent?.trim() || '';
      if (textContent.length > 0) continue;

      elementsToRemove.push(el);
    }

    for (const el of elementsToRemove) {
      el.remove();
      removed = true;
    }
  }
}

function isMediaOnlyNode(node: Node): boolean {
  if (node.nodeType !== Node.ELEMENT_NODE) return false;
  const el = node as Element;
  const hasMedia = el.querySelector('img, video, iframe') !== null;
  if (!hasMedia) return false;
  const text = (el.textContent || '').trim();
  return text.length === 0;
}

function wrapMediaRow(root: HTMLElement, doc: Document): void {
  const allMedia = root.querySelectorAll('img, video, iframe');
  if (allMedia.length <= 1) return;

  const children = Array.from(root.childNodes);
  const mediaGroups: Node[][] = [];
  let currentGroup: Node[] = [];

  for (const child of children) {
    if (isMediaOnlyNode(child)) {
      currentGroup.push(child);
    } else {
      if (currentGroup.length > 1) {
        mediaGroups.push(currentGroup);
      }
      currentGroup = [];
    }
  }
  if (currentGroup.length > 1) {
    mediaGroups.push(currentGroup);
  }

  for (const group of mediaGroups) {
    const row = doc.createElement('div');
    row.className = 'Synopsis-media-row';
    const firstNode = group[0];
    firstNode.parentNode!.insertBefore(row, firstNode);
    for (const node of group) {
      row.appendChild(node);
    }
  }

  allMedia.forEach((el) => {
    let ancestor: Element | null = el.parentElement;
    while (ancestor && ancestor !== root) {
      if (isMediaOnlyNode(ancestor)) {
        const count = ancestor.querySelectorAll('img, video, iframe').length;
        if (count > 1) {
          ancestor.classList.add('Synopsis-media-row');
          break;
        }
      }
      ancestor = ancestor.parentElement;
    }
  });
}
