import React from "react";
import { shallow } from "enzyme";
import Form from "components/Forms/Form";

import { StatelessQuestionnaireMeta } from "components/QuestionnaireMeta";

let wrapper;

const handleChange = jest.fn();
const handleSubmit = jest.fn();
const handleBlur = jest.fn();
const handleUpdate = jest.fn();

const questionnaire = {
  description: "I am the description",
  legalBasis: "StatisticsOfTradeAct",
  theme: "default",
  title: "I am the title",
  id: "123"
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
    inputs.forEach(input => input.simulate("change"));

    expect(inputs.length).toBeGreaterThan(0);
    expect(handleChange).toHaveBeenCalledTimes(inputs.length);
  });
});
