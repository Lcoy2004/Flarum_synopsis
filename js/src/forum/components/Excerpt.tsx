import Component, { ComponentAttrs } from 'flarum/common/Component';
import Post from 'flarum/common/models/Post';
import { truncate } from 'flarum/common/utils/string';
import type Mithril from 'mithril';
import truncateHtml from '../utils/truncateHtml';

export interface ExcerptAttrs extends ComponentAttrs {
  post: Post;
  length: number;
  richExcerpt: boolean;
  mediaMaxHeight?: number;
  videoMaxWidth?: number;
  mediaCount?: number;
}

export default class Excerpt extends Component<ExcerptAttrs> {
  post!: Post;
  length!: number;
  richExcerpt!: boolean;
  mediaMaxHeight!: number;
  videoMaxWidth!: number;
  mediaCount!: number;

  private cachedHtml: string | null = null;
  private cacheKey: string = '';

  oninit(vnode: Mithril.Vnode<ExcerptAttrs, this>) {
    super.oninit(vnode);

    this.post = this.attrs.post;
    this.length = this.attrs.length;
    this.richExcerpt = this.attrs.richExcerpt;
    this.mediaMaxHeight = this.attrs.mediaMaxHeight ?? 200;
    this.videoMaxWidth = this.attrs.videoMaxWidth ?? 320;
    this.mediaCount = this.attrs.mediaCount ?? 1;
  }

  view() {
    const style: Record<string, string> = {};

    if (this.richExcerpt && this.mediaMaxHeight > 0) {
      style['--synopsis-media-max-height'] = this.mediaMaxHeight + 'px';
      style['--synopsis-video-max-width'] = this.videoMaxWidth + 'px';
    }

    return <div className="Synopsis-excerpt" style={style}>{this.getContent()}</div>;
  }

  getContent(): Mithril.Vnode | string {
    if (this.richExcerpt) {
      const contentHtml = this.post.contentHtml() ?? '';
      const key = `${contentHtml}|${this.length}|${this.mediaMaxHeight}|${this.mediaCount}`;

      if (this.cachedHtml !== null && this.cacheKey === key) {
        return m.trust(this.cachedHtml);
      }

      this.cachedHtml = truncateHtml(contentHtml, this.length, this.mediaMaxHeight, this.mediaCount);
      this.cacheKey = key;
      return m.trust(this.cachedHtml);
    }

    return truncate(this.post.contentPlain() ?? '', this.length);
  }
}
