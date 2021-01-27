import { shallow } from "enzyme";
import React from "react";
import { buildQuestionnaire } from "tests/utils/createMockQuestionnaire";

import { UnwrappedSectionNavItem as SectionNavItem } from "./SectionNavItem";

describe("SectionNavItem", () => {
  const questionnaire = buildQuestionnaire();

  it("should render", () => {
    const handleAddPage = jest.fn(() => Promise.resolve);
    const wrapper = shallow(
      <SectionNavItem
        questionnaire={questionnaire}
        section={questionnaire.sections[0]}
        onAddPage={handleAddPage}
        duration={123}
        isActive={jest.fn()}
        isOpen={{ open: true }}
        handleChange={jest.fn()}
        identity={1}
        match={{
          params: {
            questionnaireId: questionnaire.id,
            tab: "design",
          },
        }}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
