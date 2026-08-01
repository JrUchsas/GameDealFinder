<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Comment extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'comments';

    protected $fillable = [
        'user_id',
        'user_name',
        'game_title',
        'rating',
        'comment',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', '_id');
    }
}
