# Vidext Drawing App

## Features

- Create, view, and update drawings.
- Persistence to a SQLite database.
- Thumbnail previews for each drawing.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Database ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Database**: [SQLite](https://www.sqlite.org/index.html) (using `@libsql/client`)
- **API**: [tRPC](https://trpc.io/)
- **Drawing Canvas**: [tldraw](https://tldraw.dev/)
- **Validation**: [Zod](https://zod.dev/)
- **Testing**: [Vitest](https://vitest.dev/)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or higher)
- [pnpm](https://pnpm.io/)

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd vidext-test
    ```
2.  Install dependencies:
    ```bash
    pnpm install
    ```
3.  Set up your environment variables by creating a `.env` file in the root of the project. See `.env.example` for required variables. You will need to provide your SQLite database name

4.  Push the database schema:

    ```bash
    pnpm run db:push
    # or
    pnpm run db:migrate
    ```

5.  Run the development server:
    ```bash
    pnpm dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

The project follows a standard Next.js `app` directory structure.

- `src/app`: Contains all the routes and pages for the application.
- `src/components`: Contains all the React components.
- `src/lib`: Contains utility functions and library configurations.
- `src/server`: Contains server-side logic, including the database schema, tRPC router, and context.
- `src/test`: Contains tests for the application.
- `drizzle`: Contains Drizzle ORM migration files.

## Available Scripts

In the project directory, you can run:

- `pnpm dev`: Runs the app in development mode.
- `pnpm build`: Builds the app for production.
- `pnpm start`: Starts a production server.
- `pnpm lint`: Lints the code.
- `pnpm test`: Runs the test suite.

### Database Scripts

- `pnpm db:generate`: Generates Drizzle ORM migration files based on schema changes.
- `pnpm db:migrate`: Applies generated migrations to the database.
- `pnpm db:push`: Pushes the schema directly to the database without creating migration files (useful for development).
- `pnpm db:studio`: Starts Drizzle Studio, a GUI for your database.

## How to Use the App

The app consists of two main routes:

- `/`: The home page, which displays a list of all drawings. From here you can create new drawings.
- `/editor/:id`: The editor page for a specific drawing, where you can draw and see changes saved automatically.

### Home page

The home page shows a list of all drawings with a thumbnail and allows you to create a new drawing.

### Editor page

The editor page is a simple tldraw editor. You can use it to create and edit drawings.

### Extra button

There is an extra button in the editor page that allows you to randomize geo shapes.

## How to run tests

```bash
pnpm test
```
