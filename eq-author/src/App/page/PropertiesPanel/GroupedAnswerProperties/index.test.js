import React from "react";
import { shallow } from "enzyme";

import { CURRENCY, DATE, UNIT, DURATION } from "constants/answer-types";
import { KILOJOULES, CENTIMETRES } from "constants/unit-types";
import { YEARSMONTHS, YEARS } from "constants/duration-types";

import UnitProperties from "./AnswerProperties/Properties/UnitProperties";
import DurationProperties from "./AnswerProperties/Properties/DurationProperties";

import Accordion from "components/Accordion";
import GroupValidations from "App/page/Design/Validation/GroupValidations";

import { UnwrappedGroupedAnswerProperties } from "./";

describe("Grouped Answer Properties", () => {
  let props;
  beforeEach(() => {
    props = {
      page: {
        id: "pageId",
        answers: [
          {
            id: "1",
            type: CURRENCY,
            displayName: "Currency 1",
            properties: {
              decimals: 5,
            },
          },
          {
            id: "2",
            type: DATE,
            displayName: "Date 1",
            properties: {},
          },
          {
            id: "3",
            type: CURRENCY,
            displayName: "Currency 2",
            properties: {
              decimals: 2,
            },
          },
        ],
      },
      updateAnswersOfType: jest.fn(),
    };
  });

  it("should render the answers grouped by type", () => {
    const wrapper = shallow(<UnwrappedGroupedAnswerProperties {...props} />);
    const accordions = wrapper.find(Accordion);
    expect(accordions).toHaveLength(2);
    expect(accordions.at(0).prop("title")).toEqual("CURRENCY PROPERTIES");
    expect(accordions.at(1).prop("title")).toEqual("DATE PROPERTIES");
  });

  it("should show one copy of the shared property decimal", () => {
    const wrapper = shallow(<UnwrappedGroupedAnswerProperties {...props} />);
    expect(wrapper.find("[data-test='decimals']")).toHaveLength(1);
  });

  it("should render the options for each answer", () => {
    const wrapper = shallow(<UnwrappedGroupedAnswerProperties {...props} />);
    const accordions = wrapper.find(Accordion);
    expect(
      accordions
        .at(0)
        .find("[data-test='answer-title']")
        .at(0)
    ).toMatchSnapshot();
    expect(
      accordions
        .at(0)
        .find("[data-test='answer-title']")
        .at(1)
    ).toMatchSnapshot();

    expect(
      accordions.at(1).find("[data-test='answer-title']")
    ).toMatchSnapshot();
  });

  it("should update all the answers of the type when their decimals are changed", () => {
    const wrapper = shallow(<UnwrappedGroupedAnswerProperties {...props} />);
    wrapper
      .find("[data-test='decimals']")
      .dive() // Not sure why we need to do this
      .simulate("change", { value: 5 });
    expect(props.updateAnswersOfType).toHaveBeenCalledWith(CURRENCY, "pageId", {
      decimals: 5,
    });
  });

  it("should render the group validations with type and validations", () => {
    props.page.totalValidation = {
      id: 1,
      entityType: "Custom",
      custom: 5,
      previousAnswer: null,
      condition: "Equal",
    };

    const wrapper = shallow(<UnwrappedGroupedAnswerProperties {...props} />);

    expect(wrapper.find(GroupValidations)).toHaveLength(1);
    expect(wrapper.find(GroupValidations).props()).toMatchObject({
      type: CURRENCY,
      totalValidation: props.page.totalValidation,
    });
  });

  describe("Unit answers", () => {
    beforeEach(() => {
      props = {
        page: {
          id: "pageId",
          answers: [
            {
              id: "1",
              type: UNIT,
              displayName: "Currency 1",
              properties: {
                unit: KILOJOULES,
                decimals: 2,
              },
            },
            {
              id: "2",
              type: UNIT,
              displayName: "Currency 2",
              properties: {
                unit: KILOJOULES,
                decimals: 2,
              },
            },
          ],
        },
        updateAnswersOfType: jest.fn(),
      };
    });

    it("should show one copy of the shared unit properties", () => {
      const wrapper = shallow(<UnwrappedGroupedAnswerProperties {...props} />);
      expect(wrapper.find(UnitProperties)).toHaveLength(1);
    });

    it("should update all the unit answers when their unit is changed", () => {
      const wrapper = shallow(<UnwrappedGroupedAnswerProperties {...props} />);
      const unitPropertiesElement = wrapper.find(UnitProperties).dive();
      unitPropertiesElement
        .find("[data-test='unit-select']")
        .simulate("change", { value: CENTIMETRES });
      expect(props.updateAnswersOfType).toHaveBeenCalledWith(UNIT, "pageId", {
        unit: CENTIMETRES,
      });
    });
  });

  describe("Duration answers", () => {
    beforeEach(() => {
      props = {
        page: {
          id: "pageId",
          answers: [
            {
              id: "1",
              type: DURATION,
              displayName: "Duration 1",
              properties: {
                unit: YEARSMONTHS,
              },
            },
            {
              id: "2",
              type: DURATION,
              displayName: "Currency 2",
              properties: {
                unit: YEARSMONTHS,
              },
            },
          ],
        },
        updateAnswersOfType: jest.fn(),
      };
    });

    it("should show one copy of the shared duration properties", () => {
      const wrapper = shallow(<UnwrappedGroupedAnswerProperties {...props} />);
      expect(wrapper.find(DurationProperties)).toHaveLength(1);
    });

    it("should update all the duration answers when their unit is changed", () => {
      const wrapper = shallow(<UnwrappedGroupedAnswerProperties {...props} />);
      const durationPropertiesElement = wrapper.find(DurationProperties).dive();
      durationPropertiesElement
        .find("[data-test='duration-select']")
        .simulate("change", { value: YEARS });
      expect(props.updateAnswersOfType).toHaveBeenCalledWith(
        DURATION,
        "pageId",
        {
          unit: YEARS,
        }
      );
    });
  });
});
