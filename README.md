# Game Deal Finder

A feature-rich fullstack web application to find the best deals on video games, track giveaways, and check PC system requirements.

## Features

- **Advanced Search:** Filter by price, rating, and sort by various criteria.
- **Freebie Central:** Real-time tracking of game giveaways via GamerPower API.
- **Price History:** Interactive charts showing current deals vs. historical lows.
- **System Requirements:** Check PC specs (Min/Rec) for any game.
- **Localization:** Multi-language support (English & Spanish).
- **User Profiles:** Save games to a personalized watchlist and manage preferences. Features **Auto-Logout** on browser close for security.

## Technical Stack

- **Frontend:** React, Tailwind CSS, Vite, Recharts, i18next.
- **Backend:** Node.js, Express, Mongoose, MongoDB, JWT.
- **APIs:** CheapShark, GamerPower, RAWG, CrackWatcher.

## Getting Started

### Prerequisites

- Node.js & npm
- MongoDB account (Atlas)
- RAWG API Key (Get one at [rawg.io/apidocs](https://rawg.io/apidocs))

### 1. Setup Backend

1. Go to the `backend` directory.
2. Create a `.env` file with:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   RAWG_API_KEY=your_rawg_api_key
   ```
