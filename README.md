# Women's Safety & Wellness App

A full-stack MERN application focused on women's safety, wellness, and health tracking.

## Prerequisites
- Node.js installed
- MongoDB installed and running locally (or a cloud URI)

## Quick Start

The project is divided into two parts: `client` (Frontend) and `server` (Backend). You need to run both terminals simultaneously.

### 1. Start the Backend Server
```bash
cd server
npm install  # Install dependencies if not already done
npm start
```
The server will run on `http://localhost:5000`.
Ensure your MongoDB is running.

### 2. Start the Frontend Client
```bash
cd client
npm install  # Install dependencies if not already done
npm run dev
```
The application will be accessible at `http://localhost:5173`.

## Features
- **Landing Page**: Soft pastel theme, feature highlights.
- **Authentication**: Login and Signup with detailed health profile.
- **Health Tracking**: Track period cycles, pregnancy status, and more.
- **Emergency**: SOS button placeholder.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express, MongoDB, Mongoose
