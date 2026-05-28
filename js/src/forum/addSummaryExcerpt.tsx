import { extend } from 'flarum/common/extend';
import app from 'flarum/forum/app';
import DiscussionListState from 'flarum/forum/states/DiscussionListState';
import DiscussionListItem from 'flarum/forum/components/DiscussionListItem';
import ItemList from 'flarum/common/utils/ItemList';
import type Mithril from 'mithril';
import Excerpt from './components/Excerpt';

export default function addSummaryExcerpt() {
  extend(DiscussionListState.prototype, 'requestParams', function (params) {
    if (typeof params.include === 'string') {
      params.include = [params.include];
    } else {
      params.include = params.include || [];
    }

    if (app.forum.attribute<string>('synopsis.excerpt_type') === 'first') {
      params.include.push('firstPost');
    } else {
      params.include.push('lastPost');
    }
  });

  extend(DiscussionListItem.prototype, 'infoItems', function (items: ItemList<Mithril.Children>) {
    const discussion = this.attrs.discussion;

    if (app.session.user && !app.session.user.preferences()?.showSynopsisExcerpts) {
      return;
    }

    const tags = discussion.tags();
    let tag;
    if (tags) {
      tag = tags[tags.length - 1];
    }

    const excerptPost = app.forum.attribute<string>('synopsis.excerpt_type') === 'first' ? discussion.firstPost() : discussion.lastPost();
    const excerptLength = typeof tag?.excerptLength() === 'number' ? tag?.excerptLength() : app.forum.attribute<number>('synopsis.excerpt_length');
    const richExcerpt = typeof tag?.richExcerpts() === 'boolean' ? tag?.richExcerpts() : app.forum.attribute<boolean>('synopsis.rich_excerpts');
    const onMobile = app.session.user?.preferences()?.showSynopsisExcerptsOnMobile ?? false;

    const mediaMaxHeight = typeof tag?.excerptMediaMaxHeight() === 'number' ? tag?.excerptMediaMaxHeight() : app.forum.attribute<number>('synopsis.excerpt_media_max_height');
    const videoMaxWidth = typeof tag?.excerptVideoMaxWidth() === 'number' ? tag?.excerptVideoMaxWidth() : app.forum.attribute<number>('synopsis.excerpt_video_max_width');
    const mediaCount = typeof tag?.excerptMediaCount() === 'number' ? tag?.excerptMediaCount() : app.forum.attribute<number>('synopsis.excerpt_media_count');

    // A length of zero means we don't want a synopsis for this discussion, so do nothing.
    if (excerptLength === 0) {
      return;
    }

    if (excerptPost) {
      const excerpt = <Excerpt post={excerptPost} length={excerptLength} richExcerpt={richExcerpt} mediaMaxHeight={mediaMaxHeight} videoMaxWidth={videoMaxWidth} mediaCount={mediaCount} />;

      items.add('excerpt', excerpt, -100);
      onMobile && items.add('excerptM', excerpt, -100);
    }
  });
}
