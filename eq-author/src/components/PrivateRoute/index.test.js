import React from "react";
import { render } from "tests/utils/rtl";

import { MeContext } from "App/MeContext";

import PrivateRoute from "./";

const Component = () => <div>Good morning, Dave</div>;

describe("PrivateRoute", () => {
  let me;
  beforeEach(() => {
    me = {
      id: "123",
      name: "Sokka",
      email: "boomerang@guy.com",
      picture: "some_file.bmp",
    };
  });

  const renderWithContext = (component, providedProps) =>
    render(
      <MeContext.Provider value={{ ...providedProps }}>
        {component}
      </MeContext.Provider>
    );

  it("should render a loading screen if is currently signing in", () => {
    const { queryByTestId } = renderWithContext(
      <PrivateRoute component={Component} />,
      {
        me: null,
        isSigningIn: true,
      }
    );

    expect(queryByTestId("loading")).toBeTruthy();
  });

  it("should render the component if the signIn is complete and there is a user", () => {
    const { queryByText } = renderWithContext(
      <PrivateRoute component={Component} />,
      {
        me,
        isSigningIn: false,
      }
    );

    expect(queryByText("Good morning, Dave")).toBeTruthy();
  });

  it("should render a redirect if theres no user or accessToken", () => {
    const { history } = renderWithContext(
      <PrivateRoute component={Component} />,
      {
        me: null,
        isSigningIn: false,
      }
    );

    expect(history.location.pathname).toEqual("/sign-in");
  });
});
