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
        if (!$schema->hasColumn('tags', 'excerpt_media_count')) {
            $schema->table('tags', function (Blueprint $table) {
                $table->integer('excerpt_media_count')->nullable()->unsigned();
            });
        }
    },
    'down' => function (Builder $schema) {
        if ($schema->hasColumn('tags', 'excerpt_media_count')) {
            $schema->table('tags', function (Blueprint $table) {
                $table->dropColumn('excerpt_media_count');
            });
        }
    },
];
