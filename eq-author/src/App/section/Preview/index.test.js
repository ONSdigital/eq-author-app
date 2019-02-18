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

  it("should render as loading when no data", () => {
    const wrapper = shallow(
      <PreviewSectionRoute
        loading={false}
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
            introduction: {
              id: "1",
              introductionTitle: "",
              introductionContent: "",
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
            introduction: null,
          },
        }}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
