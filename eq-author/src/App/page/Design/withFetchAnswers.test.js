import React from "react";
import { shallow } from "enzyme";

import { UnwrappedWithFetchAnswers } from "./withFetchAnswers";

const EnhancedComponent = UnwrappedWithFetchAnswers("div");

const createWrapper = (props, render = shallow) =>
  render(<EnhancedComponent {...props} />);

describe("withFetchAnswers", () => {
  let props, wrapper;
  let query = jest.fn();
  let readQuery = jest.fn();

  beforeEach(() => {
    props = {
      client: {
        query: query,
        readQuery: readQuery,
      },
    };

    wrapper = createWrapper(props);
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });
});
