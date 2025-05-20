<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class SupabaseService
{
    protected $supabaseUrl;
    protected $supabaseKey;
    protected $supabaseSecretKey;
    
    public function __construct()
    {
        $this->supabaseUrl = config('supabase.url');
        $this->supabaseKey = config('supabase.key');
        $this->supabaseSecretKey = config('supabase.secret_key');
    }
    
    /**
     * Upload a file to Supabase Storage
     */
    public function uploadFile(string $filePath, string $fileName, string $bucket): string
    {
        $fileContent = file_get_contents($filePath);
        $path = Str::slug(pathinfo($fileName, PATHINFO_FILENAME)) . '_' . time() . '.' . pathinfo($fileName, PATHINFO_EXTENSION);
        
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->supabaseKey,
                'Content-Type' => 'application/octet-stream',
            ])->put(
                "{$this->supabaseUrl}/storage/v1/object/{$bucket}/{$path}",
                $fileContent
            );
            
            if ($response->successful()) {
                return "{$this->supabaseUrl}/storage/v1/object/public/{$bucket}/{$path}";
            } else {
                Log::error('Supabase upload failed', [
                    'response' => $response->json(),
                    'status' => $response->status()
                ]);
                throw new \Exception('Failed to upload file to Supabase: ' . $response->body());
            }
        } catch (\Exception $e) {
            Log::error('Supabase upload exception', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }
    
    /**
     * Delete a file from Supabase Storage
     */
    public function deleteFile(string $fileName, string $bucket): bool
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->supabaseKey,
            ])->delete(
                "{$this->supabaseUrl}/storage/v1/object/{$bucket}/{$fileName}"
            );
            
            return $response->successful();
        } catch (\Exception $e) {
            Log::error('Supabase delete exception', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return false;
        }
    }
    
    /**
     * Verify a Supabase JWT token
     */
    public function verifyToken(string $token)
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->supabaseSecretKey,
                'Content-Type' => 'application/json',
            ])->get(
                "{$this->supabaseUrl}/auth/v1/user",
                ['access_token' => $token]
            );
            
            if ($response->successful()) {
                return $response->json();
            } else {
                return null;
            }
        } catch (\Exception $e) {
            Log::error('Supabase token verification failed', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return null;
        }
    }
}