# FinGen - Next Gen Finance App

A modern, gamified finance dashboard built with React, TypeScript, and Vite. Designed for Gen Z to track expenses, learn finance, and manage budgets with a premium UI.

## Features

- **Dashboard**: Real-time overview of income, expenses, and savings.
- **Gamification**: Earn XP, level up, and maintain streaks for good financial habits.
- **AI Insights**: Smart, fun nudges based on your spending patterns.
- **PocketPlan**: Interactive budget planning tool.
- **Bank Integration**: Simulate bank linking and UPI payments.
- **Responsive Design**: Works seamlessly on desktop and mobile.

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Styling**: CSS Modules, Modern CSS (Glassmorphism, Gradients)
- **Charts**: Recharts
- **Routing**: React Router DOM

## Getting Started

1.  **Clone the repository**:
    ```bash
    git clone <your-repo-url>
    cd finance-app
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run development server**:
    ```bash
    npm run dev
    ```

4.  **Build for production**:
    ```bash
    npm run build
    ```

## Deployment

### Vercel

1.  Push your code to GitHub.
2.  Log in to [Vercel](https://vercel.com).
3.  Import your GitHub repository.
4.  Vercel will automatically detect Vite. Click **Deploy**.

### Netlify

1.  Push your code to GitHub.
2.  Log in to [Netlify](https://netlify.com).
3.  "New site from Git".
4.  Build command: `npm run build`, Publish directory: `dist`.

## Project Structure

- `src/components`: Reusable UI components.
- `src/pages`: Application pages (Dashboard, PocketPlan, etc.).
- `src/state`: Global state management (Context API).
- `src/styles`: Global styles and themes.
- `src/utils`: Helper functions.

## License

MIT
