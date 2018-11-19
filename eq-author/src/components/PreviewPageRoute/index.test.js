import { shallow } from "enzyme";
import React from "react";

import { TEXTFIELD } from "constants/answer-types";

import { UnwrappedPreviewPageRoute as PreviewPageRoute } from "./";

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
      answers: [{ id: "1", type: TEXTFIELD }],
      section: {
        id: "1",
        questionnaire: {
          id: "1",
          metadata: []
        }
      }
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
    expect(wrapper.find('[data-test="no-answers"]')).toBeTruthy();
  });

  it("should not render description when not populated", () => {
    questionPage.description = null;
    const wrapper2 = shallow(
      <PreviewPageRoute loading={false} data={{ questionPage }} />
    );
    expect(wrapper2.exists('[data-test="description"]')).toBeFalsy();
  });

  it("should not render guidance, or description when they are not populated", () => {
    questionPage.guidance = "<p></p>";
    const wrapper = shallow(
      <PreviewPageRoute loading={false} data={{ questionPage }} />
    );
    expect(wrapper.exists('[data-test="guidance"]')).toBeFalsy();
  });

  it("should render a warning there is no title", () => {
    questionPage.title = "<p></p>";
    const wrapper = shallow(
      <PreviewPageRoute loading={false} data={{ questionPage }} />
    );

    expect(wrapper.find('[data-test="no-title"]')).toBeTruthy();
  });
});
