<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SavedGame;

class WishlistController extends Controller
{
    /**
     * Get all saved games for the authenticated user.
     */
    public function getSavedGames()
    {
        $games = auth()->user()->savedGames;
        return response()->json($games);
    }

    /**
     * Add a game to the wishlist.
     */
    public function saveGame(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'gameId' => 'required',
            'thumb' => 'nullable|string',
        ]);

        $userId = auth()->id();
        $gameId = $request->input('gameId');
        $title = $request->input('title');
        $thumb = $request->input('thumb');

        // Check if already saved by this user by ID or title
        $existing = SavedGame::where('user_id', $userId)
            ->where(function ($query) use ($gameId, $title) {
                $query->where('game_id', $gameId)
                      ->orWhere('title', 'like', $title);
            })
            ->first();

        if ($existing) {
            return response()->json(['error' => 'Game already saved'], 400);
        }

        $savedGame = SavedGame::create([
            'user_id' => $userId,
            'game_id' => $gameId,
            'title' => $title,
            'thumb' => $thumb,
        ]);

        return response()->json($savedGame, 201);
    }

    /**
     * Remove a game from the wishlist.
     */
    public function removeSavedGame($gameId)
    {
        SavedGame::where('user_id', auth()->id())
            ->where('game_id', $gameId)
            ->delete();

        return response()->json(['message' => 'Game removed from saved list']);
    }

    /**
     * Get preferences for the authenticated user.
     */
    public function getPreferences()
    {
        $user = auth()->user();
        return response()->json([
            'language' => $user->language ?? 'en',
            'currency' => $user->currency ?? 'USD',
        ]);
    }

    /**
     * Update user preferences.
     */
    public function updatePreferences(Request $request)
    {
        $request->validate([
            'language' => 'nullable|string',
            'currency' => 'nullable|string',
        ]);

        $user = auth()->user();
        if ($request->has('language')) {
            $user->language = $request->input('language');
        }
        if ($request->has('currency')) {
            $user->currency = $request->input('currency');
        }
        $user->save();

        return response()->json([
            'language' => $user->language,
            'currency' => $user->currency,
        ]);
    }
}
