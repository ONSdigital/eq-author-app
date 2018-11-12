import QuestionnaireSettingsModal from "./";
import React from "react";
import { shallow } from "enzyme";
import QuestionnaireMeta from "components/QuestionnaireMeta";

describe("QuestionnaireSettingsModal", () => {
  const createWrapper = (props, render = shallow) =>
    render(
      <QuestionnaireSettingsModal
        questionnaire={{}}
        isOpen={false}
        onClose={jest.fn()}
        onSubmit={jest.fn()}
        confirmText="Create"
        {...props}
      />
    );

  it("should render", () => {
    const wrapper = createWrapper();
    expect(wrapper).toMatchSnapshot();
  });

  it("should call onClose when form is cancelled", () => {
    const onClose = jest.fn();
    const wrapper = createWrapper({ onClose });

    wrapper.find(QuestionnaireMeta).simulate("cancel");
    expect(onClose).toHaveBeenCalled();
  });

  it("should call onSubmit when form is submitted", () => {
    const onSubmit = jest.fn();
    const wrapper = createWrapper({ onSubmit });

    const result = {};
    wrapper.find(QuestionnaireMeta).simulate("submit", result);

    expect(onSubmit).toHaveBeenCalledWith(result);
  });
});
