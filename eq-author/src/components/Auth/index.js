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

export default auth;

export const providers = [
  {
    provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
    requireDisplayName: true,
  },
];

export const credentialHelper = firebaseui.auth.CredentialHelper.NONE;

export function handleResetPassword(auth, actionCode, continueUrl, lang) {
  // Verify the password reset code is valid.
  auth
    .verifyPasswordResetCode(actionCode)
    .then((email) => {
      var accountEmail = email;

      // TODO: Show the reset screen with the user's email and ask the user for
      // the new password.
      var newPassword = "...";

      // Save the new password.
      auth
        .confirmPasswordReset(actionCode, newPassword)
        .then((resp) => {
          // Password reset has been confirmed and new password updated.
          // TODO: Display a link back to the app, or sign-in the user directly
          // if the page belongs to the same domain as the app:
          // auth.signInWithEmailAndPassword(accountEmail, newPassword);
          // TODO: If a continue URL is available, display a button which on
          // click redirects the user back to the app via continueUrl with
          // additional state determined from that URL's parameters.
        })
        .catch((error) => {
          // Error occurred during confirmation. The code might have expired or the
          // password is too weak.
        });
    })
    .catch((error) => {
      // Invalid or expired action code. Ask user to try to reset the password
      // again.
    });
}
