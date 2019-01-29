import React from "react";
import { shallow } from "enzyme";

import { byTestAttr } from "tests/utils/selectors";
import { TEXTFIELD } from "constants/answer-types";

import {
  DetailsContent,
  DetailsTitle,
  UnwrappedPreviewPageRoute as PreviewPageRoute,
} from "./";

describe("PreviewPageRoute", () => {
  let questionPage;
  beforeEach(() => {
    questionPage = {
      id: "1",
      displayName: "Question",
      position: 1,
      title: "<p>Hello world</p>",
      guidance: "<p>Guidance</p>",
      description: "<p>Description</p>",
      definitionLabel: "<p>Definition Label</p>",
      definitionContent: "<p>Definition Content</p>",
      additionalInfoLabel: "<p>Additional Info Label</p>",
      additionalInfoContent: "<p>Additional Info Content</p>",
      answers: [{ id: "1", type: TEXTFIELD }],
      section: {
        id: "1",
        questionnaire: {
          id: "1",
          metadata: [],
        },
      },
    };
  });

  it("should render", () => {
    const wrapper = shallow(
      <PreviewPageRoute loading={false} data={{ questionPage }} />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("should render a loading message when loading", () => {
    const wrapper = shallow(<PreviewPageRoute loading data={null} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should render warning when there are no answers", () => {
    questionPage.answers = [];
    const wrapper = shallow(
      <PreviewPageRoute loading={false} data={{ questionPage }} />
    );
    expect(wrapper.find(byTestAttr("no-answers"))).toBeTruthy();
  });

  it("should not render description when not populated", () => {
    questionPage.description = null;
    const wrapper2 = shallow(
      <PreviewPageRoute loading={false} data={{ questionPage }} />
    );
    expect(wrapper2.exists(byTestAttr("description"))).toBeFalsy();
  });

  it("should not render guidance, or description when they are not populated", () => {
    questionPage.guidance = "";
    const wrapper = shallow(
      <PreviewPageRoute loading={false} data={{ questionPage }} />
    );
    expect(wrapper.exists(byTestAttr("guidance"))).toBeFalsy();
  });

  it("should not render definition if definition label and content empty", () => {
    questionPage.definitionLabel = "";
    questionPage.definitionContent = "";
    const wrapper = shallow(
      <PreviewPageRoute loading={false} data={{ questionPage }} />
    );
    expect(wrapper.exists(byTestAttr("definition"))).toBeFalsy();
  });

  it("should render definition label missing message", () => {
    questionPage.definitionLabel = "";
    const wrapper = shallow(
      <PreviewPageRoute loading={false} data={{ questionPage }} />
    );
    expect(
      wrapper.find(byTestAttr("definition")).find(DetailsTitle)
    ).toMatchSnapshot();
  });

  it("should render definition content missing message", () => {
    questionPage.definitionContent = "";
    const wrapper = shallow(
      <PreviewPageRoute loading={false} data={{ questionPage }} />
    );
    expect(
      wrapper.find(byTestAttr("definition")).find(DetailsContent)
    ).toMatchSnapshot();
  });

  it("should not render additional information if additional information label and content empty", () => {
    questionPage.additionalInfoLabel = "";
    questionPage.additionalInfoContent = "";
    const wrapper = shallow(
      <PreviewPageRoute loading={false} data={{ questionPage }} />
    );
    expect(wrapper.exists(byTestAttr("additional-info"))).toBeFalsy();
  });

  it("should render additional info label missing message", () => {
    questionPage.additionalInfoLabel = "";
    const wrapper = shallow(
      <PreviewPageRoute loading={false} data={{ questionPage }} />
    );
    expect(
      wrapper.find(byTestAttr("additional-info")).find(DetailsTitle)
    ).toMatchSnapshot();
  });

  it("should render additional info content missing message", () => {
    questionPage.additionalInfoContent = "";
    const wrapper = shallow(
      <PreviewPageRoute loading={false} data={{ questionPage }} />
    );
    expect(
      wrapper.find(byTestAttr("additional-info")).find(DetailsContent)
    ).toMatchSnapshot();
  });
});
