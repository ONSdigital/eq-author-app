import firebase from "firebase/app";
import "firebase/auth";
import firebaseui from "firebaseui";
import config from "config";

const PROJECT_ID = config.REACT_APP_FIREBASE_PROJECT_ID;
const API_KEY = config.REACT_APP_FIREBASE_API_KEY;

firebase.initializeApp({
  apiKey: API_KEY,
  authDomain: `${PROJECT_ID}.firebaseapp.com`,
  databaseURL: `https://${PROJECT_ID}.firebaseio.com`,
  storageBucket: `${PROJECT_ID}.appspot.com`,
});

const auth = firebase.auth();

if (window.Cypress && config.REACT_APP_FUNCTIONAL_TEST === "true") {
  window.__auth__ = auth;
}

export default auth;
export const providers = [
  {
    provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
    requireDisplayName: true,
  },
];

export const credentialHelper = firebaseui.auth.CredentialHelper.NONE;
