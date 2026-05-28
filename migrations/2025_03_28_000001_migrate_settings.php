<?php

/*
 * This file is part of lcoy/synopsis.
 *
 * (c) Lcoy
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        $db = $schema->getConnection();

        foreach (['excerpt_length', 'rich-excerpts', 'excerpt-type', 'disable-when-searching'] as $setting) {
            $db->table('settings')
                ->where('key', "ianm-synopsis.$setting")
                ->update(['key' => "lcoy-synopsis.$setting"]);
        }
    },
    'down' => function (Builder $schema) {
        // Do nothing.
    },
];
