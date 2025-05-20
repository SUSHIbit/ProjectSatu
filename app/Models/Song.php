<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Song extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'genre_id',
        'audio_url',
        'wallpaper_id',
    ];

    public function genre()
    {
        return $this->belongsTo(Genre::class);
    }

    public function wallpaper()
    {
        return $this->belongsTo(Wallpaper::class);
    }
}