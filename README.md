📋 User Directory – React + Vite + TailwindCSS

A responsive and fast User Directory Table built using React (Vite), TailwindCSS, and the ReqRes API.
It supports searching, filtering, sorting, client-side pagination, API pagination, and dynamic page size selection.

Live Demo: (add your Vercel link here)

🚀 Features
🔎 Search

Search users by name or email (real-time filtering)

📨 Filtering

Filter by email domain (e.g., @reqres.in)

Filter by first letter of the first name

↕️ Sorting

Sort by:

First name

Email

Sort direction toggle (↑ / ↓)

📄 Pagination

Adjustable rows per page: 3 / 6 / 12

Automatically updates when more data loads

Next/Prev navigation

🌐 API Pagination

“Load More API Pages” button

Fetches additional user pages from the ReqRes API

Automatically expands page size when more data loads

🖼️ Avatars

Each user entry shows a round profile image in the table.

🎨 Modern UI

TailwindCSS-based clean UI

Subtle table borders

Hover effects

Responsive layout

🛠️ Tech Stack
Technology	Purpose
React (Vite)	Fast frontend build system
TailwindCSS	Utility-first styling
ReqRes API	Mock API for user data
Vercel	Deployment
📦 Installation & Setup

Clone the repo:

git clone https://github.com/yourusername/table.git
cd table


Install dependencies:

npm install


Run locally:

npm run dev


Build for production:

npm run build


Preview the production build:

npm run preview

🚀 Deployment (Vercel)

Push your project to GitHub

Go to Vercel Dashboard

Click Add New → Project

Import your GitHub repo

Vercel detects Vite automatically

Click Deploy

You're done 🎉

📁 Project Structure
📦 frontend
 ┣ 📂 public
 ┣ 📂 src
 ┃ ┣ 📜 App.jsx
 ┃ ┣ 📜 index.css
 ┃ ┗ 📜 main.jsx
 ┣ 📜 index.html
 ┣ 📜 package.json
 ┣ 📜 tailwind.config.js
 ┣ 📜 postcss.config.js
 ┗ 📜 vite.config.js

🙌 Credits

API used: ReqRes (reqres.in) – a free fake REST API for testing.