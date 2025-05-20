<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class WallpaperRequest extends FormRequest
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
            'name' => 'required|string|max:255',
        ];

        // For store (POST) requests, image_file is required unless image_url is provided
        if ($this->isMethod('post')) {
            $rules['image_file'] = 'required_without:image_url|file|mimes:jpeg,png,jpg,gif|max:5120'; // 5MB max
            $rules['image_url'] = 'required_without:image_file|string|url';
        } 
        
        // For update (PUT/PATCH) requests, image_file is optional
        if ($this->isMethod('put') || $this->isMethod('patch')) {
            $rules['image_file'] = 'nullable|file|mimes:jpeg,png,jpg,gif|max:5120';
            $rules['image_url'] = 'nullable|string|url';
        }

        return $rules;
    }
}