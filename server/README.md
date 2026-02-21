# NutriLife API

Express backend using **Firebase Firestore** for persistence. Serves the NutriLife React client.

## Setup

1. **Firebase project**
   - Create a project in [Firebase Console](https://console.firebase.google.com).
   - Enable **Firestore Database** (Create database).
   - In Project settings → Service accounts, click **Generate new private key** to download a JSON key file.

2. **Install and configure**
   ```bash
   cd server
   npm install
   cp .env.example .env
   ```
   In `.env`:
   - Set `GOOGLE_APPLICATION_CREDENTIALS` to the path of your service account JSON (e.g. `./serviceAccountKey.json`), **or**
   - Set `FIREBASE_SERVICE_ACCOUNT_JSON` to the full JSON string (single line).

3. **Seed the database**
   ```bash
   npm run seed
   ```
   This creates collections: `shelters`, `inventory`, `distributions`, `communityMessages`, and an admin user:
   - **Email:** `admin@nutrilife.app`
   - **Password:** `admin123` (or set `ADMIN_PASSWORD` in `.env`)

4. **Run the server**
   ```bash
   npm start
   ```
   API base URL: `http://localhost:5000/api`

## Client

In the React app (`client/`), set:
```bash
# client/.env
REACT_APP_API_URL=http://localhost:5000/api
```
Then run the client with `npm start` from `client/`.

## API overview

| Area | Endpoints |
|------|-----------|
| **Auth** | `POST /api/auth/register`, `POST /api/auth/login` |
| **Users** | `GET/PATCH /api/users/:id`, `GET/POST/DELETE /api/users/:id/bookmarks` |
| **Shelters** | `GET /api/shelters`, `GET /api/shelters/:id`, `GET /api/shelters/search?q=`, `POST /api/shelters/:id/checkin` |
| **Admin** | `GET/PATCH /api/admin/inventory`, `GET/POST /api/admin/distributions` |
| **Community** | `GET/POST /api/community`, `PATCH /api/community/:id/like` |

## Firestore collections

- **users** – auth (email + hashed password), profile, preferences, bookmarks, check-ins
- **shelters** – shelter records (id, name, address, capacity, etc.)
- **inventory** – inventory items
- **distributions** – distribution records
- **communityMessages** – community feed messages
