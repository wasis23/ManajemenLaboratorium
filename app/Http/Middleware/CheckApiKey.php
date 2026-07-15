<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckApiKey
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $expectedKey = env('SIMLAB_API_KEY');

        if (!$expectedKey) {
            return response()->json([
                'success' => false,
                'message' => 'API Key is not configured on the server.'
            ], 500);
        }

        $apiKey = $request->header('X-API-KEY') ?: $request->query('api_key');

        if ($apiKey !== $expectedKey) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized: Invalid API Key.'
            ], 401);
        }

        return $next($request);
    }
}
