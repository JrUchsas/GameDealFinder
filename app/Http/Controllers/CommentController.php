<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Comment;

class CommentController extends Controller
{
    /**
     * Get comments and average rating for a game.
     */
    public function getComments($gameTitle)
    {
        // Clean title for fuzzy matching across game editions
        $cleanTitle = preg_replace('/[™®©]/u', '', $gameTitle);
        $coreTitle = trim(preg_replace('/\b(DIRECTORS?|CUT|GOTY|GAME OF THE YEAR|DELUXE|ULTIMATE|ENHANCED|REMASTERED|REMAKE|EDITION)\b/i', '', $cleanSearchTitle ?? $cleanTitle));
        $firstWord = strtok($coreTitle, ' ');

        // Search by exact match or first word overlap
        $comments = Comment::where('game_title', 'like', '%' . ($firstWord ?: $gameTitle) . '%')
            ->orderBy('created_at', 'desc')
            ->get();

        $avgRating = $comments->avg('rating');

        return response()->json([
            'comments' => $comments,
            'avg_rating' => $avgRating ? round((float)$avgRating, 1) : null,
            'total_reviews' => $comments->count(),
        ]);
    }

    /**
     * Add a comment and rating for a game.
     */
    public function addComment(Request $request)
    {
        $request->validate([
            'game_title' => 'required|string',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|max:1000',
        ]);

        $user = auth()->user();

        $comment = Comment::create([
            'user_id' => (string) ($user->_id ?? $user->id),
            'user_name' => $user->name ?? 'Gamer',
            'game_title' => $request->input('game_title'),
            'rating' => (int) $request->input('rating'),
            'comment' => $request->input('comment'),
        ]);

        return response()->json($comment, 201);
    }
}
