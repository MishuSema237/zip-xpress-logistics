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

## Phase 3: Custom Domain & SSL Setup (Zip-Xpresslogistics.com)

**Since you bought the domain directly on Vercel, the process is largely automatic:**

1.  **Assign Domain**:
    *   In your Vercel project, go to **Settings > Domains**.
    *   If your domain isn't listed, click **Add** and select your purchased domain.
2.  **DNS & SSL Verification**:
    *   Vercel automatically configures the DNS records for domains bought through their platform.
    *   An SSL certificate is generated automatically as soon as the domain is assigned to the project.
3.  **Troubleshooting "Not Secure"**:
    *   **Time**: Even for Vercel-bought domains, it can take **15 to 30 minutes** for the certificate to be issued and a few hours for global DNS propagation.
    *   **Deployment**: Ensure your latest code is successfully **Deployed** in the "Deployments" tab. The domain must be "Active" and "Assigned" to your main branch.

---

## Final Verification
*   Visit [https://zip-xpresslogistics.com](https://zip-xpresslogistics.com).
*   Check for the **Padlock icon** in the browser address bar.
*   Go to a tracking page and verify names are being geocoded using the Photon API.
*   Submit a contact form to ensure the Render server is receiving requests and sending emails.

> [!IMPORTANT]
> **SSL Propagation**: If you just added the domain, it is normal to see "Not Secure" for a short period while the global DNS updates and Vercel verifies your ownership to issue the certificate.

> [!NOTE]
> If you encounter CORS issues, ensured the `cors()` middleware in `server/index.js` is active. For production, it's safer to configure it as `cors({ origin: 'https://zip-xpresslogistics.com' })`.
