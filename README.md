# React Application Architecture for Production - 2nd Edition

React Application Architecture for Production (2nd Edition), published by Packt.

This is the code repository for React Application Architecture for Production (2nd Edition), published by Packt.

## Requirements

- Node.js version 24 or above (npm 11+ ships with it)
- A text editor or IDE (we recommend [VS Code](https://code.visualstudio.com))

## Repository Structure

```
chapter-02/   Application code for each chapter
chapter-03/
...
chapter-12/
api/          Backend API used by chapters 5-12
```

Each chapter directory is a standalone project with its own `package.json` and dependencies. See the README inside each chapter for setup instructions.

## Quick Start

1. Navigate to the chapter you are working on:

```sh
cd chapter-<chapter-number>
```

2. Install dependencies:

```sh
npm install
```

3. Configure environment variables:

```sh
cp .env.example .env
```

4. Start the development server:

```sh
npm run dev
```

The app will be available at http://localhost:5173.

5. Follow the instructions in the [API README](api/README.md) to start the API server.

