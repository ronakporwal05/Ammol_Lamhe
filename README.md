# 📸 Anmol Lamhe — AI Event Photo Delivery Platform

> **"Every Moment, Forever Precious"**

An AI-powered event photo delivery platform. Photographers upload event photos, share a link with clients, and clients upload a selfie to instantly find and download their photos using browser-based face recognition.

## 📁 Project Structure

```
anmol-lamhe/
├── frontend/                    ← React/Vite UI
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env / .env.example
│   ├── public/
│   │   ├── favicon.svg
│   │   ├── icons.svg
│   │   └── models/              ← AI model weights (served by Vite)
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── index.css
│       ├── components/          ← All React UI components
│       ├── routes/              ← PrivateRoute.jsx
│       └── assets/              ← Static images
│
├── backend/                     ← Firebase service layer
│   ├── firebase/
│   │   ├── config.js            ← Firebase initialization
│   │   ├── auth.js              ← Authentication helpers
│   │   ├── firestore.js         ← Firestore CRUD operations
│   │   └── storage.js           ← Image compression & storage
│   └── index.js                 ← Barrel export
│
└── ai/                          ← Face recognition engine
    ├── faceRecognition/
    │   ├── loadModels.js         ← Model loader
    │   ├── detectFace.js         ← Face detection (single + multi)
    │   └── matchFaces.js         ← Face matching algorithm
    ├── models/                   ← AI model weights (source of truth)
    ├── download-models.cjs       ← Model downloader script
    └── index.js                  ← Barrel export
```

## ✨ Features

### Admin Side
- 🔐 Secure admin login/signup (Firebase Auth)
- 📊 Dashboard with event, photo, and client stats
- 📅 Create events (name, date, description)
- 📷 Upload multiple photos per event
- 🔗 Auto-generated shareable client links
- 📋 Copy event link to clipboard

### Client Side
- 🌐 No login required — open event link directly
- 🤳 Upload one selfie (file or camera on mobile)
- 🤖 AI face detection runs entirely in the browser
- 🎯 Matched photos shown in responsive grid
- ⬇️ Download individual photos or all at once
- ⏳ Loading spinner during AI processing

### Face Recognition
- Uses **face-api.js** (ssdMobilenetv1, faceLandmark68Net, faceRecognitionNet)
- All processing in the browser — no server-side AI
- Euclidean distance threshold: 0.53 (adjustable)
- Only compares within the specific event

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js (Vite) |
| Styling | Tailwind CSS v4 |
| Face Recognition | face-api.js |
| Auth | Firebase Authentication |
| Database | Firebase Firestore |
| Storage | Firebase Storage |
| Hosting | Vercel |

## 🚀 Setup & Run Locally

### Prerequisites
- Node.js 18+
- npm 9+
- A Firebase project

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/anmol-lamhe.git
cd anmol-lamhe
```

### 2. Install dependencies
```bash
cd frontend
npm install
```

### 3. Configure Firebase
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Enable **Authentication** → **Email/Password** sign-in
4. Create a **Firestore Database**
5. Create **Firebase Storage**
6. Go to Project Settings → General → Your apps → Add Web App
7. Copy the config values

### 4. Set up environment variables
Copy `.env.example` to `.env` and fill in your Firebase config:
```bash
cp .env.example .env
```

Edit `frontend/.env`:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

> ⚠️ Do NOT wrap values in quotes in the .env file.

### 5. Download face-api.js models
```bash
cd ai
node download-models.cjs
```

### 6. Run the dev server
```bash
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### 7. Firebase Security Rules

**Firestore Rules:**
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /events/{eventId} {
      allow read: if true;
      allow write: if request.auth != null;
      match /photos/{photoId} {
        allow read: if true;
        allow write: if request.auth != null;
      }
    }
  }
}
```

**Storage Rules:**
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /events/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 🌐 Deploy to Vercel

1. Push to GitHub
2. Go to [Vercel](https://vercel.com) and import the repo
3. Set **Root Directory** to `frontend`
4. Add all `VITE_FIREBASE_*` environment variables in Vercel settings
5. Deploy!

## 👤 Admin Usage

1. Open the app and click "Photographer Login"
2. Create an account via the signup page
3. From the dashboard, click "Create New Event"
4. Upload photos to the event
5. Click "Copy Link" to get the shareable client link
6. Share the link with your clients

## 📱 Client Usage

1. Open the shared event link (no login needed)
2. Upload a clear selfie
3. Wait for AI to process and find matching photos
4. View and download your matched photos

## 📋 Reference

Document: AD-001 | Client: Anmol Lamhe Photography
