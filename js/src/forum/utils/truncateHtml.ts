const MAX_MEDIA_COUNT = 10;
const MEDIA_SELECTOR = 'img:not(.emoji), video, iframe';

function isEmoji(el: Element): boolean {
  if (el.tagName !== 'IMG') return false;
  if (el.classList.contains('emoji')) return true;
  const parent = el.parentElement;
  return parent !== null && parent.tagName === 'SPAN' && parent.classList.contains('flamoji');
}

function isMediaElement(el: Element): boolean {
  const tag = el.tagName;
  return (tag === 'IMG' && !isEmoji(el)) || tag === 'VIDEO' || tag === 'IFRAME';
}

function queryMedia(root: Element | Document): Element[] {
  return Array.from(root.querySelectorAll(MEDIA_SELECTOR)).filter((el) => !isEmoji(el));
}

function queryMediaFirst(root: Element | Document): Element | null {
  const all = root.querySelectorAll(MEDIA_SELECTOR);
  for (let i = 0; i < all.length; i++) {
    if (!isEmoji(all[i])) return all[i];
  }
  return null;
}

export default function (html: string, length: number, mediaMaxHeight?: number, mediaCount: number = 1): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const body = doc.body;

  const safeMediaCount = Math.min(Math.max(0, mediaCount), MAX_MEDIA_COUNT);

  if (mediaMaxHeight === 0 || safeMediaCount === 0) {
    queryMedia(body).forEach((el) => el.remove());
  } else {
    const mediaElements = queryMedia(body);
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
      const el = node as Element;
      if (isMediaElement(el)) {
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
  const allBr = root.querySelectorAll('br');
  for (let i = 0; i < allBr.length; i++) {
    const br = allBr[i];
    const parent = br.parentElement;
    if (!parent) continue;

    let prev: ChildNode | null = br.previousSibling;
    while (prev && prev.nodeType === Node.TEXT_NODE && !prev.textContent!.trim()) {
      prev = prev.previousSibling;
    }

    let next: ChildNode | null = br.nextSibling;
    while (next && next.nodeType === Node.TEXT_NODE && !next.textContent!.trim()) {
      next = next.nextSibling;
    }

    const prevIsBreakOrNothing = !prev || (prev.nodeType === Node.ELEMENT_NODE && (prev as Element).tagName === 'BR');
    const nextIsBreakOrNothing = !next || (next.nodeType === Node.ELEMENT_NODE && (next as Element).tagName === 'BR');

    if (prevIsBreakOrNothing || nextIsBreakOrNothing) {
      br.remove();
      continue;
    }

    const prevHasText = prev.nodeType === Node.TEXT_NODE && prev.textContent!.trim().length > 0;
    const nextHasText = next.nodeType === Node.TEXT_NODE && next.textContent!.trim().length > 0;

    if (!prevHasText && !nextHasText) {
      br.remove();
    }
  }
}

const VOID_ELEMENTS = new Set(['br', 'hr', 'img', 'input', 'area', 'base', 'col', 'embed', 'source', 'track', 'wbr']);
const MEDIA_TAGS = new Set(['VIDEO', 'IFRAME', 'AUDIO', 'OBJECT', 'EMBED']);

function removeEmptyElements(root: HTMLElement): void {
  const toRemove: Element[] = [];
  const walker = root.ownerDocument!.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
  let node: Node | null;
  while ((node = walker.nextNode())) {
    const el = node as Element;
    if (el === root) continue;
    if (VOID_ELEMENTS.has(el.tagName.toLowerCase())) continue;
    if (MEDIA_TAGS.has(el.tagName)) continue;
    if (el.querySelector('img, video, iframe, audio')) continue;
    if ((el.textContent || '').trim().length > 0) continue;
    toRemove.push(el);
  }

  for (let i = toRemove.length - 1; i >= 0; i--) {
    const el = toRemove[i];
    if (!el.parentNode) continue;
    el.remove();
  }
}

function isMediaOnlyNode(node: Node, cache?: WeakMap<Element, boolean>): boolean {
  if (node.nodeType !== Node.ELEMENT_NODE) return false;
  const el = node as Element;

  if (cache?.has(el)) return cache.get(el)!;

  const hasMedia = queryMediaFirst(el) !== null;
  if (!hasMedia) {
    cache?.set(el, false);
    return false;
  }
  const clone = el.cloneNode(true) as Element;
  queryMedia(clone).forEach((m) => m.remove());
  const result = (clone.textContent || '').trim().length === 0;
  cache?.set(el, result);
  return result;
}

function wrapMediaRow(root: HTMLElement, doc: Document): void {
  const allMedia = queryMedia(root);
  if (allMedia.length <= 1) return;

  const mediaCache = new WeakMap<Element, boolean>();
  const countCache = new WeakMap<Element, number>();

  const candidates = root.querySelectorAll('*');
  for (let i = 0; i < candidates.length; i++) {
    const el = candidates[i];
    if (el.childNodes.length < 2) continue;

    const children = Array.from(el.childNodes) as Node[];
    const mediaGroups: Node[][] = [];
    let currentGroup: Node[] = [];

    for (const child of children) {
      if (isMediaOnlyNode(child, mediaCache)) {
        currentGroup.push(child);
      } else if (child.nodeType === Node.TEXT_NODE && !(child.textContent || '').trim()) {
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
      const row = doc.createElement('span');
      row.className = 'Synopsis-media-row';
      const firstNode = group[0];
      firstNode.parentNode!.insertBefore(row, firstNode);
      for (const node of group) {
        row.appendChild(node);
      }
    }
  }

  allMedia.forEach((el) => {
    let ancestor: Element | null = el.parentElement;
    while (ancestor && ancestor !== root) {
      if (isMediaOnlyNode(ancestor, mediaCache)) {
        let count = countCache.get(ancestor);
        if (count === undefined) {
          count = queryMedia(ancestor).length;
          countCache.set(ancestor, count);
        }
        if (count > 1) {
          ancestor.classList.add('Synopsis-media-row');
          break;
        }
      }
      ancestor = ancestor.parentElement;
    }
  });
}
