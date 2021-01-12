import React from "react";
import { shallow } from "enzyme";

import UnwrappedLogicPage from "./";

describe("Logic Page", () => {
  let props;

  beforeEach(() => {
    props = {
      page: {
        id: "1",
        displayName: "My first displayname",
        validationErrorInfo: {
          totalCount: 2,
          errors: [
            {
              id: "expressions-skipConditions-1",
              type: "skipConditionExpression",
            },
            {
              id: "expressions-routing-1",
              type: "routingExpression",
            },
          ],
        },
      },
    };
  });

  const render = () =>
    shallow(<UnwrappedLogicPage {...props}>Content</UnwrappedLogicPage>);

  it("should render", () => {
    expect(render()).toMatchSnapshot();
  });

  it("should provide an error dot for both routing and skip tabs if errors present", () => {
    expect(render().find("[data-test='badge-withCount']")).toHaveLength(2);
  });

  it("should not provide the validation error dot for the routing tab if design page has no error", () => {
    props.page.validationErrorInfo = {
      totalCount: 0,
      errors: [],
    };

    expect(render().find("[data-test='badge-withCount']")).toHaveLength(0);
  });
});
