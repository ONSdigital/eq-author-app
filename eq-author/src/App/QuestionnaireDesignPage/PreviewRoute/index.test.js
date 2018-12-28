import React from "react";
import { shallow } from "enzyme";

import PreviewPageRoute from "App/questionPage/Preview";
import PreviewSectionRoute from "App/section/Preview";

import { UnwrappedPreviewRoute as PreviewRoute } from ".";

describe("PreviewRoute", () => {
  it("should render page preview when match params are for a page", () => {
    const match = {
      params: {
        questionnaireId: "1",
        sectionId: "2",
        pageId: "3",
        tab: "preview"
      }
    };

    const wrapper = shallow(<PreviewRoute match={match} />);

    expect(wrapper.find(PreviewPageRoute)).toHaveLength(1);
  });

  it("should render section preview when match params are for a section", () => {
    const match = {
      params: {
        questionnaireId: "1",
        sectionId: "2",
        tab: "preview"
      }
    };

    const wrapper = shallow(<PreviewRoute match={match} />);

    expect(wrapper.find(PreviewSectionRoute)).toHaveLength(1);
  });
});
