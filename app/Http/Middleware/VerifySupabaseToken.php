<?php

namespace App\Http\Middleware;

use App\Models\User;
use App\Services\SupabaseService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VerifySupabaseToken
{
    protected $supabaseService;
    
    public function __construct(SupabaseService $supabaseService)
    {
        $this->supabaseService = $supabaseService;
    }
    
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken();
        
        if (!$token) {
            return response()->json(['message' => 'Unauthorized. Token required.'], 401);
        }
        
        $userData = $this->supabaseService->verifyToken($token);
        
        if (!$userData || empty($userData['id'])) {
            return response()->json(['message' => 'Unauthorized. Invalid token.'], 401);
        }
        
        // Find or create a user based on Supabase ID
        $user = User::firstOrCreate(
            ['supabase_id' => $userData['id']],
            [
                'name' => $userData['user_metadata']['full_name'] ?? $userData['email'],
                'email' => $userData['email'],
            ]
        );
        
        // Add user data to the request
        $request->merge(['supabase_user' => $user]);
        
        return $next($request);
    }
}