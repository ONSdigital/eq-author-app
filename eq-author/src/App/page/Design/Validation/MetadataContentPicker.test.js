import React from "react";
import { shallow } from "enzyme";
import MetadataContentPicker from "./MetadataContentPicker";

const render = (props = {}) => shallow(<MetadataContentPicker {...props} />);

describe("MetadataContentPicker", () => {
  let props, wrapper;

  beforeEach(() => {
    props = {
      answerId: "1",
      onSubmit: jest.fn(),
      selectedContentDisplayName: "foobar",
      path: "foo.bar",
      data: {
        foo: {
          bar: [
            {
              id: "1",
              displayName: "foobar1",
            },
            {
              id: "2",
              displayName: "foobar2",
            },
          ],
        },
      },
    };

    wrapper = render(props);
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });
});
