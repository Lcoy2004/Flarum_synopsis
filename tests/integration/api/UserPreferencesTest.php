<?php

/*
 * This file is part of lcoy/synopsis.
 *
 * (c) Lcoy
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Lcoy\Synopsis\Tests\integration\api;

use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\Testing\integration\TestCase;
use Flarum\User\User;
use PHPUnit\Framework\Attributes\Test;

class UserPreferencesTest extends TestCase
{
    use RetrievesAuthorizedUsers;

    protected function setup(): void
    {
        parent::setup();

        $this->extension('flarum-tags', 'lcoy-synopsis');

        $this->prepareDatabase([
            User::class => [$this->normalUser()],
        ]);
    }

    #[Test]
    public function user_has_correct_default_preferences()
    {
        $this->database();
        /** @var User $user */
        $user = User::find($this->normalUser()['id']);

        $this->assertNotNull($user);
        $this->assertTrue($user->getPreferencesAttribute('')['showSynopsisExcerpts']);
        $this->assertFalse($user->getPreferencesAttribute('')['showSynopsisExcerptsOnMobile']);
    }
}
