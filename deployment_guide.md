# 🚀 Deploying Hextech Trivia

To share your Hextech Trivia app with the world, follow these steps to host it online for free using **Vercel** or **Netlify**.

## Option 1: Vercel (Recommended for Vite/React)

Vercel is extremely easy to use and provides excellent performance for React apps.

### 1. Push to GitHub
If you haven't already, push your code to a GitHub repository.
1. Create a new repository on [GitHub](https://github.com/new).
2. Run these commands in your project terminal:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Hextech Trivia"
   git branch -M main
   git remote add origin https://github.com/your-username/your-repo-name.git
   git push -u origin main
   ```

### 3. Set Environment Variables
Your app needs to know how to talk to Supabase.
1. In your Vercel Dashboard, go to **Settings > Environment Variables**.
2. Add these two keys exactly as they appear in your `.env` file:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Click "Save".
4. Go to the **Deployments** tab and click the three dots (...) > **Redeploy** to apply the changes.

---

## Option 2: Netlify

Netlify is another great alternative with a very similar workflow.

1. Sign up/Log in at [netlify.com](https://www.netlify.com/).
2. Click **"Add new site"** > **"Import an existing project"**.
3. Choose **GitHub** and authorize.
4. Select your repository.
5. In **"Site configuration"** > **"Environment variables"**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Click **"Deploy site"**.

---

## Important Checklist Before Deploying

> [!IMPORTANT]
> **Database Security**: Your app is now connected to **Supabase**. Ensure your API keys are added to the environment variables on Vercel/Netlify so the cloud vault functions correctly.

> [!TIP]
> **Build Test**: Run `npm run build` locally first to ensure there are no errors before pushing to the web.
