# PathGen - Next.js Discord OAuth Setup

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment Variables
Create a `.env.local` file with your values:
```bash
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
NEXTAUTH_SECRET=generate_a_strong_random_key
NEXTAUTH_URL=http://localhost:3000
```

Get your Discord OAuth credentials from: https://discord.com/developers/applications

Generate NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables:
   - `DISCORD_CLIENT_ID`
   - `DISCORD_CLIENT_SECRET`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
4. Deploy!

## Project Structure

```
pages/
├── api/
│   ├── auth/
│   │   └── [...nextauth].ts    # NextAuth configuration
│   └── user.ts                  # User API endpoint
├── login.tsx                    # Login page
├── dashboard.tsx               # Protected dashboard
└── _app.tsx                     # App wrapper with SessionProvider

lib/
└── firebase.ts                  # Firebase initialization

styles/
└── globals.css                  # Global styles
```

## Features

- ✅ Discord OAuth2 authentication
- ✅ User data stored in Firestore
- ✅ Session persistence
- ✅ Protected routes
- ✅ Auto-update user info on login
- ✅ Logout redirects to home
- ✅ TypeScript support
- ✅ Vercel deployment ready

## Firestore Structure

The `users` collection stores user data with the following fields:
- `discordId` - Unique Discord ID
- `username` - Discord username
- `discriminator` - Discord discriminator
- `avatarUrl` - Discord avatar URL
- `email` - User email
- `subscriptionStatus` - Boolean subscription status
- `createdAt` - Account creation timestamp
- `updatedAt` - Last update timestamp

## API Endpoints

- `GET /api/auth/signin` - Discord OAuth login
- `GET /api/auth/signout` - Logout
- `GET /api/auth/session` - Get current session
- `GET /api/user` - Get authenticated user data

## Pages

- `/` - Home page (redirects to login or dashboard)
- `/login` - Discord login page
- `/dashboard` - Protected dashboard page

## Environment Variables

```env
DISCORD_CLIENT_ID="your_discord_client_id"
DISCORD_CLIENT_SECRET="your_discord_client_secret"
NEXTAUTH_SECRET="your_random_secret"
NEXTAUTH_URL="http://localhost:3000"
```

## Deployment

For Vercel deployment:
1. Set all environment variables in Vercel dashboard
2. Ensure `NEXTAUTH_URL` matches your domain
3. Update Discord OAuth redirect URI to your Vercel URL

## Support

For issues or questions, check the NextAuth.js documentation: https://next-auth.js.org/