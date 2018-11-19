import React from "react";
import { shallow } from "enzyme";
import { UnwrappedPreviousAnswerContentPicker } from "components/Validation/PreviousAnswerContentPicker";

const render = (props = {}) =>
  shallow(<UnwrappedPreviousAnswerContentPicker {...props} />);

describe("PreviousAnswerContentPicker", () => {
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
              id: "6",
              displayName: "Date 1",
              page: {
                id: "1",
                displayName: "Page (1.1)",
                section: {
                  id: "1",
                  displayName: "Section (1)"
                }
              }
            },
            {
              id: "7",
              displayName: "Date 2",
              page: {
                id: "1",
                displayName: "Page (1.1)",
                section: {
                  id: "1",
                  displayName: "Section (1)"
                }
              }
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
