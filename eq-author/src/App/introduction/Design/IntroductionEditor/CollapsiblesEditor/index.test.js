import React from "react";
import { render, fireEvent } from "tests/utils/rtl";
import { withRouter } from "react-router-dom";

import { CollapsiblesEditor } from "./";


describe("CollapsiblesEditor", () => {
  let props, Component;
  beforeEach(() => {
    props = {
      collapsibles: [
        {
          id: "1",
          title: "collapsible title",
          description: "collapsible description",
        },
        {
          id: "2",
          title: "collapsible2 title",
          description: "collapsible2 description",
        },
      ],
      createCollapsible: jest.fn(),
      moveCollapsible: jest.fn(),
      introductionId: "introId",
    };
  });

  Component = withRouter(CollapsiblesEditor);

  it("should render", () => {
    const { getByText } = render(<Component {...props} />, {
      route: `/q/2`,
      urlParamMatcher: "/q/:questionnaireId",
    });
    expect(getByText("collapsible2 title")).toBeTruthy();
  });

  it("should create the collapsible when the add button is clicked", () => {
    const { getByTestId } = render(<Component {...props} />, {
      route: `/q/2`,
      urlParamMatcher: "/q/:questionnaireId",
    });
    fireEvent.click(getByTestId("add-collapsible-btn"));

    expect(props.createCollapsible).toHaveBeenCalledWith({
      introductionId: "introId",
    });
  });

  it("should move the collapsible when move is triggered", () => {
    const { getByTestId } = render(<Component {...props} />, {
      route: `/q/2`,
      urlParamMatcher: "/q/:questionnaireId",
    });
    fireEvent.click(getByTestId("move-up-btn"));

    expect(props.moveCollapsible).toHaveBeenCalledWith({
      id: "2",
      position: 0,
    });
  });
});
