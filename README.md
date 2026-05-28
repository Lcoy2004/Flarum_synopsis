# Lcoy Synopsis

![License](https://img.shields.io/badge/license-MIT-blue.svg) [![Latest Stable Version](https://img.shields.io/packagist/v/lcoy/synopsis.svg)](https://packagist.org/packages/lcoy/synopsis)

A [Flarum](https://github.com/flarum/flarum) extension which adds summary excerpts to the discussion list with media control.

## Features

As well as displaying an excerpt as a summary (with configurable length):

- All display strings are translatable (includes Chinese translation)
- Toggle between displaying plain or rich content in the summary (admin)
- Choose from using either the first or latest post in the summary (admin)
- Control media display in rich excerpts (only show one image or video)
- Configure maximum height and width for images and videos in excerpts
- User preference to show/hide summaries
- User preference to enable summaries on mobile

## Installation

```bash
composer require lcoy/synopsis
```

### Updating

```bash
composer require lcoy/synopsis
php flarum migrate
php flarum cache:clear
```

## Links

- [Github](https://github.com/lcoy/synopsis)
- [Packagist](https://packagist.org/packages/lcoy/synopsis)
