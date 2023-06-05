import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { initApp } from "./firebase";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

// const firebaseConfig = {
//   apiKey: "AIzaSyBZEwA8kJLruKpX4CkTn_lT9XWEVj2WlcY",
//   authDomain: "frontend-bim.firebaseapp.com",
//   projectId: "frontend-bim",
//   storageBucket: "frontend-bim.appspot.com",
//   messagingSenderId: "142894490680",
//   appId: "1:142894490680:web:8c5c5bfdd639c9c45ff2cd"
// };

// initializeApp(firebaseConfig);

initApp();

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
