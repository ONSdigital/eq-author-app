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
        contactDetailsPhoneNumber: "0300 1234 931",
        contactDetailsEmailAddress: "surveys@ons.gov.uk",
        contactDetailsEmailSubject: "Change of details",
        contactDetailsIncludeRuRef: false,
        additionalGuidancePanelSwitch: false,
        additionalGuidancePanel: "additionalGuidancePanel",
        description: "description",
        secondaryTitle: "secondary title",
        secondaryDescription: "secondary description",
        collapsibles: [],
        tertiaryTitle: "tertiary title",
        tertiaryDescription: "tertiary description",
        validationErrorInfo: {
          errors: [],
        },
      },
      onChangeUpdate: jest.fn(),
      updateQuestionnaireIntroduction: jest.fn(),
    };
  });

  it("should render", () => {
    expect(shallow(<IntroductionEditor {...props} />)).toMatchSnapshot();
  });

  it("should toggle the additional guidance panel", () => {
    const wrapper = shallow(<IntroductionEditor {...props} />);
    expect(
      wrapper.find('[name="additionalGuidancePanel"]').exists()
    ).toBeFalsy();
    wrapper
      .find("#toggle-additional-guidance-panel")
      .simulate("change", { target: { checked: true } });
    expect(props.updateQuestionnaireIntroduction).toHaveBeenCalledTimes(1);
  });

  it("should show the additional guidance panel", () => {
    props.introduction.additionalGuidancePanelSwitch = true;
    const wrapper = shallow(<IntroductionEditor {...props} />);
    expect(
      wrapper.find('[name="additionalGuidancePanel"]').exists()
    ).toBeTruthy();
  });

  it("should toggle the add RU ref to the subject line", () => {
    const wrapper = shallow(<IntroductionEditor {...props} />);
    expect(
      wrapper.find('[name="toggle-contact-details-include-ruref"]').exists()
    ).toBeTruthy();
    wrapper
      .find("#toggle-contact-details-include-ruref")
      .simulate("change", { target: { checked: false } });
    expect(props.updateQuestionnaireIntroduction).toHaveBeenCalledTimes(1);
  });
});
