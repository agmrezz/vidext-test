# Vidext Test

## Setup

This project uses pnpm as package manager. First install dependencies:

```bash
pnpm install
```

Then setup the local database:

```bash
pnpm run db:push
# or
pnpm run db:migrate
```

Then run the development server:

```bash
pnpm dev
```

## How to use the app

The app consists of two routes:

- `/` - The home page
- `/editor/:id` - The editor page

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
