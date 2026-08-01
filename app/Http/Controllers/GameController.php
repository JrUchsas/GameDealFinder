<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class GameController extends Controller
{
    private const CHEAPSHARK_API = 'https://www.cheapshark.com/api/1.0';

    private function httpClient()
    {
        return Http::withUserAgent('GameDealFinderApp/1.0 (contact@gamedealfinder.org)')->withoutVerifying();
    }

    /**
     * Render the homepage.
     */
    public function index()
    {
        return Inertia::render('Home');
    }

    /**
     * Render the Freebies page.
     */
    public function freebies()
    {
        return Inertia::render('Freebies');
    }

    /**
     * Proxy: Fetch all stores from CheapShark.
     */
    public function getStores()
    {
        try {
            $response = $this->httpClient()->get(self::CHEAPSHARK_API . '/stores');
            return response()->json($response->json(), $response->status());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch stores: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Proxy: Search games by title from CheapShark.
     */
    public function searchGames(Request $request)
    {
        $title = $request->query('title');
        if (!$title) {
            return response()->json(['error' => 'Title is required'], 400);
        }

        try {
            $response = $this->httpClient()->get(self::CHEAPSHARK_API . '/games', [
                'title' => $title
            ]);
            return response()->json($response->json(), $response->status());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to search games: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Proxy: Fetch deals from CheapShark with filters.
     */
    public function getDeals(Request $request)
    {
        try {
            $response = $this->httpClient()->get(self::CHEAPSHARK_API . '/deals', $request->query());
            return response()->json($response->json(), $response->status());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch deals: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Proxy: Fetch deals for a specific game ID from CheapShark.
     */
    public function getGameDeals($id)
    {
        try {
            $response = $this->httpClient()->get(self::CHEAPSHARK_API . '/games', [
                'id' => $id
            ]);
            return response()->json($response->json(), $response->status());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch game deals: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Proxy: Fetch active giveaways from GamerPower.
     */
    public function getFreebies()
    {
        try {
            $response = $this->httpClient()->get('https://www.gamerpower.com/api/giveaways');
            return response()->json($response->json(), $response->status());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch freebies: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Proxy: Fetch game details and specifications from RAWG.
     */
    public function getRawgDetails($title)
    {
        try {
            $apiKey = env('RAWG_API_KEY');
            if (!$apiKey || $apiKey === 'your_rawg_api_key') {
                return response()->json(['error' => 'RAWG API configuration missing'], 500);
            }

            // Search for the game to get the ID/slug
            $searchResponse = $this->httpClient()->get('https://api.rawg.io/api/games', [
                'search' => $title,
                'key' => $apiKey
            ]);

            $results = $searchResponse->json()['results'] ?? [];
            if (empty($results)) {
                return response()->json(['error' => 'Game not found on RAWG'], 404);
            }

            $gameId = $results[0]['id'];

            // Fetch details using the game ID
            $detailResponse = $this->httpClient()->get("https://api.rawg.io/api/games/{$gameId}", [
                'key' => $apiKey
            ]);

            return response()->json($detailResponse->json(), $detailResponse->status());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch system requirements: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Proxy: Fetch crack status from CrackWatcher with intelligent core title extraction.
     */
    public function getCrackStatus($title)
    {
        try {
            // Clean trademark symbols
            $cleanSearchTitle = preg_replace('/[™®©]/u', '', $title);

            $response = $this->httpClient()->get('https://crackwatcher.com/api/v1/games', [
                'search' => $cleanSearchTitle
            ]);

            $data = $response->json()['data'] ?? [];

            // Fallback: If 0 results returned, strip edition keywords (e.g. DIRECTORS CUT, GOTY, REMASTERED)
            if (empty($data)) {
                $coreTitle = preg_replace('/\b(DIRECTORS?|CUT|GOTY|GAME OF THE YEAR|DELUXE|ULTIMATE|ENHANCED|REMASTERED|REMAKE|EDITION)\b/i', '', $cleanSearchTitle);
                $coreTitle = trim(preg_replace('/\s+/', ' ', $coreTitle));

                if (!empty($coreTitle) && $coreTitle !== $cleanSearchTitle) {
                    $response = $this->httpClient()->get('https://crackwatcher.com/api/v1/games', [
                        'search' => $coreTitle
                    ]);
                    $data = $response->json()['data'] ?? [];
                }
            }

            if (empty($data)) {
                return response()->json(null);
            }

            $crackedMatch = null;
            $partialMatch = null;
            $cleanS = strtolower(preg_replace('/[^a-z0-9]/', '', $title));

            foreach ($data as $game) {
                $gTitle = strtolower($game['title'] ?? '');
                $cleanG = preg_replace('/[^a-z0-9]/', '', $gTitle);

                // Check if clean titles match or overlap
                if ($cleanG === $cleanS || str_contains($cleanG, $cleanS) || str_contains($cleanS, $cleanG)) {
                    if (!empty($game['is_cracked'])) {
                        $crackedMatch = $game;
                        break;
                    }
                    if (!$partialMatch) {
                        $partialMatch = $game;
                    }
                }
            }

            $result = $crackedMatch ?? $partialMatch ?? $data[0];
            return response()->json($result);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch crack status: ' . $e->getMessage()], 500);
        }
    }
}
