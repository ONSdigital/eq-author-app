import React from "react";
import { shallow } from "enzyme";
import SectionNav from "./SectionNav";

describe("SectionNav", () => {
  let wrapper;

  const page = { id: "2", title: "Page" };
  const section = { id: "3", title: "Section", pages: [page] };
  const questionnaire = {
    id: "1",
    title: "Questionnaire",
    sections: [section]
  };

  beforeEach(() => {
    wrapper = shallow(
      <SectionNav
        questionnaire={questionnaire}
        currentSectionId={section.id}
        currentPageId={page.id}
      />
    );
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });
});
