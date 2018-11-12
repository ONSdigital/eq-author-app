import styled from "styled-components";
import { colors } from "constants/theme";
import auth, { providers, credentialHelper } from "auth";
import { FirebaseAuth } from "react-firebaseui";
import { darken } from "polished";

const darkBlue = darken(0.1, colors.blue);

const SignInForm = styled(FirebaseAuth)`
  .firebaseui-card-actions,
  .firebaseui-card-header,
  .firebaseui-card-content {
    padding-left: 0;
    padding-right: 0;
  }

  .firebaseui-card-actions {
    padding-bottom: 0;
  }

  .firebaseui-form-actions .firebaseui-id-submit {
    background-color: ${colors.blue};

    &:focus,
    &:hover {
      background-color: ${darkBlue};
    }
  }

  .firebaseui-textfield.mdl-textfield .firebaseui-label::after {
    background-color: ${colors.blue};
  }

  .firebaseui-container {
    box-shadow: none;
  }
`;

SignInForm.defaultProps = {
  firebaseAuth: auth,
  uiConfig: {
    signInFlow: "popup",
    signInOptions: providers,
    credentialHelper,
    callbacks: {
      signInSuccess: () => false // Avoid redirects after sign-in.
    }
  }
};

export default SignInForm;
