<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class SavedGame extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'saved_games';

    protected $fillable = [
        'user_id',
        'game_id',
        'title',
        'thumb',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
