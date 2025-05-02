# KountDown

KountDown is a simple, real-time countdown timer application designed for presenters and speakers. It provides a synchronized view between the dashboard (controller) and the preview (audience/speaker view). The app supports dark mode, multi-language options, and responsive design.

## Features

- **Real-Time Synchronization**: Updates the timer across all connected clients instantly.
- **Dark Mode**: Supports light and dark themes.
- **Multi-Language Support**: Easily switch between languages (e.g., English, French, Norwegian).
- **Responsive Design**: Works seamlessly on desktops, tablets, and mobile devices.
- **Standalone Executables**: Run the app locally with pre-built executables for Windows and Linux.

## Installation

### Using Node.js

1. Clone the repository:
   ```bash
   git clone https://github.com/DRflamios/KountDown.git
   cd KountDown
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Build the frontend:
   ```bash
    cd frontend
   pnpm install
   pnpm build
   cd ..
   ```

4. Start the server
   ```bash
   pnpm start
   ```
   or
   ```bash
   node index.js
   ```
The web app will can be accessed with [localhost:2846](http://localhost:2846)
Data from the queue will be stored on a JSON file named **queue.json**
