import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAEwn-E96ffXodnzQbDcrFjanFkqMOyxas",
  authDomain: "todo-vuejs-e539d.firebaseapp.com",
  projectId: "todo-vuejs-e539d",
  storageBucket: "todo-vuejs-e539d.appspot.com",
  messagingSenderId: "104142569058",
  appId: "1:104142569058:web:fb61325001eb0d6c959b3b",
  measurementId: "G-YV7MC6JDPB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
