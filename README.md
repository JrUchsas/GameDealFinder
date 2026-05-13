# Game Deal Finder

A feature-rich fullstack web application to find the best deals on video games, track giveaways, and check PC system requirements.

## Features

- **Advanced Search:** Filter by price, rating, and sort by various criteria.
- **Freebie Central:** Real-time tracking of game giveaways via GamerPower API.
- **Price Analytics:** Interactive Recharts graphs showing current deals vs. historical lows.
- **System Requirements:** Check PC specs (Min/Rec) for any game with integrated "Can I Run It?" links.
- **My Wishlist:** Save games to a personalized watchlist with automated crack status tracking.
- **Localization:** Multi-language support (English & Spanish) with user-saved preferences.
- **Smart Navigation:** Intelligent route handling that resets page states on navigation.
- **Security:** Session-based authentication with **Auto-Logout** on browser close.

## Technical Stack

- **Frontend:** React (Vite), Tailwind CSS, Recharts, i18next, React Router.
- **Backend:** Node.js, Express, Mongoose, MongoDB, JWT.
- **APIs:** CheapShark, GamerPower, RAWG, GameStatus.

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
3. Run `npm install` and `npm start`.

### 2. Setup Frontend

1. Go to the `frontend` directory.
2. Run `npm install` and `npm run dev`.
3. Open `http://localhost:5173` in your browser.

## Project Structure

- `backend/`: Express server and MongoDB models.
- `frontend/`: React application with Tailwind CSS and Recharts.
- `project details.md`: Comprehensive technical and feature documentation.
