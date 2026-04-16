# 🎬 Reel Uploader

A high-performance, full-stack video reel sharing platform built with **Next.js**. This application allows users to share short video clips, interact with a community through likes and comments, and manage their personal profiles. All media is seamlessly processed and served via the ImageKit API.

---

## 🚀 Features

* **User Authentication:** Secure login and registration powered by **NextAuth.js**.
* **Video Management:** * High-performance video uploads and streaming using the **ImageKit API**.
    * **Delete own videos:** Maintain full control over your content.
* **Social Interactions:** * **Likes:** Show appreciation for your favorite reels.
    * **Comments:** Engage in discussions on videos.
    * **Comment Management:** Delete your own comments to keep your interactions clean.
* **User Profiles:** Dedicated profile pages to view your uploaded content and account details.
* **Database:** Persistent storage for user profiles, video metadata, likes, and comments using **MongoDB**.
* **Containerization:** Fully dockerized for consistent development and deployment environments.
* **Responsive Design:** Optimized for both desktop and mobile viewing.

---

## 🛠️ Tech Stack

| Component | Technology |
| :--- | :--- |
| **Framework** | [Next.js](https://nextjs.org/) (App Router) |
| **Database** | [MongoDB](https://www.mongodb.com/) (Mongoose ODM) |
| **Auth** | [NextAuth.js](https://next-auth.js.org/) |
| **Media Hosting** | [ImageKit.io](https://imagekit.io/) |
| **Styling** | Tailwind CSS |
| **Containerization** | [Docker](https://www.docker.com/) |

---

## 📋 Prerequisites

Before running the project, ensure you have the following installed:
* [Node.js](https://nodejs.org/) (v22+)
* [Docker](https://www.docker.com/)
* An [ImageKit](https://imagekit.io/) account for API keys.
* A [MongoDB](https://www.mongodb.com/atlas/database) connection string.

---

## ⚙️ Setup & Environment Variables

Create a `.env` file in the root directory and add your credentials:

```env
# NextAuth Configuration
NEXTAUTH_SECRET=your_secret_here
NEXTAUTH_URL=http://localhost:3000

# MongoDB Configuration
MONGODB_URI=your_mongodb_connection_uri

# ImageKit Configuration
NEXT_PUBLIC_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
NEXT_PUBLIC_URL_ENDPOINT=your_imagekit_url_endpoint
```
🐳 Running with Docker
The easiest way to get the project up and running is using Docker.

Dockerfile - Configuration for containerization.
```bash
ARG NEXT_PUBLIC_PUBLIC_KEY=
ARG NEXT_PUBLIC_URL_ENDPOINT=
```

Build and start the containers:

```Bash
docker build -t nextjs-app .
docker run -p 3000:3000 --env-file .env.local nextjs-app
```
- Access the application:
Open http://localhost:3000 in your browser.

💻 Local Development (Non-Docker)
Install dependencies:

```Bash
npm install
```
Run the development server:

```Bash
npm run dev
```
Build for production:

```Bash
npm run build
npm start
```
📂 Project Structure
/app - Contains the Next.js pages, API routes, and layouts.

/components - Reusable UI components.

/lib - Utility functions for MongoDB connection and ImageKit initialization.

/models - Mongoose schemas for Users and Reels.



🛡️ License
This project is open-source. Feel free to use and modify it as needed.