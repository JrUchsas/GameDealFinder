<?php

namespace App\Models;

use MongoDB\Laravel\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    protected $connection = 'mongodb';
    protected $collection = 'users';

    protected $fillable = [
        'name',
        'email',
        'password',
        'language',
        'currency',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Accessor to normalize legacy Node.js bcryptjs ($2a$, $2b$) hashes to PHP's ($2y$)
     * and handle invalid formats gracefully.
     */
    public function getPasswordAttribute($value)
    {
        if (!$value) {
            return $value;
        }

        if (str_starts_with($value, '$2a$') || str_starts_with($value, '$2b$')) {
            return '$2y$' . substr($value, 4);
        }

        if (!str_starts_with($value, '$2y$')) {
            return '$2y$12$unsupported_legacy_hash_format_please_register_new_account';
        }

        return $value;
    }

    public function savedGames()
    {
        return $this->hasMany(SavedGame::class, 'user_id', '_id');
    }
}
