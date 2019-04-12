import React from "react";
import { shallow } from "enzyme";

import ErrorBoundary from "./";
import { ERR_PAGE_NOT_FOUND } from "constants/error-codes";
import NotFound from "App/NotFoundPage";

const MockComponent = () => null;

describe("ErrorBoundary", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(
      <ErrorBoundary>
        <MockComponent />
      </ErrorBoundary>
    );
  });

  it("should render the child component by default", () => {
    expect(wrapper.find(MockComponent)).toHaveLength(1);
  });

  it("should display not found page when ERR_PAGE_NOT_FOUND error thrown", () => {
    const error = new Error(ERR_PAGE_NOT_FOUND);
    wrapper.find(MockComponent).simulateError(error);
    expect(wrapper.instance().render()).toMatchObject(<NotFound />);
  });
});
