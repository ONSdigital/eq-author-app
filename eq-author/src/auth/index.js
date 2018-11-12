import firebase from "firebase/app";
import "firebase/auth";
import firebaseui from "firebaseui";
import config from "config";

const PROJECT_ID = config.REACT_APP_FIREBASE_PROJECT_ID;
const API_KEY = config.REACT_APP_FIREBASE_API_KEY;
const MESSAGING_SENDER_ID = config.REACT_APP_FIREBASE_MESSAGING_SENDER_ID;

firebase.initializeApp({
  apiKey: API_KEY,
  authDomain: `${PROJECT_ID}.firebaseapp.com`,
  databaseURL: `https://${PROJECT_ID}.firebaseio.com`,
  projectId: PROJECT_ID,
  storageBucket: `${PROJECT_ID}.appspot.com`,
  messagingSenderId: MESSAGING_SENDER_ID
});

const auth = firebase.auth();

export default auth;
export const providers = [
  {
    provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
    requireDisplayName: true
  }
];

export const credentialHelper = firebaseui.auth.CredentialHelper.NONE;
