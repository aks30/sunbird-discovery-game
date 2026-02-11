
# Sunbird Gamified Learning App

A mobile-friendly, gamified web application to learn about Sunbird's building blocks, now featuring the official **Sunbird Design Theme**.

## Features

- **Sunbird Branding**: Uses the official color palette (Beige, Brown, Orange) and Montserrat font.
- **Interactive Learning**: Drag-and-drop game to match Sunbird building blocks with their descriptions.
- **Gamification**: Progress bars, confetti celebrations, and score tracking.
- **Certification**: Automated certificate generation with user selfie, name, and official Sunbird/EkStep logos.
- **Local Data Storage**: Player data (Name, Email, Score) is saved locally to `data/users.json`.

## Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `src/app/page.tsx`: Landing page with Sunbird stats and theming.
- `src/app/game/page.tsx`: The main game logic with updated design.
- `src/app/certificate/page.tsx`: Webcam capture and Certificate generation (now uses local logos).
- `src/app/api/submit/route.ts`: API to save player data to `data/users.json`.
- `public/assets/`: Contains `sunbird-logo.png` and `ekstep-logo.png`.
- `src/app/globals.css`: Contains Sunbird CSS variables.

## Data Storage

User data is stored in a local JSON file at:
`sunbird-game/data/users.json`

This file is automatically created when the first user completes the game.

## Technologies Used

- **Next.js 14+** (App Router)
- **TailwindCSS** (Styling with Sunbird Theme)
- **Framer Motion** (Animations)
- **@dnd-kit** (Drag and Drop)
- **Canvas Confetti** (Visual Feedback)
- **html2canvas & jsPDF** (Certificate Generation)
