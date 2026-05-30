# Safari AI

Safari AI now runs as a standalone app from this folder.

## Frontend

```powershell
cd C:\Users\user\Documents\Projects\SafariAI
npm install
npm run dev
```

The Vite dev server will usually open on `http://localhost:5173`.

## Backend

```powershell
cd C:\Users\user\Documents\Projects\SafariAI\backend
npm install
node index.js
```

The backend will run on `http://localhost:5000`.

Health check:

```powershell
http://localhost:5000/health
```

## Important notes

- Do not run `node safari.js`.
- The correct backend entry file is `backend\index.js`.
- The route file `backend\routes\safari.js` is only mounted by the backend server.
- Frontend API base URL is configured in `.env` as `VITE_API_BASE_URL=http://localhost:5000`.
