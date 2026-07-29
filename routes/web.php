<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\WishlistController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Page Routes
Route::get('/', [GameController::class, 'index'])->name('home');
Route::get('/freebies', [GameController::class, 'freebies'])->name('freebies');

Route::middleware('auth')->group(function () {
    Route::get('/profile', function () {
        return Inertia::render('Profile');
    })->name('profile');

    Route::get('/profile/edit', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// API Proxies
Route::prefix('api')->group(function () {
    Route::get('/stores', [GameController::class, 'getStores']);
    Route::get('/games/search', [GameController::class, 'searchGames']);
    Route::get('/deals', [GameController::class, 'getDeals']);
    Route::get('/games/{id}', [GameController::class, 'getGameDeals']);
    Route::get('/freebies', [GameController::class, 'getFreebies']);
    Route::get('/games/details/{title}', [GameController::class, 'getRawgDetails']);
    Route::get('/user/crack-status/{title}', [GameController::class, 'getCrackStatus']);

    // Authenticated Wishlist & Preferences
    Route::middleware('auth')->group(function () {
        Route::get('/user/saved-games', [WishlistController::class, 'getSavedGames']);
        Route::post('/user/saved-games', [WishlistController::class, 'saveGame']);
        Route::delete('/user/saved-games/{gameId}', [WishlistController::class, 'removeSavedGame']);
        Route::get('/user/preferences', [WishlistController::class, 'getPreferences']);
        Route::put('/user/preferences', [WishlistController::class, 'updatePreferences']);
    });
});

require __DIR__.'/auth.php';
