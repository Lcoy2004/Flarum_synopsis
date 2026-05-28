import Extend from 'flarum/common/extenders';
import Tag from 'ext:flarum/tags/common/models/Tag';

export default [
  new Extend.Model(Tag) //
    .attribute<boolean>('richExcerpts')
    .attribute<number>('excerptLength')
    .attribute<number>('excerptMediaMaxHeight')
    .attribute<number>('excerptVideoMaxWidth'),
];
