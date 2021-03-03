import React from "react";
import { shallow } from "enzyme";
import Form from "components/Forms/Form";

import { StatelessQuestionnaireMeta } from "./";

let wrapper;

const handleChange = jest.fn();
const handleSubmit = jest.fn();
const handleBlur = jest.fn();
const handleUpdate = jest.fn();

const questionnaire = {
  shortTitle: "I am the shortTitle",
  type: "",
  title: "I am the title",
  id: "123",
};

describe("QuestionnaireMeta", () => {
  beforeEach(() => {
    wrapper = shallow(
      <StatelessQuestionnaireMeta
        questionnaire={questionnaire}
        onChange={handleChange}
        onUpdate={handleUpdate}
        onSubmit={handleSubmit}
        onBlur={handleBlur}
        confirmText="Create"
      />
    );
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("should handle submit event", () => {
    wrapper.find(Form).simulate("submit");
    expect(handleSubmit).toHaveBeenCalled();
  });

  it("should handle change event on child inputs", () => {
    const inputs = wrapper.find("[onChange]");
    inputs.forEach((input) => input.simulate("change"));

    expect(inputs.length).toBeGreaterThan(0);
    expect(handleChange).toHaveBeenCalledTimes(inputs.length);
  });

  it("should not enable the submit button until you have a type and a title", () => {
    expect(
      wrapper.find('[data-test="questionnaire-submit-button"]').prop("disabled")
    ).toBe(true);

    wrapper.setProps({
      questionnaire: { ...questionnaire, title: "hello", type: "Business" },
    });

    expect(
      wrapper.find('[data-test="questionnaire-submit-button"]').prop("disabled")
    ).toBe(false);
  });

  it("should not able to change the type of the questionnaire when canEditType is false", () => {
    wrapper = shallow(
      <StatelessQuestionnaireMeta
        questionnaire={questionnaire}
        onChange={handleChange}
        onUpdate={handleUpdate}
        onSubmit={handleSubmit}
        onBlur={handleBlur}
        confirmText="Create"
        canEditType={false}
      />
    );

    expect(
      wrapper.find('[data-test="select-questionnaire-type"]').prop("disabled")
    ).toBe(true);
  });
});
