# Deployment Guide: Zip-Xpress Logistics

This guide walk you through deploying your application to **Render** (Backend) and **Vercel** (Frontend).

## Phase 1: Backend Deployment (Render.com)

1.  **Create a New Web Service**: Log in to [Render](https://render.com/) and click **New > Web Service**.
2.  **Connect GitHub**: Select your `zip-xpress-logistics` repository.
3.  **Configure Service**:
    *   **Name**: `zip-xpress-backend`
    *   **Root Directory**: `server` (Important: This points to your Express app).
    *   **Build Command**: `npm install`
    *   **Start Command**: `node index.js`
4.  **Add Environment Variables**:
    *   Go to the **Environment** tab and add:
        *   `MONGODB_URI`: Your MongoDB connection string (e.g., from MongoDB Atlas).
        *   `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`: Your email credentials.
5.  **Deploy**: Once deployed, copy the **Render URL** (e.g., `https://zip-xpress-backend.onrender.com`).

---

## Phase 2: Frontend Deployment (Vercel)

1.  **Create a New Project**: Log in to [Vercel](https://vercel.com/) and click **Add New > Project**.
2.  **Import GitHub Repo**: Select the same `zip-xpress-logistics` repository.
3.  **Configure Project**:
    *   **Framework Preset**: Create React App (detected automatically).
    *   **Root Directory**: `.` (The root of the repo).
4.  **Add Environment Variables**:
    *   **Important**: Add `REACT_APP_API_URL`.
    *   **Value**: Paste your Render URL followed by `/api` (e.g., `https://zip-xpress-backend.onrender.com/api`).
5.  **Deploy**: Click **Deploy**. Vercel will build your React app and link it to your Render backend.

---

## Final Verification
*   Visit your **Vercel URL**.
*   Go to a tracking page and verify names are being geocoded using the Photon API.
*   Submit a contact form to ensure the Render server is receiving requests and sending emails.

> [!NOTE]
> If you encounter CORS issues, ensured the `cors()` middleware in `server/index.js` is active. For production, it's safer to configure it as `cors({ origin: 'https://your-vercel-domain.com' })`.
