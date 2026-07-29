<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SavedGame extends Model
{
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
