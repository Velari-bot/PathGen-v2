# AI Fortnite Coach - PathGen

A beautiful, production-ready landing page for an AI-powered Fortnite coaching platform.

## Features

- **Modern Design**: Dark theme with neon accent colors and JetBrains Mono font
- **Responsive Layout**: Optimized for all screen sizes
- **Firebase Integration**: User authentication and data storage
- **Smooth Animations**: Fade-in and slide-up effects
- **Production Ready**: Clean code structure with proper error handling

## Tech Stack

- React 18
- Tailwind CSS
- Firebase (Authentication & Firestore)
- React Router
- Lucide React (Icons)

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/
│   ├── LandingPage.js      # Main landing page
│   └── ConfirmationPage.js # Success confirmation page
├── firebase.js             # Firebase configuration
├── App.js                  # Main app with routing
├── index.js                # React entry point
└── index.css               # Global styles with Tailwind
```

## Firebase Configuration

The Firebase configuration is already set up with your provided credentials. The app includes:

- User authentication with email/password
- Firestore database for storing early access signups
- Analytics integration

## Design Features

- **Color Scheme**: Black background with white text and #00FFAA accent
- **Typography**: JetBrains Mono font family
- **Animations**: Smooth fade-in and slide-up transitions
- **Icons**: Lucide React icons for features
- **Responsive**: Mobile-first design approach

## Pages

1. **Landing Page** (`/`): Main signup form with features showcase
2. **Confirmation Page** (`/success`): Success message after signup

The landing page matches your design exactly with:
- Centered layout with proper spacing
- Three feature cards with icons
- Signup form with validation
- Early-bird pricing highlight
- "Made in Bolt" footer branding
