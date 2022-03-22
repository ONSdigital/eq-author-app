import React from "react";
import { shallow } from "enzyme";
import { byTestAttr } from "tests/utils/selectors";
import { MeContext } from "App/MeContext";

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

  const user = {
    id: "1",
    name: "Name",
  };

  it("should render", () => {
    const wrapper = shallow(
      <MeContext.Provider value={{ me: user }}>
        <EditorLayout {...props}>Content</EditorLayout>
      </MeContext.Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("should add new question page to correct section", () => {
    const onAddQuestionPage = jest.fn();

    const wrapper = shallow(
      <MeContext.Provider value={{ me: user }}>
        <EditorLayout {...props} onAddQuestionPage={onAddQuestionPage}>
          Content
        </EditorLayout>
      </MeContext.Provider>
    );

    wrapper.find(byTestAttr("btn-add-page")).first().simulate("click");

    expect(onAddQuestionPage).toHaveBeenCalled();
  });

  it("should render the panel when a render function is provided", () => {
    const renderPanel = jest
      .fn()
      .mockReturnValue(<div data-test="test-panel">Panel</div>);

    const wrapper = shallow(
      <MeContext.Provider value={{ me: user }}>
        <EditorLayout
          {...props}
          singleColumnLayout={null}
          renderPanel={renderPanel}
        >
          Content
        </EditorLayout>
      </MeContext.Provider>
    );

    expect(renderPanel).toHaveBeenCalled();
    expect(wrapper.find("[data-test='test-panel']")).toHaveLength(1);
  });

  it("should render right hand panel if singleColumnLayout is null", () => {
    const wrapper = shallow(
      <MeContext.Provider value={{ me: user }}>
        <EditorLayout {...props}>Content</EditorLayout>
      </MeContext.Provider>
    );
    expect(wrapper.find("[data-test='right-hand-panel']")).toHaveLength(1);
  });

  it("should NOT render right hand panel if singleColumnLayout is true", () => {
    const wrapper = shallow(
      <MeContext.Provider value={{ me: user }}>
        <EditorLayout {...props} singleColumnLayout>
          Content
        </EditorLayout>
      </MeContext.Provider>
    );

    expect(wrapper.find("[data-test='right-hand-panel']")).toHaveLength(0);
  });
});
