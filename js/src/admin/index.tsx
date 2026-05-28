import app from 'flarum/admin/app';
import extendEditTagModal from './extenders/extendEditTagModal';
import typeOptions from './util/typeOptions';

export { default as extend } from './extend';

app.initializers.add('lcoy-synopsis', () => {
  app.registry
    .for('lcoy-synopsis')
    .registerSetting(function () {
      if (!('flarum-tags' in flarum.extensions)) return;
      return (
        <div className="Form-group">
          <p className="helpText">{app.translator.trans('lcoy-synopsis.admin.settings.tags-enabled')}</p>
        </div>
      );
    })
    .registerSetting({
      label: app.translator.trans('lcoy-synopsis.admin.settings.excerpt-length.label'),
      help: app.translator.trans('lcoy-synopsis.admin.settings.excerpt-length.help'),
      setting: 'lcoy-synopsis.excerpt_length',
      type: 'number',
    })
    .registerSetting({
      label: app.translator.trans('lcoy-synopsis.admin.settings.rich-excerpts.label'),
      help: app.translator.trans('lcoy-synopsis.admin.settings.rich-excerpts.help'),
      setting: 'lcoy-synopsis.rich-excerpts',
      type: 'boolean',
    })
    .registerSetting({
      label: app.translator.trans('lcoy-synopsis.admin.settings.excerpt-type.label'),
      help: app.translator.trans('lcoy-synopsis.admin.settings.excerpt-type.help'),
      setting: 'lcoy-synopsis.excerpt-type',
      options: typeOptions(),
      type: 'select',
    })
    .registerSetting({
      label: app.translator.trans('lcoy-synopsis.admin.settings.excerpt-media-max-height.label'),
      help: app.translator.trans('lcoy-synopsis.admin.settings.excerpt-media-max-height.help'),
      setting: 'lcoy-synopsis.excerpt_media_max_height',
      type: 'number',
    })
    .registerSetting({
      label: app.translator.trans('lcoy-synopsis.admin.settings.excerpt-video-max-width.label'),
      help: app.translator.trans('lcoy-synopsis.admin.settings.excerpt-video-max-width.help'),
      setting: 'lcoy-synopsis.excerpt_video_max_width',
      type: 'number',
    });

  extendEditTagModal();
});
