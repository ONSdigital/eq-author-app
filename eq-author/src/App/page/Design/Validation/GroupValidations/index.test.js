import React from "react";
import { shallow, mount } from "enzyme";

import Button from "components/buttons/Button";

import { NUMBER, CURRENCY, PERCENTAGE } from "constants/answer-types";
import { ERR_NO_VALUE } from "constants/validationMessages";

import GroupValidations, { TotalButton, GroupValidationModal } from "./";

describe("GroupValidations", () => {
  let props;
  beforeEach(() => {
    props = {
      totalValidation: {
        id: "1",
        entityType: "Custom",
        custom: 3,
      },
      validationError: {
        id: "1",
        errors: [
          {
            errorCode: "ERR_NO_VALUE",
            field: "totalValidation",
            id: "pages-1-totalValidation",
            type: "pages",
          },
        ],
        totalCount: 1,
      },
      type: CURRENCY,
    };
  });

  it("should render", () => {
    expect(shallow(<GroupValidations {...props} />)).toMatchSnapshot();
  });

  it("should render as disabled", () => {
    props.totalValidation = null;
    const wrapper = shallow(<GroupValidations {...props} />);
    expect(wrapper.find(TotalButton).props()).toMatchObject({ disabled: true });
  });

  it("should show the custom value when the total validation has one", () => {
    props.totalValidation = {
      ...props.totalValidation,
      enabled: true,
      entityType: "Custom",
      custom: 5,
    };
    props.type = NUMBER;
    const wrapper = mount(<GroupValidations {...props} />);
    expect(wrapper.find(TotalButton).text()).toContain("5");
  });

  it("should format the custom value when the total validation has one - currency", () => {
    props.totalValidation = {
      ...props.totalValidation,
      enabled: true,
      entityType: "Custom",
      custom: 5,
    };
    props.type = CURRENCY;
    const wrapper = mount(<GroupValidations {...props} />);
    expect(wrapper.find(TotalButton).text()).toContain("£5");
  });

  it("should format the custom value when the total validation has one", () => {
    props.totalValidation = {
      ...props.totalValidation,
      enabled: true,
      entityType: "Custom",
      custom: 5,
    };
    props.type = PERCENTAGE;
    const wrapper = mount(<GroupValidations {...props} />);
    expect(wrapper.find(TotalButton).text()).toContain("5%");
  });

  it("should show the previous answer's display name when the total validation has one", () => {
    props.totalValidation = {
      ...props.totalValidation,
      enabled: true,
      entityType: "PreviousAnswer",
      previousAnswer: {
        displayName: "Some answer",
      },
    };
    const wrapper = mount(<GroupValidations {...props} />);
    expect(wrapper.find(TotalButton).text()).toContain("Some answer");
  });

  it("should show the condition", () => {
    props.totalValidation = {
      ...props.totalValidation,
      enabled: true,
      entityType: "Custom",
      custom: 5,
      condition: "GreaterThan",
    };
    props.type = PERCENTAGE;
    const wrapper = mount(<GroupValidations {...props} />);
    expect(wrapper.find(TotalButton).text()).toContain("more than");
  });

  it("should not show the condition when there is no value", () => {
    props.totalValidation = {
      ...props.totalValidation,
      enabled: true,
      entityType: "Custom",
      custom: null,
      condition: "GreaterThan",
    };
    props.type = PERCENTAGE;
    const wrapper = mount(<GroupValidations {...props} />);
    expect(wrapper.find(TotalButton).text()).not.toContain("more than");
  });

  it("should show the modal when the button is clicked", () => {
    const wrapper = shallow(<GroupValidations {...props} />);
    wrapper.find(TotalButton).simulate("click");
    expect(wrapper.find(GroupValidationModal).props()).toMatchObject({
      isOpen: true,
    });
  });

  it("should hide the modal when the done button is clicked", () => {
    const wrapper = shallow(<GroupValidations {...props} />);
    wrapper.find(TotalButton).simulate("click");
    wrapper.find(Button).simulate("click");
    expect(wrapper.find(GroupValidationModal).props()).toMatchObject({
      isOpen: false,
    });
  });

  it("should hide the modal when the modal closes", () => {
    const wrapper = shallow(<GroupValidations {...props} />);
    wrapper.find(TotalButton).simulate("click");
    wrapper.find(GroupValidationModal).simulate("close");
    expect(wrapper.find(GroupValidationModal).props()).toMatchObject({
      isOpen: false,
    });
  });

  it("should display validation error when present ", () => {
    const wrapper = mount(<GroupValidations {...props} />).find(
      "ValidationError"
    );

    expect(wrapper.text().includes(ERR_NO_VALUE)).toBeTruthy();
  });
});
