import { shallow } from "enzyme";
import SectionNavItem from "./SectionNavItem";
import React from "react";

describe("SectionNavItem", () => {
  let wrapper, handleAddPage;

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

  beforeEach(() => {
    handleAddPage = jest.fn(() => Promise.resolve);

    wrapper = shallow(
      <SectionNavItem
        questionnaire={questionnaire}
        section={section}
        onAddPage={handleAddPage}
        duration={123}
        isActive={jest.fn()}
      />
    );
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });
});
