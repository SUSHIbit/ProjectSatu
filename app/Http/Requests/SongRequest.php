<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SongRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // We'll handle authorization with middleware
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        $rules = [
            'title' => 'required|string|max:255',
            'genre_id' => 'nullable|exists:genres,id',
            'wallpaper_id' => 'nullable|exists:wallpapers,id',
        ];

        // For store (POST) requests, audio_file is required unless audio_url is provided
        if ($this->isMethod('post')) {
            $rules['audio_file'] = 'required_without:audio_url|file|mimes:mp3,wav,ogg|max:10240'; // 10MB max
            $rules['audio_url'] = 'required_without:audio_file|string|url';
        } 
        
        // For update (PUT/PATCH) requests, audio_file is optional
        if ($this->isMethod('put') || $this->isMethod('patch')) {
            $rules['audio_file'] = 'nullable|file|mimes:mp3,wav,ogg|max:10240';
            $rules['audio_url'] = 'nullable|string|url';
        }

        return $rules;
    }
}
