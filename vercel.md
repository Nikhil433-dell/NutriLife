# Deploy NutriLife to Vercel

This project is set up for a single Vercel deployment: the React app is served as static files and the Express API runs as serverless functions under `/api/*`.

## Steps

1. **Push your code** to GitHub (you already have a branch).

2. **Import the project in Vercel**
   - Go to [vercel.com](https://vercel.com) and sign in (e.g. with GitHub).
   - Click **Add New** → **Project** and import the `NutriLife` repo.
   - Leave **Root Directory** as `.` (repo root).
   - Vercel will use the `vercel.json` in the repo (build command, output directory, rewrites).

3. **Set environment variables** in the Vercel project (**Settings → Environment Variables**). Add:

   | Name | Value | Notes |
   |------|--------|--------|
   | `REACT_APP_API_URL` | `/api` | So the frontend calls your deployed API on the same domain. |
   | `FIREBASE_SERVICE_ACCOUNT_JSON` | `{"type":"service_account",...}` | Paste your **entire** Firebase service account JSON (single line). |

   - For local dev you use `GOOGLE_APPLICATION_CREDENTIALS` with a file; on Vercel you use `FIREBASE_SERVICE_ACCOUNT_JSON` with the JSON string.
   - Get the JSON from Firebase Console → Project settings → Service accounts → Generate new private key, then minify it to one line.

4. **Deploy**
   - Click **Deploy**. Vercel will run `installCommand` (client + server deps), then `buildCommand` (React build), and will serve the API via `api/[[...path]].js`.

5. **Optional**
   - After the first deploy, run the seed script **once** against your production Firestore (from your machine with `GOOGLE_APPLICATION_CREDENTIALS` set and Firestore pointing at the same project) so production has shelters, test users, etc.:
     ```bash
     cd server && npm run seed
     ```
   - Or create data in Firebase Console.

## What gets deployed

- **Static:** Everything in `client/build` (React app) is served at `/`, `/map`, `/profile`, etc. Non-file paths are rewritten to `index.html` for client-side routing.
- **API:** All requests to `/api/*` (e.g. `/api/auth/login`, `/api/shelters`) are handled by the Express app running as a Vercel serverless function.

## Troubleshooting

- **API 500 errors:** Check Vercel **Functions** logs. Ensure `FIREBASE_SERVICE_ACCOUNT_JSON` is set and valid.
- **CORS:** The Express app uses `cors({ origin: true })`; same-origin requests from `/api` need no CORS change.
- **Blank app / wrong API URL:** Set `REACT_APP_API_URL=/api` and redeploy so the build picks it up.
