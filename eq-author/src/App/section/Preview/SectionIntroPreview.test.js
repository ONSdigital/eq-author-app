import React from "react";
import { shallow } from "enzyme";

import SectionIntroPreview from "./SectionIntroPreview";

describe("SectionIntroPreview", () => {
  let introduction;

  beforeEach(() => {
    introduction = {
      id: "1",
      introductionTitle: "<p>title</p>",
      introductionContent: "<h2>Content</h2>",
    };
  });

  it("should render with all content", () => {
    const wrapper = shallow(
      <SectionIntroPreview introduction={introduction} />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("should render an error when the title is missing", () => {
    introduction.introductionTitle = "";
    const wrapper = shallow(
      <SectionIntroPreview introduction={introduction} />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("should render an error when the content is missing", () => {
    introduction.introductionContent = "";
    const wrapper = shallow(
      <SectionIntroPreview introduction={introduction} />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
