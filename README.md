Weather App

A React Native weather app built using the Ignite boilerplate. This app allows users to search for cities, view weather details, save favorite cities, and toggle temperature units.

🚀 Getting Started
Follow these steps to set up and run the app:

1️⃣ Update Local IP in Homescreen
Open Homescreen.tsx and update the JSON server URL with your local IP:

const response = await fetch(`http://YOUR_LOCAL_IP:3000/weatherData?city=${searchCity}`)
Replace YOUR_LOCAL_IP with your actual local network IP (e.g., 192.168.X.X).

2️⃣ Start JSON Server
Run the following command in the project root to start the mock weather API:

npx json-server --watch db.json --port 3000
This serves the weather data from db.json.

3️⃣ Install Dependencies
Make sure you have all required dependencies installed:

npm install
4️⃣ Run the App
To start the app, use:

npx expo start
If you're running on an Android emulator, use:

npm run android
For an iOS simulator (Mac users only):

npm run ios
📌 Features
✅ City Search & Weather Display
✅ Persistent Recent Searches (AsyncStorage)
✅ Temperature Unit Toggle (°C/°F)
✅ Favorite Cities
✅ UI Enhancements (Dynamic Weather UI)
✅ Offline Mode & Data Caching

🛠️ Built With
React Native (Ignite Boilerplate)
AsyncStorage (for storing searches & favorites)
JSON Server (mock weather API)
