
# BudgetBuddy

BudgetBuddy is a full-stack budgeting application built with Next.js (App Router), TypeScript, Prisma, and PostgreSQL. It allows users to:

- Authenticate via NextAuth.js (Credentials provider)

- Create, read, update, and delete transactions (income/expense) with optional budget categories

- Manage budgets with name, limit, and spent tracking

- View dashboards: totals summary, monthly trends, and budget breakdown charts

- Filter and export transactions to CSV

- Toggle light/dark mode for a personalized experience


## Run Locally

Prerequisites:

- Node.js v18+ and npm

- PostgreSQL database

- (Optional) Kinde or your preferred auth provider credentials

Clone the project

```bash
  git clone https://github.com/Gaurav0203Shetty/BudgetBuddy.git
```

Install dependencies

```bash
  npm install
```

Environment Variables

- Copy .env.example to .env and fill in your values:

```bash
  DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
  NEXTAUTH_SECRET=your_nextauth_secret
  # (If using Kinde)
  KINDE_CLIENT_ID=...
  KINDE_CLIENT_SECRET=...
  KINDE_ISSUER_URL=...    
```

Database Setup

- Use Prisma to migrate and seed your database:

```bash
  npx prisma migrate dev --name init
  npx prisma db seed
```

Run the development server


```bash
  npm run dev
```

- The app should now be available at http://localhost:3000.


## Running Tests

We use Jest with React Testing Library and next-test-api-route-handler for API route tests.

```bash
  npm test
```

Make sure your database is seeded or mock your Prisma calls when running integration tests.
## API Documentation

We provide an OpenAPI specification at public/openapi.json. To explore interactively:

    1. Start the dev server

    2. Visit http://localhost:3000/docs


## Theming

- Light/Dark mode toggled via the button in the Navbar

- Implemented with next-themes and Tailwind's dark: classes


## Deployment

This app can be deployed to Vercel or any Node.js-compatible host.

    1. Push your code to GitHub

    2. Connect the repo in Vercel dashboard

    3. Set environment variables in Vercel

    4. Vercel will handle build and deploy automatically


## Contributing

Contributions are always welcome!

Recommended features:

- Add more analytics (e.g., spending categories over time)

- Implement recurring transactions

- Enhance accessibility and performance

- Add mobile-specific optimizations


#### Enjoy using BudgetBuddy! Feel free to open issues or submit pull requests.

