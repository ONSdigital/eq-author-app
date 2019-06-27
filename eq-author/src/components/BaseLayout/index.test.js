import React from "react";

import { render } from "tests/utils/rtl";
import { READ, WRITE } from "constants/questionnaire-permissions";

import BaseLayout from "components/BaseLayout";

describe("base layout", () => {
  let props;

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
        editors: [],
      },
    };
  });

  it("should render the children", function() {
    const { getByText } = render(<BaseLayout {...props}>Children</BaseLayout>);
    expect(getByText("Children")).toBeTruthy();
  });

  it("should set the title", () => {
    render(
      <BaseLayout {...props} title="Some title">
        Children
      </BaseLayout>
    );
    expect(document.title).toEqual("Some title");
  });

  describe("Warning message", () => {
    it("should show an error when the browser is not connected", () => {
      const { getByText } = render(
        <BaseLayout {...props}>Children</BaseLayout>,
        {
          storeState: { saving: { offline: true } },
        }
      );
      expect(getByText(/You're currently offline/)).toBeTruthy();
    });

    it("should show a banner when you are read only", () => {
      props.questionnaire.permission = READ;
      const { getByText } = render(
        <BaseLayout {...props}>Children</BaseLayout>
      );
      expect(getByText(/changes you make will not be saved/)).toBeTruthy();
    });

    it("should not show a banner when you can write", () => {
      props.questionnaire.permission = WRITE;
      const { queryByText } = render(
        <BaseLayout {...props}>Children</BaseLayout>
      );
      expect(queryByText(/changes you make will not be saved/)).toBeFalsy();
    });

    it("should show an error when there is an api error", () => {
      const { getByText } = render(
        <BaseLayout {...props}>Children</BaseLayout>,
        {
          storeState: { saving: { apiDownError: true } },
        }
      );
      expect(getByText(/unable to save your progress/)).toBeTruthy();
    });
  });
});
