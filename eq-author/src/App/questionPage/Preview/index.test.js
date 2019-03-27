import React from "react";
import { shallow } from "enzyme";

import { byTestAttr } from "tests/utils/selectors";
import { TEXTFIELD } from "constants/answer-types";

import Error from "components/preview/Error";

import {
  DetailsContent,
  DetailsTitle,
  UnwrappedPreviewPageRoute as PreviewPageRoute,
} from "./";

describe("PreviewPageRoute", () => {
  let page;
  beforeEach(() => {
    page = {
      id: "1",
      displayName: "Question",
      position: 1,
      title: "<p>Hello world</p>",
      description: "<p>Description</p>",
      descriptionEnabled: true,
      guidance: "<p>Guidance</p>",
      guidanceEnabled: true,
      definitionLabel: "<p>Definition Label</p>",
      definitionContent: "<p>Definition Content</p>",
      definitionEnabled: true,
      additionalInfoLabel: "<p>Additional Info Label</p>",
      additionalInfoContent: "<p>Additional Info Content</p>",
      additionalInfoEnabled: true,
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
      <PreviewPageRoute loading={false} data={{ page }} />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("should render a loading message when loading", () => {
    const wrapper = shallow(<PreviewPageRoute loading data={null} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should render warning when there are no answers", () => {
    page.answers = [];
    const wrapper = shallow(
      <PreviewPageRoute loading={false} data={{ page }} />
    );
    expect(wrapper.find(byTestAttr("no-answers"))).toBeTruthy();
  });

  it("should not render description when disabled", () => {
    page.descriptionEnabled = false;
    const wrapper2 = shallow(
      <PreviewPageRoute loading={false} data={{ page }} />
    );
    expect(wrapper2.exists(byTestAttr("description"))).toBeFalsy();
  });

  it("should render description missing message", () => {
    page.description = "";
    const wrapper2 = shallow(
      <PreviewPageRoute loading={false} data={{ page }} />
    );
    expect(
      wrapper2.find(byTestAttr("description")).find(Error)
    ).toMatchSnapshot();
  });

  it("should not render guidance when disabled", () => {
    page.guidanceEnabled = false;
    const wrapper = shallow(
      <PreviewPageRoute loading={false} data={{ page }} />
    );
    expect(wrapper.exists(byTestAttr("guidance"))).toBeFalsy();
  });

  it("should render guidance missing message", () => {
    page.guidance = "";
    const wrapper2 = shallow(
      <PreviewPageRoute loading={false} data={{ page }} />
    );
    expect(wrapper2.find(byTestAttr("guidance")).find(Error)).toMatchSnapshot();
  });

  it("should not render definition when disabled", () => {
    page.definitionEnabled = false;
    const wrapper = shallow(
      <PreviewPageRoute loading={false} data={{ page }} />
    );
    expect(wrapper.exists(byTestAttr("definition"))).toBeFalsy();
  });

  it("should render definition label missing message", () => {
    page.definitionLabel = "";
    const wrapper = shallow(
      <PreviewPageRoute loading={false} data={{ page }} />
    );
    expect(
      wrapper.find(byTestAttr("definition")).find(DetailsTitle)
    ).toMatchSnapshot();
  });

  it("should render definition content missing message", () => {
    page.definitionContent = "";
    const wrapper = shallow(
      <PreviewPageRoute loading={false} data={{ page }} />
    );
    expect(
      wrapper.find(byTestAttr("definition")).find(DetailsContent)
    ).toMatchSnapshot();
  });

  it("should not render additional information when disabled", () => {
    page.additionalInfoEnabled = false;
    const wrapper = shallow(
      <PreviewPageRoute loading={false} data={{ page }} />
    );
    expect(wrapper.exists(byTestAttr("additional-info"))).toBeFalsy();
  });

  it("should render additional info label missing message", () => {
    page.additionalInfoLabel = "";
    const wrapper = shallow(
      <PreviewPageRoute loading={false} data={{ page }} />
    );
    expect(
      wrapper.find(byTestAttr("additional-info")).find(DetailsTitle)
    ).toMatchSnapshot();
  });

  it("should render additional info content missing message", () => {
    page.additionalInfoContent = "";
    const wrapper = shallow(
      <PreviewPageRoute loading={false} data={{ page }} />
    );
    expect(
      wrapper.find(byTestAttr("additional-info")).find(DetailsContent)
    ).toMatchSnapshot();
  });
});
