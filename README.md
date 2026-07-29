# Game Deal Finder 🎮🏷️

Game Deal Finder is a modern full-stack web application built with **PHP Laravel 12**, **Inertia.js**, **React**, and **Tailwind CSS**. It helps gamers discover the best video game deals across digital storefronts, track active game giveaways, visualize historical price trends, check PC hardware requirements, and manage a personal wishlist with real-time crack status tracking.

---

## 🛠️ Technical Stack

- **Backend Framework:** PHP 8.2+ / Laravel 12
- **Frontend Framework:** Inertia.js + React 18
- **Styling:** Tailwind CSS (Modern dark mode theme)
- **Authentication:** Laravel Breeze (Session-based auth)
- **Database:** SQLite (Default, self-contained local storage) / MongoDB support
- **Data Visualization:** Recharts (Price snapshot & store market comparison)
- **Localization:** `react-i18next` (English & Spanish multi-language support)
- **Build Tool:** Vite

---

## 🌐 External APIs Integrated

1. **CheapShark API:** Powers game deal searches, storefront listings, and pricing comparisons across Steam, GOG, Epic Games, Humble Store, and more.
2. **GamerPower API:** Drives the *Freebie Central* page with real-time game giveaways and free-to-keep titles.
3. **RAWG API:** Provides game details, background artwork, and PC hardware system requirements.
4. **CrackWatcher API:** Tracks crack status (*Cracked / Uncracked / Unreleased*) for wishlisted games in user profiles.

---

## ✨ Key Features

### 1. Advanced Discovery & Filtering
- Search games by title or discover trending deals.
- Filter deals by **Max Price**, **Min. Metacritic Score**, and **On Sale Only**.
- Multiple sorting options: *Deal Rating, Title, Savings, Price, Metacritic, and Reviews*.

### 2. "Freebie" Central
- Real-time tracker for live giveaways across Epic Games, Steam, GOG, Indiegala, and more.
- Direct links to claim free games before promotions expire.

### 3. Price Analytics & Visualization
- **Recharts Integration:** Interactive price comparison chart comparing current store deals against historical all-time low prices.
- Visual savings percentages and best-recorded price badges.

### 4. User Personalization & Localization
- **Multi-Language Support:** Instant switching between **English (EN)** and **Spanish (ES)**.
- **User Preferences:** Save language and currency preferences to your user profile.

### 5. "Can I Run It?" System Requirements
- Hardware requirements (Minimum & Recommended specs) fetched from RAWG.
- Direct quick-link to hardware verification.

### 6. My Wishlist (Saved Games) & Crack Tracker
- Authenticated users can save games to their personal wishlist.
- Automated crack status tracking for saved titles (*Cracked*, *Uncracked*, *Unreleased*).

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your system:
- **PHP** >= 8.2
- **Composer** >= 2.0
- **Node.js** >= 18.0 & **npm**

---

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/game-deal-finder.git
   cd "game-deal-finder"
   ```

2. **Install PHP dependencies:**
   ```bash
   composer install
   ```

3. **Install JavaScript dependencies:**
   ```bash
   npm install
   ```

4. **Environment Configuration:**
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   Ensure `.env` contains your RAWG API Key:
   ```env
   RAWG_API_KEY=your_rawg_api_key_here
   ```

5. **Generate Application Key:**
   ```bash
   php artisan key:generate
   ```

6. **Run Database Migrations:**
   ```bash
   php artisan migrate
   ```

---

## 💻 Running the Application

Launch both the Laravel backend server and Vite dev server concurrently with a single command:

```bash
composer run dev
```

Then visit **http://127.0.0.1:8000** in your browser.

*(Alternatively, run `php artisan serve` and `npm run dev` in separate terminal windows).*

---

## 📁 Project Structure

```
├── app/
│   ├── Http/Controllers/
│   │   ├── GameController.php       # CheapShark, GamerPower, RAWG, CrackWatcher proxies & page renders
│   │   ├── WishlistController.php   # Wishlist & preferences management
│   │   └── ProfileController.php    # User account settings
│   └── Models/
│       ├── User.php                 # User model with preferences
│       └── SavedGame.php            # Wishlisted games model
├── resources/js/
│   ├── Components/
│   │   ├── Navbar.jsx               # Header with navigation & language switcher
│   │   ├── DealDetails.jsx          # Detailed game view & store comparison
│   │   ├── PriceHistory.jsx         # Recharts price snapshot visualization
│   │   ├── SystemRequirements.jsx   # PC spec details
│   │   ├── FilterSidebar.jsx        # Discovery filters sidebar
│   │   ├── GameList.jsx             # Deals grid layout
│   │   └── SearchBar.jsx            # Game search bar
│   ├── Pages/
│   │   ├── Home.jsx                 # Main deals & discovery page
│   │   ├── Freebies.jsx             # Live giveaways page
│   │   └── Profile.jsx              # Wishlist & user settings dashboard
│   ├── i18n.js                      # English / Spanish translation setup
│   └── app.jsx                      # Inertia application bootstrap
├── routes/
│   └── web.php                      # Application routes & API proxy endpoints
└── database/
    └── migrations/                  # SQLite schema definitions
```

---

## 🛣️ API & Route Reference

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/` | Home page | No |
| `GET` | `/freebies` | Freebies page | No |
| `GET` | `/profile` | User Wishlist & Settings page | Yes |
| `GET` | `/api/stores` | Fetch digital storefront details | No |
| `GET` | `/api/deals` | Fetch game deals with filters | No |
| `GET` | `/api/games/search` | Search games by title | No |
| `GET` | `/api/freebies` | Fetch live giveaways | No |
| `GET` | `/api/games/details/{title}` | Fetch RAWG game specs | No |
| `GET` | `/api/user/crack-status/{title}` | Fetch CrackWatcher status | No |
| `GET` | `/api/user/saved-games` | Get wishlisted games | Yes |
| `POST` | `/api/user/saved-games` | Save game to wishlist | Yes |
| `DELETE` | `/api/user/saved-games/{gameId}` | Remove game from wishlist | Yes |
| `GET` | `/api/user/preferences` | Get language & currency settings | Yes |
| `PUT` | `/api/user/preferences` | Update user preferences | Yes |

---

## 📜 License

This project is open-sourced under the [MIT License](LICENSE).
