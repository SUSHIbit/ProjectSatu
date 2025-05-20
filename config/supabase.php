<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Supabase Configuration
    |--------------------------------------------------------------------------
    |
    | This file contains the configuration for Supabase integration
    |
    */

    'url' => env('SUPABASE_URL', ''),
    'key' => env('SUPABASE_KEY', ''),
    'secret_key' => env('SUPABASE_SECRET', ''),

    'storage' => [
        'music_bucket' => env('SUPABASE_STORAGE_MUSIC_BUCKET', 'music'),
        'wallpaper_bucket' => env('SUPABASE_STORAGE_WALLPAPER_BUCKET', 'wallpapers'),
    ],
];