import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDgJvqspCUSEyPj6xeSavqL0DxpwKBUS6k",
  authDomain: "mind-merge-2d0a0.firebaseapp.com",
  projectId: "mind-merge-2d0a0",
  storageBucket: "mind-merge-2d0a0.appspot.com",
  messagingSenderId: "941635367939",
  appId: "1:941635367939:web:970acefe05073f319e8a36",
  measurementId: "G-S01TV4C1J3"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);