import React from "react";
import { render } from "tests/utils/rtl";
import Header from "components-themed/Header/index.js";
import { ReactComponent as Logo } from "assets/ons-logo.svg";
import Theme from "contexts/themeContext";
import { MeContext } from "App/MeContext";

let props;

beforeEach(() => {
  props = {
    me: {
      id: "1",
      email: "squanchy@mail.com",
      displayName: "I am Groot",
    },
    signOut: jest.fn(),
  };
});

describe("Header in Components-themed", () => {
  const renderHeader = (props) =>
    render(
      <Theme themeName={"ons"}>
        <MeContext.Provider value={{ ...props }}>
          <Header
            variant="Internal"
            headerDescription="Header description"
            logo={<Logo />}
            centerCols={9}
          >
            {"Header title"}
          </Header>
        </MeContext.Provider>
      </Theme>
    );

  describe("Header", () => {
    it("should render a Heading title from children", () => {
      const { getByText } = renderHeader({ ...props });
      expect(getByText("Header title (AWS)")).toBeTruthy();
    });

    it("should render a description for the Heading", () => {
      const { getByText } = renderHeader({ ...props });
      expect(getByText("Header description")).toBeTruthy();
    });

    it("should render a displayName for the User", () => {
      const { getByText } = renderHeader({ ...props });
      expect(getByText("I am Groot")).toBeTruthy();
    });

    it("should render a guestAvatar if me context does not have one", () => {
      const { getByRole, getByAltText } = renderHeader({ ...props });

      expect(getByRole("presentation")).toBeTruthy();

      const image = getByAltText("Avatar");
      expect(image).toHaveAttribute("src", "SvgrURL");
    });
  });
});
