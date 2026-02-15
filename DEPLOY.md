# Kodnest - Job Tracker

## 🚀 How to Deploy on Vercel

To ensure your application works correctly (no 404 errors, working navigation), follow these exact steps:

1.  **Push to GitHub**
    *   Push your latest code to your GitHub repository.

2.  **Import to Vercel**
    *   Go to [Vercel Dashboard](https://vercel.com/dashboard).
    *   Select your project.
    *   Go to **Settings** > **General**.

3.  **⚠️ CRITICAL: Project Settings**
    *   **Root Directory:**
        *   **CLEAR THIS FIELD.** It should be empty (or `./`).
        *   *Do NOT set it to `job-tracker` anymore, as the files are now in the main folder.*

4.  **Redeploy**
    *   Go to **Deployments**.
    *   Click the 3 dots on the latest deployment -> **Redeploy**.

## Troubleshooting
*   **404 on Refresh:** If you see a 404 error when refreshing a page like `/settings`, ensure the `vercel.json` file is present in the root folder.
