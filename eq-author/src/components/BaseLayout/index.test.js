import React from "react";

import { render } from "tests/utils/rtl";
import { READ, WRITE } from "constants/questionnaire-permissions";

import { MeContext } from "App/MeContext";

import BaseLayout from "components/BaseLayout";

import { AWAITING_APPROVAL } from "constants/publishStatus";

describe("base layout", () => {
  let props, user;

  beforeEach(() => {
    const div = document.createElement("div");
    div.setAttribute("id", "toast");
    document.body.appendChild(div);

    props = {
      questionnaire: {
        id: "1",
        title: "Questionnaire",
        permission: READ,
        createdBy: {
          id: "123",
          name: "Foo",
          email: "f@oo.com",
          picture: "",
        },
        locked: false,
        editors: [],
      },
    };
    user = {
      id: "123",
      displayName: "Rick Sanchez",
      email: "wubbalubba@dubdub.com",
      picture: "http://img.com/avatar.jpg",
      admin: false,
    };
  });

  const renderWithContext = (component, ...rest) =>
    render(
      <MeContext.Provider value={{ me: user }}>{component}</MeContext.Provider>,
      ...rest
    );

  it("should render the children", function () {
    const { getByText } = renderWithContext(
      <BaseLayout {...props}>Children</BaseLayout>
    );
    expect(getByText("Children")).toBeTruthy();
  });

  describe("Warning message", () => {
    it("should show an error when the browser is not connected", () => {
      const { getByText } = renderWithContext(
        <BaseLayout {...props}>Children</BaseLayout>,
        {
          storeState: { saving: { offline: true } },
        }
      );
      expect(getByText(/You're currently offline/)).toBeTruthy();
    });

    it("should show a banner when you are read only", () => {
      props.questionnaire.permission = READ;
      const { getByText } = renderWithContext(
        <BaseLayout {...props}>Children</BaseLayout>
      );
      expect(getByText(/changes you make will not be saved/)).toBeTruthy();
    });

    it("should not show a banner when you can write", () => {
      props.questionnaire.permission = WRITE;
      const { queryByText } = renderWithContext(
        <BaseLayout {...props}>Children</BaseLayout>
      );
      expect(queryByText(/changes you make will not be saved/)).toBeFalsy();
    });

    it("should show an error when there is an api error", () => {
      const { getByText } = renderWithContext(
        <BaseLayout {...props}>Children</BaseLayout>,
        {
          storeState: { saving: { apiDownError: true } },
        }
      );
      expect(getByText(/unable to save your progress/)).toBeTruthy();
    });
    it("should show banner when questionnaire is awaiting approval", () => {
      props.questionnaire.publishStatus = AWAITING_APPROVAL;
      props.questionnaire.permission = WRITE;
      const { getByText } = renderWithContext(
        <BaseLayout {...props}>Children</BaseLayout>
      );
      expect(
        getByText(/questionnaire is currently being reviewed/)
      ).toBeTruthy();
    });
    it("should show a warning banner when questionnaire is locked", () => {
      props.questionnaire.locked = true;
      props.questionnaire.permission = WRITE;
      const { getByText } = renderWithContext(
        <BaseLayout {...props}>Children</BaseLayout>
      );
      expect(getByText(/questionnaire is currently locked/)).toBeTruthy();
    });
  });
});
