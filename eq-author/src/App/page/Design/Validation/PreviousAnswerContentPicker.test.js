import React from "react";
import { shallow } from "enzyme";
import PreviousAnswerContentPicker from "./PreviousAnswerContentPicker";
import { buildQuestionnaire } from "tests/utils/createMockQuestionnaire";

jest.mock("components/QuestionnaireContext", () => ({
  useQuestionnaire: jest.fn(),
}));

jest.mock("components/RouterContext", () => ({
  useCurrentPageId: jest.fn(),
}));

const render = (props = {}) =>
  shallow(<PreviousAnswerContentPicker {...props} />);

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
                  displayName: "Section (1)",
                },
              },
            },
            {
              id: "7",
              displayName: "Date 2",
              page: {
                id: "1",
                displayName: "Page (1.1)",
                section: {
                  id: "1",
                  displayName: "Section (1)",
                },
              },
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
