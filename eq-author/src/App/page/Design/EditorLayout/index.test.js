import React from "react";
import { shallow } from "enzyme";
import { byTestAttr } from "tests/utils/selectors";

import EditorLayout from "./";

describe("Editor Layout", () => {
  it("should render", () => {
    const props = {
      onAddQuestionPage: jest.fn(),
      page: {
        id: "1",
        displayName: "Foo",
        answers: [],
      },
      design: true,
      preview: false,
      routing: true,
    };
    const wrapper = shallow(<EditorLayout {...props}>Content</EditorLayout>);
    expect(wrapper).toMatchSnapshot();
  });

  it("should add new question page to correct section", () => {
    const props = {
      onAddQuestionPage: jest.fn(),
      page: {
        id: "1",
        displayName: "Foo",
        answers: [],
        section: {
          id: 1,
        },
      },
      design: true,
      preview: false,
      routing: true,
    };

    const wrapper = shallow(<EditorLayout {...props}>Content</EditorLayout>);

    wrapper
      .find(byTestAttr("btn-add-page"))
      .first()
      .simulate("click");

    expect(props.onAddQuestionPage).toHaveBeenCalled();
  });
});
