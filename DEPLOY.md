# Kodnest - Job Tracker

## 🚀 How to Deploy on Vercel

To ensure your application works correctly (no 404 errors, working navigation), follow these exact steps:

1.  **Push to GitHub**
    *   Push your latest code to your GitHub repository.

2.  **Import to Vercel**
    *   Go to [Vercel Dashboard](https://vercel.com/dashboard).
    *   Click **Add New...** > **Project**.
    *   Select your `Kodnest` repository (or whatever you named it).

3.  **⚠️ CRITICAL: Project Settings**
    *   **Framework Preset:** Vercel should auto-detect "Other" or "N/A" (this is fine).
    *   **Root Directory:**
        *   Click `Edit` next to **Root Directory**.
        *   Select the **`job-tracker`** folder.
        *   *If you don't do this, your app will be served at `your-site.com/job-tracker/` and links might be broken.*

4.  **Deploy**
    *   Click **Deploy**.

## Troubleshooting
*   **404 on Refresh:** If you see a 404 error when refreshing a page like `/settings`, ensure the `vercel.json` file is present in the `job-tracker` folder (it should be there already).
