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
        if (!$schema->hasColumn('tags', 'excerpt_length')) {
            $schema->table('tags', function (Blueprint $table) {
                $table->integer('excerpt_length')->nullable()->unsigned();
            });
        }

        if (!$schema->hasColumn('tags', 'rich_excerpts')) {
            $schema->table('tags', function (Blueprint $table) {
                $table->boolean('rich_excerpts')->nullable();
            });
        }
    },
    'down' => function (Builder $schema) {
        $columns = [];
        if ($schema->hasColumn('tags', 'excerpt_length')) {
            $columns[] = 'excerpt_length';
        }
        if ($schema->hasColumn('tags', 'rich_excerpts')) {
            $columns[] = 'rich_excerpts';
        }
        if (!empty($columns)) {
            $schema->table('tags', function (Blueprint $table) use ($columns) {
                $table->dropColumn($columns);
            });
        }
    },
];
