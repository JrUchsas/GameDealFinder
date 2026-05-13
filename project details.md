# Game Deal Finder - Project Details

## Overview
Game Deal Finder is a modern full-stack web application designed to help gamers find the best prices for video games across multiple digital storefronts (Steam, GOG, Epic Games, etc.), track their availability, and verify system compatibility.

## Technical Stack

### Frontend
- **Framework:** React (Vite)
- **Styling:** Tailwind CSS (Modern, responsive dark theme)
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **Data Visualization:** Recharts (Interactive price history and market comparison)
- **Localization:** react-i18next (Multi-language support: English, Spanish)
- **State Management:** React Hooks (useState, useEffect)

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (using Mongoose ODM)
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs. Uses `sessionStorage` in the frontend for **Auto-Logout** when the browser is closed.
- **Middleware:** Custom authentication middleware

### External APIs
- **CheapShark API:** Used for fetching game stores, searching games, and retrieving detailed deal information via `/deals` and `/games` endpoints.
- **GamerPower API:** Powers the "Freebie Central" section, providing real-time data on active game giveaways.
- **RAWG API:** Provides detailed game information, including PC system requirements.
- **CrackWatcher API:** Used for checking the "crack status" of saved games in the user profile.

## Key Features

### 1. Advanced Discovery & Filtering
- Integrated CheapShark `/deals` API for powerful discovery.
- Filters for **Max Price**, **Min. Metacritic Score**, and **Sale Status**.
- Multiple sorting options: Deal Rating, Title, Savings, Price, Metacritic, and Reviews.

### 2. "Freebie" Central
- A dedicated page showcasing live giveaways and free-to-keep games across all platforms.
- Direct links to claim giveaways on Epic Games, Steam, Indiegala, and more.

### 3. Price Analytics & Visualization
- **Interactive Graphs:** Uses Recharts to visualize the current market price spread against the game's historical all-time low.
- Visual price badges and savings percentages for quick assessment.

### 4. User Personalization & Localization
- **Multi-language Support:** Integrated `i18next` for seamless switching between English and Spanish.
- **User Preferences:** Users can save their preferred language and currency to their profile, persisted in MongoDB.

### 5. "Can I Run It?" (System Requirements)
- Detailed PC specifications (Minimum and Recommended) fetched via RAWG API integration.
- Intelligent formatting of technical requirements for easy reading.

### 6. Personalized Watchlist (Saved Games)
- Authenticated users can save games of interest to their profile.
- Persistent storage of saved games with automated "Crack Status" tracking (Cracked/Uncracked/Unreleased).

## Project Structure

### Backend (`/backend`)
- `index.js`: Main entry point with API proxies for CheapShark, GamerPower, and RAWG.
- `models/`:
  - `User.js`: Enhanced schema including user preferences.
  - `SavedGame.js`: Schema for games saved by users.
- `routes/`:
  - `auth.js`: Authentication logic.
  - `user.js`: User-specific data management (saved games, preferences, crack status).

### Frontend (`/frontend`)
- `src/pages/`:
  - `Home.jsx`: Advanced deal search and discovery.
  - `Freebies.jsx`: Live giveaway tracker.
  - `Profile.jsx`: User dashboard for saved games and settings.
- `src/components/`:
  - `FilterSidebar.jsx`: UI for advanced discovery filters.
  - `PriceHistory.jsx`: Recharts implementation for price comparison.
  - `SystemRequirements.jsx`: Clean display for PC specifications.
  - `DealDetails.jsx`: Comprehensive game view with analytics and requirements.

## Current Progress
The project has evolved from a basic search tool into a feature-rich gaming utility. It successfully bridges data from four major gaming APIs into a cohesive, personalized user experience.
