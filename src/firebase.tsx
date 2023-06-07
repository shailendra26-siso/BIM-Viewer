import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBZEwA8kJLruKpX4CkTn_lT9XWEVj2WlcY",
  authDomain: "frontend-bim.firebaseapp.com",
  projectId: "frontend-bim",
  storageBucket: "frontend-bim.appspot.com",
  messagingSenderId: "142894490680",
  appId: "1:142894490680:web:8c5c5bfdd639c9c45ff2cd"
};

export const initApp = () => initializeApp(firebaseConfig);

const app = initApp();
export const Storage = getStorage(app);
