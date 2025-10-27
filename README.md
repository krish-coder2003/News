📰 React News Feed Application
Project Overview
This is a modern, responsive News Feed application built using React functional components and hooks. It fetches and displays live news articles from the NewsAPI.org service, providing a smooth user experience with features like searching, category filtering, and theme toggling.

This project was developed to demonstrate proficiency in contemporary React development practices, state management using hooks (useState, useEffect), asynchronous data fetching, and modular styling techniques (CSS Modules).

🚀 Key Features
Live Data Fetching: Articles are fetched in real-time from the NewsAPI.org endpoint.

Article Display: Clearly presents the Title, Image, Description/Short Content, and Source for each news item.

Keyword Search: Includes a dedicated search bar to filter articles by any keyword or phrase.

Category Filtering (Bonus): Users can quickly filter headlines by categories (e.g., Technology, Sports, Business).

Loading & Error States: Robust handling for data fetching, clearly showing "Loading..." or specific error messages to the user.

Dark/Light Theme Toggle (Bonus): Allows users to switch between light and dark modes for better viewing comfort.

🛠️ Tech Stack & Requirements

Category,Technology,Purpose
Frontend,React.js (Functional Components),Core UI Library
State Management,"React Hooks (useState, useEffect, useCallback)",Managing application state and side effects
Styling,CSS Modules,"Clean, modular, and component-scoped styling (responsive design)"
API,NewsAPI.org,Source for live news data
Icons,Heroicons,"UI elements (Search, Theme Toggle)"

⚙️ Setup and Installation Guide
Follow these steps to get a local copy of the project running on your machine.

Prerequisites
You must have Node.js and npm (or yarn) installed.

1.Clone the Repository:
git clone <YOUR_GITHUB_REPO_URL>
cd <your-project-folder-name>

2.Install Dependencies:
npm install
# or
yarn install

3.Configure API Key:

Obtain a free API key from NewsAPI.org.

Open the file src/App.jsx.

Replace the placeholder line with your actual key:
// src/App.jsx
const API_KEY = 'YOUR_NEWS_API_KEY'; // <-- Update this line

4.Run the Application:
npm run dev
# or
yarn dev
The application will now be running on http://localhost:5173 (or similar port).

📂 Project Structure
The codebase is organized into modular components for clarity and maintainability:

src/
├── components/
│   ├── ArticleCard.jsx         // Displays single news item
│   ├── ArticleCard.module.css  // Styles for the card
│   ├── CategoryFilter.jsx      // Bonus: Filtering component
│   ├── Header.jsx              // Contains title and theme toggle
│   ├── SearchBar.jsx           // Handles keyword input
│   └── ... (other CSS modules)
└── App.jsx                     // Main component: handles state, fetching, and layout
🔗 Live Demo & Repository
You can view the deployed version of this project and the source code here:
Item,Link
Live Site (Netlify),<INSERT YOUR NETLIFY LINK HERE>
GitHub Repository,<INSERT YOUR GITHUB REPO LINK HERE>
