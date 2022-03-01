import React from "react";
import { shallow } from "enzyme";

import { IntroductionEditor } from "./";

import { contactDetailsErrors } from "constants/validationMessages";
import { useParams } from "react-router-dom";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
  useMatch: jest.fn(),
  useParams: jest.fn(),
}));

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
          totalCount: 0,
        },
      },
      onChangeUpdate: jest.fn(),
      updateQuestionnaireIntroduction: jest.fn(),
    };

    useParams.mockImplementation(() => ({
      questionnaireId: "questionnaire-1",
      introductionId: "1",
    }));
  });

  const { PHONE_NOT_ENTERED, EMAIL_NOT_ENTERED } = contactDetailsErrors;

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

  it("should display validation error message when phone number is not entered", () => {
    props.introduction.validationErrorInfo = {
      errors: [
        {
          id: "1",
          errorCode: "ERR_VALID_REQUIRED",
          field: "contactDetailsPhoneNumber",
          type: "introduction",
        },
      ],
      totalCount: 1,
    };

    const wrapper = shallow(<IntroductionEditor {...props} />);

    expect(wrapper.find({ children: PHONE_NOT_ENTERED })).toHaveLength(1);
  });

  it("should display validation error message when email address is not entered", () => {
    props.introduction.validationErrorInfo = {
      errors: [
        {
          id: "1",
          errorCode: "ERR_VALID_REQUIRED",
          field: "contactDetailsEmailAddress",
          type: "introduction",
        },
      ],
      totalCount: 1,
    };

    const wrapper = shallow(<IntroductionEditor {...props} />);

    expect(wrapper.find({ children: EMAIL_NOT_ENTERED })).toHaveLength(1);
  });

  it("should update contact details", () => {
    const wrapper = shallow(<IntroductionEditor {...props} />);

    const phoneInput = wrapper.find(
      "[data-test='txt-contact-details-phone-number']"
    );
    const emailAddressInput = wrapper.find(
      "[data-test='txt-contact-details-email-address']"
    );
    const emailSubjectInput = wrapper.find(
      "[data-test='txt-contact-details-email-subject']"
    );

    phoneInput.simulate("blur", { target: { value: "0" } });
    emailAddressInput.simulate("blur", {
      target: { value: "test@test.com" },
    });
    emailSubjectInput.simulate("blur", {
      target: { value: "Test" },
    });

    expect(props.updateQuestionnaireIntroduction).toHaveBeenCalledTimes(3);
  });
});
