import React from "react";
import { shallow } from "enzyme";
import { UnwrappedMetadataContentPicker } from "components/Validation/MetadataContentPicker";

const render = (props = {}) =>
  shallow(<UnwrappedMetadataContentPicker {...props} />);

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
              displayName: "foobar1"
            },
            {
              id: "2",
              displayName: "foobar2"
            }
          ]
        }
      }
    };

    wrapper = render(props);
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });
});
