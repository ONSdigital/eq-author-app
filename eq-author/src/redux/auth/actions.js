import config from "config";

export const SIGN_IN_USER = "SIGN_IN_USER";
export const SIGN_OUT_USER = "SIGN_OUT_USER";
export const SIGN_IN_ERROR = "SIGN_IN_ERROR";

export const signInUser = ({
  displayName,
  email,
  photoURL,
  stsTokenManager: { accessToken },
  uid,
}) => {
  if (config.REACT_APP_FULLSTORY_ORG) {
    window.FS.identify(email, { displayName });
  }

  localStorage.setItem("accessToken", accessToken);

  return {
    type: SIGN_IN_USER,
    payload: {
      id: uid,
      displayName,
      email,
      photoURL,
    },
  };
};

export const signedOutUser = () => {
  localStorage.removeItem("accessToken");
  return {
    type: SIGN_OUT_USER,
  };
};

export const signOutUser = () => (dispatch, getState, { auth }) => {
  if (config.REACT_APP_FULLSTORY_ORG) {
    window.FS.identify(false);
  }

  return auth.signOut().then(() => dispatch(signedOutUser()));
};

export const verifyAuthStatus = () => (dispatch, getState, { auth }) => {
  return auth.onAuthStateChanged(authResult => {
    if (!authResult) {
      dispatch(signOutUser());
      return;
    }
    window
      .fetch("/signIn", {
        method: "POST",
        headers: { authorization: `Bearer ${authResult.ra}` },
      })
      .then(() =>
        dispatch(authResult ? signInUser(authResult.toJSON()) : signOutUser())
      )
      .catch(() => dispatch(signOutUser()));
  });
};
