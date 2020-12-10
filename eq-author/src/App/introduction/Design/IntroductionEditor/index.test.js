import React from "react";
import { shallow } from "enzyme";

import { IntroductionEditor } from "./";

describe("IntroductionEditor", () => {
  let props;
  beforeEach(() => {
    props = {
      introduction: {
        id: "1",
        title: "title",
        additionalGuidancePanelSwitch: true,
        additionalGuidancePanel: "additionalGuidancePanel",
        description: "description",
        secondaryTitle: "secondary title",
        secondaryDescription: "secondary description",
        collapsibles: [],
        tertiaryTitle: "tertiary title",
        tertiaryDescription: "tertiary description",
        legalBasis: "VOLUNTARY",
      },
      onChangeUpdate: jest.fn(),
    };
  });

  it("should render", () => {
    expect(shallow(<IntroductionEditor {...props} />)).toMatchSnapshot();
  });
});
