# StudyFlow - Smart Study Tracker

A modern web application for tracking study habits with AI-powered insights, reminders, and Supabase authentication.

![StudyFlow](https://via.placeholder.com/800x400?text=StudyFlow+Study+Tracker)

## Features

- 📚 **Study Timer** - Track study sessions with a built-in Pomodoro-style timer
- 📊 **Progress Dashboard** - View daily, weekly stats and study streaks
- 🎯 **Study Goals** - Set and track progress towards learning goals
- 🔔 **Smart Reminders** - Browser notifications for study reminders and break alerts
- 🤖 **AI Study Coach** - Get personalized study tips and recommendations
- 🔐 **Supabase Auth** - Secure authentication with email/password
- 💾 **Persistent Data** - All your data is saved locally (and syncs with Supabase when connected)

## Quick Start

### Demo Mode

The app works out of the box in **Demo Mode** - just click "Try Demo Mode" on the login page!

### With Supabase (Full Features)

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com) and create a new project
   - Navigate to Settings → API to get your URL and anon key

2. **Set Environment Variables**
   ```bash
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

3. **Set up Supabase Database (Optional)**
   
   If you want to sync data to Supabase, create these tables:

   ```sql
   -- Study Sessions
   create table study_sessions (
     id uuid default gen_random_uuid() primary key,
     user_id uuid references auth.users(id),
     subject text not null,
     duration integer not null,
     date timestamptz not null,
     notes text,
     completed boolean default true,
     created_at timestamptz default now()
   );

   -- Study Goals
   create table study_goals (
     id uuid default gen_random_uuid() primary key,
     user_id uuid references auth.users(id),
     subject text not null,
     target_hours integer not null,
     current_hours integer default 0,
     deadline date not null
   );

   -- Reminders
   create table reminders (
     id uuid default gen_random_uuid() primary key,
     user_id uuid references auth.users(id),
     title text not null,
     time time not null,
     days text[] not null,
     enabled boolean default true
   );

   -- Enable Row Level Security
   alter table study_sessions enable row level security;
   alter table study_goals enable row level security;
   alter table reminders enable row level security;

   -- Create policies
   create policy "Users can manage their own sessions"
     on study_sessions for all
     using (auth.uid() = user_id);

   create policy "Users can manage their own goals"
     on study_goals for all
     using (auth.uid() = user_id);

   create policy "Users can manage their own reminders"
     on reminders for all
     using (auth.uid() = user_id);
   ```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Deploying to GitHub Pages

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/studyflow.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to your repo Settings → Pages
   - Select "GitHub Actions" as the source
   - Create `.github/workflows/deploy.yml`:

   ```yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches: [main]

   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         
         - name: Setup Node
           uses: actions/setup-node@v3
           with:
             node-version: 18
             
         - name: Install and Build
           run: |
             npm ci
             npm run build
           env:
             VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
             VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
             
         - name: Deploy
           uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

3. **Add Secrets** (if using Supabase)
   - Go to Settings → Secrets and variables → Actions
   - Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

## Tech Stack

- **React 19** - UI Framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **Supabase** - Authentication & Database
- **Lucide React** - Icons
- **date-fns** - Date utilities

## Browser Notifications

The app uses the Web Notifications API for:
- Study break reminders (every 25 minutes with Pomodoro)
- Scheduled study reminders
- Session completion alerts

Enable notifications when prompted for the best experience!

## License

MIT License - feel free to use this project for your own learning!

---

Made with ❤️ for students everywhere
