# DSA Algorithm Animator

A React-based web application for visualizing sorting and searching algorithms with step-by-step animations and OpenAI-powered explanations.

## Features

- **Sorting Algorithms**: Bubble Sort, Insertion Sort, Selection Sort, Quick Sort, Merge Sort
- **Searching Algorithms**: Linear Search, Binary Search
- **Interactive Animations**: Step-by-step visualization with adjustable speed
- **OpenAI Integration**: Get AI-powered explanations of algorithm behavior

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```
OPENAI_API_KEY=your_openai_api_key_here
PORT=5173
```

3. Run the development servers:

In one terminal, start the Express backend:
```bash
npm run server
```

In another terminal, start the Vite dev server:
```bash
npm run dev
```

This will start:
- Vite dev server on `http://localhost:3000` (React frontend)
- Express server on `http://localhost:5173` (API backend)

The Vite dev server is configured to proxy `/api` requests to the Express server.

4. For production build:
```bash
npm run build
npm run start
```

## Usage

1. Select an algorithm from the dropdown
2. Enter your array values (comma-separated, e.g., `5,3,8,1,2`)
3. For search algorithms, enter a target value
4. Adjust the animation speed
5. Click "Start" to begin the animation
6. Use "Pause" to pause and "Reset" to clear
7. Click "Explain with OpenAI" to get an AI explanation

## Project Structure

```
├── src/
│   ├── App.jsx          # Main React component
│   ├── main.jsx         # React entry point
│   ├── index.css        # Global styles
│   └── algorithms.js    # Algorithm implementations
├── server.js            # Express backend server
├── vite.config.js       # Vite configuration
└── package.json         # Dependencies
```

