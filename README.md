# PathGen - Next.js Discord OAuth Setup

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment Variables
Copy `.env.example` to `.env` and fill in your values:
```bash
cp .env.example .env
```

Get your Discord OAuth credentials from: https://discord.com/developers/applications

Generate NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

### 3. Setup Database
```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 4. Run Development Server
```bash
npm run dev
```

### 5. Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables:
   - `DATABASE_URL` (use Vercel Postgres or PlanetScale)
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
├── dashboard.tsx                 # Protected dashboard
└── _app.tsx                      # App wrapper with SessionProvider

prisma/
└── schema.prisma                 # Database schema

lib/
└── prisma.ts                     # Prisma client

styles/
└── globals.css                   # Global styles
```

## Features

- ✅ Discord OAuth2 authentication
- ✅ User data stored in database
- ✅ Session persistence
- ✅ Protected routes
- ✅ Auto-update user info on login
- ✅ Logout redirects to home
- ✅ TypeScript support
- ✅ Vercel deployment ready

## Database Schema

```prisma
model User {
  id                String   @id @default(cuid())
  discordId         String   @unique
  username          String
  discriminator     String?
  avatarUrl         String?
  email             String?
  subscriptionStatus Boolean  @default(false)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}
```

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
DATABASE_URL="your_database_url"
DISCORD_CLIENT_ID="your_discord_client_id"
DISCORD_CLIENT_SECRET="your_discord_client_secret"
NEXTAUTH_SECRET="your_random_secret"
NEXTAUTH_URL="http://localhost:3000"
```

## Deployment

For Vercel deployment:
1. Use Vercel Postgres or PlanetScale for database
2. Set all environment variables in Vercel dashboard
3. Ensure `NEXTAUTH_URL` matches your domain
4. Update Discord OAuth redirect URI to your Vercel URL

## Support

For issues or questions, check the NextAuth.js documentation: https://next-auth.js.org/
