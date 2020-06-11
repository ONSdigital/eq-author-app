import { shallow } from "enzyme";
import React from "react";

import { UnwrappedSectionNavItem as SectionNavItem } from "./SectionNavItem";

describe("SectionNavItem", () => {
  const page = {
    id: "2",
    title: "Page",
    displayName: "Page",
    validationErrorInfo: { totalCount: 2 },
  };
  const section = {
    id: "3",
    title: "Section",
    displayName: "Section",
    pages: [page],
    validationErrorInfo: {
      totalCount: 2,
    },
  };
  const questionnaire = {
    id: "1",
    title: "Questionnaire",
    displayName: "Questionnaire",
    sections: [section],
  };

  it("should render", () => {
    const handleAddPage = jest.fn(() => Promise.resolve);
    const wrapper = shallow(
      <SectionNavItem
        questionnaire={questionnaire}
        section={section}
        onAddPage={handleAddPage}
        duration={123}
        isActive={jest.fn()}
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
