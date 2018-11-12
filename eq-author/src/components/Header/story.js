import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { UnconnectedHeader as Header } from "components/Header";
import { MemoryRouter } from "react-router";

const user = {
  photoURL: "",
  displayName: "Angelina McLongmoniker",
  email: "test@test.com"
};

storiesOf("Header", module)
  .addDecorator(story => (
    <MemoryRouter initialEntries={["/"]}>{story()}</MemoryRouter>
  ))
  .add("With Utility Buttons", () => (
    <Header
      user={user}
      questionnaire={{
        title: "Morbi leo risus porta ac consectetur ac vestibulum at eros"
      }}
      signOutUser={action("sign out user")}
      raiseToast={action("copied")}
    />
  ))
  .add("Without Utility Buttons", () => (
    <Header
      signOutUser={action("sign out user")}
      raiseToast={action("copied")}
    />
  ));
