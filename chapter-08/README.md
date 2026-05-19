# Chapter 08: Improving Application Performance

## Requirements:
- Node.js version 24 or above, npm version 11 or above ships with Node. We can confirm that by executing node -v and npm -v in the terminal. There are multiple ways to install Node.js and npm. Here is a great article that goes into more detail: https://www.nodejsdesignpatterns.com/blog/5-ways-to-install-node-js.
- A text editor or IDE. We recommend VS Code: https://code.visualstudio.com.

## Setup
0. Make sure you are in the current chapter's directory:
```sh
cd chapter-08
```

1. Install dependencies:

```sh
npm install
```

2. Configure environment variables:

```sh
cp .env.example .env
```

3. Start the development server:

```sh
npm run dev
```

The app will be available at http://localhost:5173.

4. Start the API server:

Follow the instructions in the [API README](../api/README.md) to start the API server.