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
// install and add firebase analytics SDK once Author node version has been updated from v10
// firebase.analytics();

const auth = firebase.auth();

// export const registerWithEmailAndPassword = async (name, email, password) => {
//   try {
//     const res = await auth.createUserWithEmailAndPassword(email, password);
//     const user = res.user;
//     await addDoc(collection(db, "users"), {
//       uid: user.uid,
//       name,
//       authProvider: "local",
//       email,
//     });
//   } catch (err) {
//     console.error(err);
//     alert(err.message);
//   }
// };

// export const sendPasswordReset = async (email) => {
//   try {
//     await auth.sendPasswordResetEmail(email);
//     alert("Password reset link sent!");
//   } catch (err) {
//     console.error(err);
//     alert(err.message);
//   }
// };

export default auth;

export const providers = [
  {
    provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
    requireDisplayName: true,
  },
];

export const credentialHelper = firebaseui.auth.CredentialHelper.NONE;
