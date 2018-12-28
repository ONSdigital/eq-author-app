import { shallow } from "enzyme";
import { UnwrappedSectionNavItem as SectionNavItem } from "App/components/NavigationSidebar/SectionNavItem";
import React from "react";

describe("SectionNavItem", () => {
  const page = { id: "2", title: "Page", displayName: "Page" };
  const section = {
    id: "3",
    title: "Section",
    displayName: "Section",
    pages: [page]
  };
  const questionnaire = {
    id: "1",
    title: "Questionnaire",
    displayName: "Questionnaire",
    sections: [section]
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
            questionnaireId: "1",
            tab: "design"
          }
        }}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
