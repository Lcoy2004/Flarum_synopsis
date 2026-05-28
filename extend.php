<?php

/*
 * This file is part of lcoy/synopsis.
 *
 * (c) Lcoy
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Lcoy\Synopsis;

use Flarum\Api\Endpoint;
use Flarum\Api\Resource\DiscussionResource;
use Flarum\Extend;
use Flarum\Tags\Api\Resource\TagResource;
use Flarum\Tags\Tag;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__.'/js/dist/forum.js')
        ->css(__DIR__.'/resources/less/forum/extension.less'),

    (new Extend\Frontend('admin'))
        ->js(__DIR__.'/js/dist/admin.js'),

    new Extend\Locales(__DIR__.'/resources/locale'),

    (new Extend\Model(Tag::class))
        ->cast('excerpt_length', 'int')
        ->cast('rich_excerpts', 'bool')
        ->cast('excerpt_media_max_height', 'int')
        ->cast('excerpt_video_max_width', 'int'),

    (new Extend\Settings())
        ->default('lcoy-synopsis.excerpt_length', 200)
        ->default('lcoy-synopsis.rich-excerpts', false)
        ->default('lcoy-synopsis.excerpt-type', 'first')
        ->default('lcoy-synopsis.excerpt_media_max_height', 200)
        ->default('lcoy-synopsis.excerpt_video_max_width', 320)
        ->serializeToForum('synopsis.excerpt_length', 'lcoy-synopsis.excerpt_length', 'intVal')
        ->serializeToForum('synopsis.rich_excerpts', 'lcoy-synopsis.rich-excerpts', 'boolVal')
        ->serializeToForum('synopsis.excerpt_type', 'lcoy-synopsis.excerpt-type')
        ->serializeToForum('synopsis.excerpt_media_max_height', 'lcoy-synopsis.excerpt_media_max_height', 'intVal')
        ->serializeToForum('synopsis.excerpt_video_max_width', 'lcoy-synopsis.excerpt_video_max_width', 'intVal'),

    (new Extend\User())
        ->registerPreference('showSynopsisExcerpts', 'boolVal', true)
        ->registerPreference('showSynopsisExcerptsOnMobile', 'boolVal', false),

    (new Extend\ApiResource(TagResource::class))
        ->fields(Api\AddTagResourceFields::class),

    (new Extend\ApiResource(DiscussionResource::class))
        ->endpoint(['index', 'update'], function (Endpoint\Index|Endpoint\Update $endpoint) {
            $settings = resolve('flarum.settings');

            if ($settings->get('lcoy-synopsis.excerpt-type') === 'last') {
                $endpoint->addDefaultInclude(['lastPost']);
            } else {
                $endpoint->addDefaultInclude(['firstPost']);
            }

            return $endpoint;
        }),
];
