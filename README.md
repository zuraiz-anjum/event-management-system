# EventHub: Event Management System

A React app for finding events, registering for them and keeping track of what you have signed up for. Event data comes from the Ticketmaster Discovery API. State is managed with Redux Toolkit and navigation with React Router.

## Setup

1. Get a free API key from https://developer.ticketmaster.com/ (use the Consumer Key).
2. Copy the example env file and add your key:

   ```
   cp .env.example .env
   ```

   Then open `.env` and replace `your_key_here` with your key:

   ```
   VITE_TICKETMASTER_API_KEY=your_key_here
   ```

3. Install and run:

   ```
   npm install
   npm run dev
   ```

4. Open the address Vite prints (usually http://localhost:5173).

Other scripts: `npm run build` creates a production build in `dist`, `npm run preview` serves it, `npm run lint` runs ESLint.

The `.env` file is ignored by git. Never commit your key. Restart the dev server after changing `.env`.

## Tech

- React 19 with Vite
- Redux Toolkit and react-redux
- React Router
- Plain CSS, no UI library
