import React from "react";
import { shallow } from "enzyme";

import { CURRENCY, DATE, UNIT, DURATION } from "constants/answer-types";
import { KILOJOULES, CENTIMETRES } from "constants/unit-types";
import { YEARSMONTHS, YEARS } from "constants/duration-types";
import { flushPromises, render, fireEvent } from "tests/utils/rtl";
import actSilenceWarning from "tests/utils/actSilenceWarning";

import UnitProperties from "./AnswerProperties/Properties/UnitProperties";
import DurationProperties from "./AnswerProperties/Properties/DurationProperties";

import Accordion from "components/Accordion";
import GroupValidations from "App/page/Design/Validation/GroupValidations";
import { VALIDATION_QUERY } from "App/page/Design/Validation/AnswerValidation";

import { UnwrappedGroupedAnswerProperties } from "./";

describe("Grouped Answer Properties", () => {
  let props;
  actSilenceWarning();
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
              required: false,
            },
            __typename: "BasicAnswer",
          },
          {
            id: "2",
            type: DATE,
            displayName: "Date 1",
            properties: { decimals: 0, required: false, format: "dd/mm/yyyy" },
            __typename: "BasicAnswer",
          },
          {
            id: "3",
            type: CURRENCY,
            displayName: "Currency 2",
            properties: {
              decimals: 2,
              required: false,
            },
            __typename: "BasicAnswer",
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

  it("should update all the answers of the type when their decimals are changed", async () => {
    const mockedData = {
      data: {
        validationUpdated: {
          id: "76d2d601-7f57-4f78-bb33-3bf70e8c1851",
          totalErrorCount: 2,
          sections: [
            {
              pages: [
                {
                  id: "233b525e-7ded-45af-882d-2cb4fd19cad8",
                  validationErrorInfo: {
                    id: "233b525e-7ded-45af-882d-2cb4fd19cad8",
                    totalCount: 2,
                    __typename: "ValidationErrorInfo",
                  },
                  answers: [
                    {
                      id: "53a6aa07-512a-4a6d-816d-dd6d99c79517",
                      validation: {
                        minValue: {
                          id: "166c9cc5-0974-4e66-8e2f-45f767d79713",
                          validationErrorInfo: {
                            id: "166c9cc5-0974-4e66-8e2f-45f767d79713",
                            errors: [],
                            totalCount: 0,
                            __typename: "ValidationErrorInfo",
                          },
                          __typename: "MinValueValidationRule",
                        },
                        maxValue: {
                          id: "134fa28d-520b-4247-bda3-58c63260672f",
                          validationErrorInfo: {
                            id: "134fa28d-520b-4247-bda3-58c63260672f",
                            errors: [],
                            totalCount: 0,
                            __typename: "ValidationErrorInfo",
                          },
                          __typename: "MaxValueValidationRule",
                        },
                        __typename: "NumberValidation",
                      },
                      __typename: "BasicAnswer",
                    },
                  ],
                  __typename: "QuestionPage",
                },
              ],
              __typename: "Section",
            },
          ],
          __typename: "Questionnaire",
        },
      },
      loading: false,
      variables: { id: "76d2d601-7f57-4f78-bb33-3bf70e8c1851" },
    };
    const mocks = [
      {
        request: {
          query: VALIDATION_QUERY,
          variables: { id: "1" },
        },
        result() {
          return mockedData;
        },
      },
      {
        request: {
          query: VALIDATION_QUERY,
          variables: { id: "1" },
        },
        result() {
          return mockedData;
        },
      },
      {
        request: {
          query: VALIDATION_QUERY,
          variables: { id: "1" },
        },
        result() {
          return mockedData;
        },
      },
    ];
    const { getByTestId } = render(
      <UnwrappedGroupedAnswerProperties {...props} />,
      {
        route: "/q/1/page/2",
        urlParamMatcher: "/q/:questionnaireId/page/:pageId",
        mocks,
      }
    );
    fireEvent.change(getByTestId("number-input"), {
      target: { value: "2" },
    });
    fireEvent.blur(getByTestId("number-input"));
    await flushPromises();
    expect(props.updateAnswersOfType).toHaveBeenCalledWith(CURRENCY, "pageId", {
      decimals: 2,
    });
  });

  it("should show error if there is a mismatch in the decimals and previous answer validation", () => {
    props.page.answers[0] = {
      validationErrorInfo: {
        errors: [{ errorCode: "ERR_REFERENCED_ANSWER_DECIMAL_INCONSISTENCY" }],
      },
    };
    const wrapper = shallow(<UnwrappedGroupedAnswerProperties {...props} />);
    expect(wrapper).toMatchSnapshot();
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
