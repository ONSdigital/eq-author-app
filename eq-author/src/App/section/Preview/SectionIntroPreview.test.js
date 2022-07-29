import React from "react";
import { shallow } from "enzyme";

import SectionIntroPreview from "./SectionIntroPreview";

describe("SectionIntroPreview", () => {
  let section;

  beforeEach(() => {
    section = {
      id: "1",
      title: "",
      alias: "",
      introductionTitle: "<p>title</p>",
      introductionContent: "<h2>Content</h2>",
      requiredCompleted: false,
      showOnHub: false,
      sectionSummary: false,
      collapsibleSummary: false,
      questionnaire: {
        id: "1",
        navigation: true,
        hub: true,
      },
      validationErrorInfo: {
        id: "vei1",
        totalCount: 0,
        errors: [],
        __typename: "ValidationErrorInfo",
      },
      comments: [],
    };
  });

  it("should render with all content", () => {
    const wrapper = shallow(<SectionIntroPreview section={section} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should render an error when the title is missing", () => {
    section.introductionTitle = "";
    const wrapper = shallow(<SectionIntroPreview section={section} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should render an error when the content is missing", () => {
    section.introductionContent = "";
    const wrapper = shallow(<SectionIntroPreview section={section} />);
    expect(wrapper).toMatchSnapshot();
  });
});
