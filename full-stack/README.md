# Full Stack

A minimal full stack project built with the **MERN stack**. It features a basic **user signup** on both the frontend and backend. User data is stored in **MongoDB** via a simple **Express** server.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Frontend Installation with Vite From Scratch](#frontend-installation-with-vite-from-scratch)
- [Environment Variables](#environment-variables)
- [Available Endpoints](#available-endpoints)
  - [POST `/api/auth/signup`](#post-apiauthsignup)

## Prerequisites

Ensure the following are installed on your machine before proceeding:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [MongoDB](https://www.mongodb.com/) (Use the **MongoDB Community Edition** locally or **MongoDB Atlas** for cloud hosting)

## Project Structure

```bash
full-stack/
├── client
│   ├── src
│   │   ├── lib/constants.js        # Stores route constants
│   │   ├── pages/auth/index.jsx    # Contains the signup page logic
│   │   ├── App.jsx                 # Main React component (app-level logic)
│   │   ├── index.css               # Global CSS (Tailwind or custom styles)
│   │   └── main.jsx                # Entry point for the React application
│   ├── .env                        # Frontend environment variables
│   ├── index.html                  # Main HTML template for Vite
│   ├── jsconfig.json               # Path alias configuration for Javascript
│   └── vite.config.js              # Vite configuration file
└── server
    ├── .env                # Backend environment variables
    ├── index.js            # Main server file (Express app)
    ├── package-lock.json   # Locked dependency versions
    └── package.json        # Project metadata, scripts, and dependencies
```

## Installation

1. **Clone** the repository or download the source code.
2. **Navigate** to the project directory in your terminal.
3. **Install** dependencies for both the client and server:

   ```bash
   cd client
   npm install
   ```

   ```bash
   cd server
   npm install
   ```

## Usage

1. **Start the server**:

   ```bash
   cd server
   npm run dev
   ```

   The server will run at http://localhost:8747.

2. **Start the client**:

   ```bash
   cd client
   npm run dev
   ```

   The client will run at http://localhost:5173.

## Features

- **User Signup**: A simple signup form that sends user data to the Express server.
- **MongoDB Integration**: Stores user credentials and details in a MongoDB database.
- **React Frontend**: Built with **Vite** for fast and optimized development.
- **Server & Client Separation**: The server and client run on different ports, enabling easy deployment and independent scaling.

## Frontend Installation with Vite From Scratch

Below is a quick summary of how the React frontend was set up using Vite. For further details, refer to the official [Vite guide](https://vite.dev/guide/#scaffolding-your-first-vite-project) and the [shadcn UI guide](https://ui.shadcn.com/docs/installation/vite).

1. **Initialize Vite project**:

   ```bash
   npm create vite@latest
   ```

   Follow the prompts and select **React + JavaScript**

   ```bash
   Ok to proceed? (y) y
   ✔ Project name: … client
   ✔ Select a framework: › React
   ✔ Select a variant: › JavaScript
   ```

2. **Install dependencies**:

   ```bash
   cd client
   npm install
   ```

3. **Install [shadcn](https://ui.shadcn.com/docs/installation/vite)** (optional UI library):

   - **Add Tailwind (version 3)**

     **Tailwind CSS** is a utility-first CSS framework that offers low-level utility classes, enabling you to quickly build custom designs without writing extensive custom CSS.

     Install `tailwindcss` and its peer dependencies, then generate `tailwind.config.js` and `postcss.config.js` files

     ```bash
     npm install -D tailwindcss@3 postcss autoprefixer
     npx tailwindcss init -p
     ```

     Add the following import header to `src/index.css`:

     ```bash
     @tailwind base;
     @tailwind components;
     @tailwind utilities;
     ```

     Configure the tailwind template paths in `tailwind.config.js`:

     ```bash
     /** @type {import('tailwindcss').Config} */
     module.exports = {
      content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
      theme: {
        extend: {},
      },
      plugins: [],
     }
     ```

   - **Configure Path Aliases**

     Create a `jsconfig.json` in `client` folder to use path aliases:

     ```bash
     {
     "compilerOptions": {
       "baseUrl": ".",
       "paths": {
         "@/*": ["./src/*"]
       }
     }
     ```

     Update `vite.config.js` to resolve `@` aliases:

     ```bash
     import path from "path"
     import react from "@vitejs/plugin-react"
     import { defineConfig } from "vite"

     export default defineConfig({
       plugins: [react()],
       resolve: {
         alias: {
           // eslint-disable-next-line no-undef
           "@": path.resolve(__dirname, "./src"),
         },
       },
     })

     ```

   - **Configure Server Settings** (Optional)

     You can configure the development server in `vite.config.js` to automatically open the browser at startup:

     ```bash
     export default defineConfig({
      // ...rest of your config
      server: {
        host: "localhost",
        open: true,
      },
     })
     ```

   - **Initialize shadcn UI**:

     ```bash
     npx shadcn@latest init
     ```

     Follow the prompts

     ```bash
     ✔ Which style would you like to use? › Default
     ✔ Which color would you like to use as the base color? › Slate
     ✔ Would you like to use CSS variables for theming? … no / yes
     ```

     Then add components as needed:

     ```bash
     npx shadcn@latest add input button
     ```

4. **Install additional libraries**:

   ```bash
   npm install axios react-router-dom
   ```

   - `axios`: Makes API requests
   - `react-router-dom`: Enables page navigation

## Environment Variables

### Server (`server/.env`)

| Variable       | Description                                                 |
| -------------- | ----------------------------------------------------------- |
| `ORIGIN`       | Allowed frontend domain (e.g., http://localhost:5173)       |
| `DATABASE_URL` | MongoDB connection string (replace with actual credentials) |
| `PORT`         | The port number on which the server runs (8747)             |

### Client (`client/.env`)

| Variable          | Description                                         |
| ----------------- | --------------------------------------------------- |
| `VITE_SERVER_URL` | The server’s base URL (e.g., http://localhost:8747) |

## Available Endpoints

### POST `/api/auth/signup`

This setup shows how the React frontend sends signup data (`email` and `password`) via Axios to the Express server, which can then process and store it in a database.

**Frontend**:

1. **API Route Constants** (`client/src/lib/constants.js`):

   Define and export string constants for endpoints to keep the code organized:

   ```bash
   export const AUTH_ROUTES = "api/auth";
   export const SIGNUP_ROUTE = `${AUTH_ROUTES}/signup`;
   ```

2. **Signup Logic** (`client/src/pages/auth/index.jsx`):

   - Import **Axios** and create a client instance with `baseURL` set to server URL (e.g., `http://localhost:8747`).
   - Implement `handleSignup` to send a `POST` request with user-entered credentials (`email`, `password`) to the signup endpoint.
   - On a successful response (status `201`), inform the user of success; otherwise, show an error message.

   ```bash
   const apiClient = axios.create({
     baseURL: HOST,
   });

   const handleSignup = async () => {
       try {
         const response = await apiClient.post(
           SIGNUP_ROUTE,
           {
             email,
             password,
           },
           { withCredentials: true }
         );
         if (response.status === 201) {
           setMessage("Signup successful!");
         }
       } catch (error) {
         setMessage("Signup failed. Please try again.");
         console.log(error);
       }
     };
   ```

3. **React Router Configuration** (`client/src/App.jsx`)

   - Use **React Router** (`react-router-dom`) to navigate between different pages in your application.
   - Below, `/auth` points to the signup page (`Auth` component). Any unknown route (`*`) redirects to `/auth`.
   - This setup ensures that when users visit `/auth`, they see the signup form and can submit their credentials.

   ```bash
    import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
    import Auth from "./pages/auth";

    const App = () => {
      return (
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<Navigate to={"/auth"} />} />
          </Routes>
        </BrowserRouter>
      );
    };

    export default App;
   ```

   **Explanation**:

   - `BrowserRouter` wraps the entire application and keeps the UI in sync with the URL.
   - `Routes` and `Route` define the available paths in the application.
   - `Navigate` helps redirect users if they try to access an undefined route.

**Backend**:

Define the endpoint in `server/index.js`. The Express server listens for `POST` requests at `/api/auth/signup`. In this endpoint, the server:

- Parses the request body (`email`, `password`).
- Validates the user data (e.g., checks if the `email` is already registered).
- Saves the user information in MongoDB.
- Responds with either success or an appropriate error message.

```bash
const app = express();

const signup = async (req, res) => {...};

const authRoutes = Router();
app.use("/api/auth", authRoutes);

authRoutes.post("/signup", signup);
```
