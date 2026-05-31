<?php

/*
 * This file is part of lcoy/synopsis.
 *
 * (c) Lcoy
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        if (!$schema->hasColumn('tags', 'excerpt_media_max_height')) {
            $schema->table('tags', function (Blueprint $table) {
                $table->integer('excerpt_media_max_height')->nullable()->unsigned();
            });
        }

        if (!$schema->hasColumn('tags', 'excerpt_video_max_width')) {
            $schema->table('tags', function (Blueprint $table) {
                $table->integer('excerpt_video_max_width')->nullable()->unsigned();
            });
        }
    },
    'down' => function (Builder $schema) {
        $columns = [];
        if ($schema->hasColumn('tags', 'excerpt_media_max_height')) {
            $columns[] = 'excerpt_media_max_height';
        }
        if ($schema->hasColumn('tags', 'excerpt_video_max_width')) {
            $columns[] = 'excerpt_video_max_width';
        }
        if (!empty($columns)) {
            $schema->table('tags', function (Blueprint $table) use ($columns) {
                $table->dropColumn($columns);
            });
        }
    },
];
