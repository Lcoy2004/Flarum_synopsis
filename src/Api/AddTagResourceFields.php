<?php

/*
 * This file is part of lcoy/synopsis.
 *
 * (c) Lcoy
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Lcoy\Synopsis\Api;

use Flarum\Api\Schema;
use Flarum\Tags\Tag;

class AddTagResourceFields
{
    public function __invoke()
    {
        return [
            Schema\Boolean::make('richExcerpts')
                ->description('Whether or not rich text excerpts are enabled for this tag.')
                ->nullable()
                ->writable(),

            Schema\Integer::make('excerptLength')
                ->description('The length of excerpts for this tag.')
                ->nullable()
                ->writable()
                ->set(function (Tag $tag, ?string $value) {
                    $tag->excerpt_length = $value === null ? null : (int) $value;
                }),

            Schema\Integer::make('excerptMediaMaxHeight')
                ->description('Maximum height of images and videos in excerpts for this tag.')
                ->nullable()
                ->writable()
                ->set(function (Tag $tag, ?string $value) {
                    $tag->excerpt_media_max_height = $value === null ? null : (int) $value;
                }),

            Schema\Integer::make('excerptVideoMaxWidth')
                ->description('Maximum width of videos in excerpts for this tag.')
                ->nullable()
                ->writable()
                ->set(function (Tag $tag, ?string $value) {
                    $tag->excerpt_video_max_width = $value === null ? null : (int) $value;
                }),

            Schema\Integer::make('excerptMediaCount')
                ->description('Maximum number of media elements to display in excerpts for this tag.')
                ->nullable()
                ->writable()
                ->set(function (Tag $tag, ?string $value) {
                    $tag->excerpt_media_count = $value === null ? null : (int) $value;
                }),
        ];
    }
}
