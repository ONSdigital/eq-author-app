import { shallow } from "enzyme";
import React from "react";
import fakeId from "tests/utils/fakeId";

import { UnwrappedSectionNavItem as SectionNavItem } from "./SectionNavItem";

describe("SectionNavItem", () => {
  const page = { id: fakeId("2"), title: "Page", displayName: "Page" };
  const section = {
    id: fakeId("3"),
    title: "Section",
    displayName: "Section",
    pages: [page],
  };
  const questionnaire = {
    id: fakeId("1"),
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
