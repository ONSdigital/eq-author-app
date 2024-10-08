import React from "react";
import { shallow } from "enzyme";

import { UnwrappedPreviewSectionRoute as PreviewSectionRoute } from "./";

describe("PreviewSectionRoute", () => {
  it("should render as loading when loading", () => {
    const wrapper = shallow(
      <PreviewSectionRoute
        loading
        match={{
          params: { questionnaireId: "1", sectionId: "2" },
        }}
        data={null}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("should show the section intro preview when it is finished loading and has a section", () => {
    const wrapper = shallow(
      <PreviewSectionRoute
        loading={false}
        match={{
          params: { questionnaireId: "1", sectionId: "2" },
        }}
        data={{
          section: {
            id: "1",
            alias: "",
            title: "",
            introductionTitle: "intro title",
            introductionContent: "intro content",
            introductionEnabled: true,
            introductionPageDescription: "Introduction page description 1",
            requiredCompleted: false,
            showOnHub: false,
            sectionSummary: false,
            sectionSummaryPageDescription: "Section summary 2",
            collapsibleSummary: false,
            repeatingSection: false,
            repeatingSectionListId: null,
            comments: [],
            questionnaire: {
              id: "2",
              navigation: true,
              hub: false,
            },
            validationErrorInfo: {
              id: "4",
              totalCount: 0,
              errors: [],
              __typename: "ValidationErrorInfo",
            },
          },
        }}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("should redirect to design if section introduction is not enabled", () => {
    const wrapper = shallow(
      <PreviewSectionRoute
        loading={false}
        match={{
          params: { questionnaireId: "1", sectionId: "2" },
        }}
        data={{
          section: {
            id: "1",
            alias: "",
            title: "",
            introductionTitle: "",
            introductionContent: "",
            introductionEnabled: true,
            introductionPageDescription: "Introduction page description 2",
            requiredCompleted: false,
            showOnHub: false,
            sectionSummary: false,
            sectionSummaryPageDescription: "Section summary 2",
            collapsibleSummary: false,
            repeatingSection: false,
            repeatingSectionListId: null,
            comments: [],
            questionnaire: {
              id: "2",
              navigation: true,
              hub: false,
            },
            validationErrorInfo: {
              id: "4",
              totalCount: 0,
              errors: [],
              __typename: "ValidationErrorInfo",
            },
          },
        }}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
