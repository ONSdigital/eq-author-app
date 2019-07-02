import React from "react";
import { shallow } from "enzyme";
import { byTestAttr } from "tests/utils/selectors";

import EditorLayout from "./";

describe("Editor Layout", () => {
  let props;
  beforeEach(() => {
    props = {
      page: {
        id: "1",
        displayName: "Foo",
        answers: [],
      },
      design: true,
      preview: false,
      routing: true,
    };
  });

  it("should render", () => {
    const wrapper = shallow(<EditorLayout {...props}>Content</EditorLayout>);
    expect(wrapper).toMatchSnapshot();
  });

  it("should add new question page to correct section", () => {
    const onAddQuestionPage = jest.fn();

    const wrapper = shallow(
      <EditorLayout {...props} onAddQuestionPage={onAddQuestionPage}>
        Content
      </EditorLayout>
    );

    wrapper
      .find(byTestAttr("btn-add-page"))
      .first()
      .simulate("click");

    expect(onAddQuestionPage).toHaveBeenCalled();
  });

  it("should render the panel when a render function is provided", () => {
    const renderPanel = jest
      .fn()
      .mockReturnValue(<div data-test="test-panel">Panel</div>);

    const wrapper = shallow(
      <EditorLayout {...props} renderPanel={renderPanel}>
        Content
      </EditorLayout>
    );

    expect(renderPanel).toHaveBeenCalled();
    expect(wrapper.find("[data-test='test-panel']")).toHaveLength(1);
  });
});
