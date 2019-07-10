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

  it("should render a loading screen if waiting on a query", () => {
    const { queryByTestId } = renderWithContext(
      <PrivateRoute component={Component} />,
      {
        me: null,
        hasAccessToken: true,
        awaitingUserQuery: true,
      }
    );

    expect(queryByTestId("loading")).toBeTruthy();
  });

  it("should render the component if the query's loaded and there is a user", () => {
    const { queryByText } = renderWithContext(
      <PrivateRoute component={Component} />,
      {
        me,
        hasAccessToken: true,
        awaitingUserQuery: false,
      }
    );

    expect(queryByText("Good morning, Dave")).toBeTruthy();
  });

  it("should render a redirect if theres no user or accessToken", () => {
    const { history } = renderWithContext(
      <PrivateRoute component={Component} />,
      {
        me: null,
        hasAccessToken: false,
      }
    );

    expect(history.location.pathname).toEqual("/sign-in");
  });
});
