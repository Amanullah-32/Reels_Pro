# 🎬 Reel Uploader

A simple, full-stack video reel sharing platform built with **Next.js**. This application allows users to register, log in, and upload short video clips (reels) which are processed and served via the ImageKit API.

---

## 🚀 Features

*   **User Authentication:** Secure login and registration powered by **NextAuth.js**.
*   **Video Management:** High-performance video uploads and streaming using the **ImageKit API**.
*   **Database:** Persistent storage for user profiles and video metadata using **MongoDB**.
*   **Containerization:** Fully dockerized for consistent development and deployment environments.
*   **Responsive Design:** Optimized for both desktop and mobile viewing.

---

## 🛠️ Tech Stack

| Component | Technology |
| :--- | :--- |
| **Framework** | [Next.js](https://nextjs.org/) (App Router) |
| **Database** | [MongoDB](https://www.mongodb.com/) |
| **Auth** | [NextAuth.js](https://next-auth.js.org/) |
| **Media Hosting** | [ImageKit.io](https://imagekit.io/) |
| **Containerization** | [Docker](https://www.docker.com/) |

---

## 📋 Prerequisites

Before running the project, ensure you have the following installed:
*   [Node.js](https://nodejs.org/) (v22+)
*   [Docker](https://www.docker.com/)
*   An [ImageKit](https://imagekit.io/) account for API keys.
*   A [MongoDB](https://www.mongodb.com/atlas/database) connection string.

---

## ⚙️ Setup & Environment Variables

Create a `.env` file in the root directory and add your credentials:

```env
# NextAuth Configuration
NEXTAUTH_SECRET=your_secret_here

# MongoDB Configuration
MONGODB_URI=your_mongodb_connection_uri

# ImageKit Configuration
NEXT_PUBLIC_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
NEXT_PUBLIC_URL_ENDPOINT=your_imagekit_url_endpoint

🐳 Running with Docker
The easiest way to get the project up and running is using Docker.

Build and start the containers:

Bash
docker build -t nextjs-app .
docker run -p 3000:3000 --env-file .env.local nextjs-app
Access the application:
Open http://localhost:3000 in your browser.

💻 Local Development (Non-Docker)
Install dependencies:

Bash
npm install
Run the development server:

Bash
npm run dev
Build for production:

Bash
npm run build
npm start
📂 Project Structure
/app - Contains the Next.js pages, API routes, and layouts.

/components - Reusable UI components.

/lib - Utility functions for MongoDB connection and ImageKit initialization.

/models - Mongoose schemas for Users and Reels.

Dockerfile - Configuration [
ARG NEXT_PUBLIC_PUBLIC_KEY=
ARG NEXT_PUBLIC_URL_ENDPOINT=
] for containerization.

🛡️ License
This project is open-source. Feel free to use and modify it as needed.