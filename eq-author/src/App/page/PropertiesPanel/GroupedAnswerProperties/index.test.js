import React from "react";
import { shallow } from "enzyme";

import { CURRENCY, DATE, DURATION, TEXTAREA } from "constants/answer-types";
import { YEARSMONTHS, YEARS } from "constants/duration-types";
import { screen, render, fireEvent, waitFor } from "tests/utils/rtl";

import DurationProperties from "./AnswerProperties/Properties/DurationProperties";

import Accordion from "components/Accordion";
import GroupValidations from "App/page/Design/Validation/GroupValidations";
import VALIDATIONS_SUBSCRIPTION from "graphql/validationsSubscription.graphql";
import { characterErrors } from "constants/validationMessages";

import { useMutation } from "@apollo/react-hooks";
import { GroupedAnswerProperties } from "./";

jest.mock("@apollo/react-hooks", () => ({
  ...jest.requireActual(),
  useMutation: jest.fn(),
}));

useMutation.mockImplementation(jest.fn(() => [jest.fn()]));

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
        validationErrorInfo: {
          id: "1",
          errors: [],
          totalCount: 0,
        },
      },
      updateAnswersOfType: jest.fn(),
    };
  });

  it("should render the answers grouped by type", () => {
    const wrapper = shallow(<GroupedAnswerProperties {...props} />);
    const accordions = wrapper.find(Accordion);
    expect(accordions).toHaveLength(2);
    expect(accordions.at(0).prop("title")).toEqual("Currency properties");
    expect(accordions.at(1).prop("title")).toEqual("Date properties");
  });

  it("should show one copy of the shared property decimal", () => {
    const wrapper = shallow(<GroupedAnswerProperties {...props} />);
    expect(wrapper.find("[data-test='decimals']")).toHaveLength(1);
  });

  it("should render the options for each answer", () => {
    const wrapper = shallow(<GroupedAnswerProperties {...props} />);
    const accordions = wrapper.find(Accordion);
    expect(
      accordions.at(0).find("[data-test='answer-title']").at(0)
    ).toMatchSnapshot();
    expect(
      accordions.at(0).find("[data-test='answer-title']").at(1)
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

    const wrapper = shallow(<GroupedAnswerProperties {...props} />);

    expect(wrapper.find(GroupValidations)).toHaveLength(1);
    expect(wrapper.find(GroupValidations).props()).toMatchObject({
      type: CURRENCY,
      totalValidation: props.page.totalValidation,
    });
  });

  it("should show error if there is a mismatch in the decimals and previous answer validation", () => {
    const [one] = props.page.answers;
    one.validationErrorInfo = {
      errors: [{ errorCode: "ERR_REFERENCED_ANSWER_DECIMAL_INCONSISTENCY" }],
    };
    props.page.answers[0] = one;
    const wrapper = shallow(<GroupedAnswerProperties {...props} />);
    expect(wrapper).toMatchSnapshot();
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
          query: VALIDATIONS_SUBSCRIPTION,
          variables: { id: "1" },
        },
        result() {
          return mockedData;
        },
      },
    ];
    const updateAnswersOfType = jest.fn();
    useMutation.mockImplementation(() => [updateAnswersOfType]);

    render(<GroupedAnswerProperties {...props} />, {
      route: "/q/1/page/2",
      urlParamMatcher: "/q/:questionnaireId/page/:pageId",
      mocks,
    });

    fireEvent.change(screen.getByTestId("number-input"), {
      target: { value: "2" },
    });

    fireEvent.blur(screen.getByTestId("number-input"));

    await waitFor(() =>
      expect(updateAnswersOfType).toHaveBeenCalledWith({
        variables: {
          input: {
            properties: { decimals: 2 },
            questionPageId: "pageId",
            type: "Currency",
          },
        },
      })
    );
  });

  describe("Unit answers", () => {
    let unitProps;
    beforeEach(() => {
      unitProps = {
        page: {
          id: "pageId",
          answers: [
            {
              id: "1",
              type: "Unit",
              displayName: "units label",
              properties: {
                decimals: 0,
                unit: "",
                required: false,
              },

              __typename: "BasicAnswer",
            },
          ],
          validationErrorInfo: {
            id: "24cab791-fab6-4c62-934e-52333d3e39b4",
            errors: [
              {
                id: "8281c855-8dd8-4194-8a80-673be471550b",
                type: "answer",
                field: "unit",
                errorCode: "ERR_VALID_REQUIRED",
                __typename: "ValidationError",
              },
            ],
            totalCount: 1,
            __typename: "ValidationErrorInfo",
          },
        },
        updateAnswersOfType: jest.fn(),
      };
    });

    it("should show error message if there is no unit type selected", () => {
      const { getByTestId } = render(
        <GroupedAnswerProperties {...unitProps} />,
        {
          route: "/q/1/page/0",
          urlParamMatcher: "/q/:questionnaireId/page/:pageId",
        }
      );

      const errMsg = getByTestId("unitRequired");
      expect(errMsg).toBeTruthy();
    });

    it("should save the unit type when an empty string", () => {
      const updateAnswersOfType = jest.fn();
      useMutation.mockImplementation(() => [updateAnswersOfType]);
      unitProps.page.answers[0].properties.unit = "Acres";
      const inputId = "autocomplete-input";
      render(<GroupedAnswerProperties {...unitProps} />, {
        route: "/q/1/page/0",
        urlParamMatcher: "/q/:questionnaireId/page/:pageId",
      });

      screen.getByTestId(inputId).focus();

      fireEvent.change(screen.getByTestId(inputId), {
        target: { value: "" },
      });

      screen.getByTestId(inputId).blur();

      expect(updateAnswersOfType).toHaveBeenCalledTimes(1);
      expect(updateAnswersOfType).toHaveBeenLastCalledWith({
        variables: {
          input: {
            properties: {
              unit: "",
            },
            questionPageId: "pageId",
            type: "Unit",
          },
        },
      });
    });

    it("should save the unit type", () => {
      const updateAnswersOfType = jest.fn();
      useMutation.mockImplementation(() => [updateAnswersOfType]);
      const inputId = "autocomplete-input";
      render(<GroupedAnswerProperties {...unitProps} />, {
        route: "/q/1/page/0",
        urlParamMatcher: "/q/:questionnaireId/page/:pageId",
      });

      screen.getByTestId(inputId).focus();

      fireEvent.change(screen.getByTestId(inputId), {
        target: { value: "cent" },
      });

      fireEvent.click(screen.getByTestId("autocomplete-option-1"));

      expect(updateAnswersOfType).toHaveBeenCalledTimes(1);
      expect(updateAnswersOfType).toHaveBeenLastCalledWith({
        variables: {
          input: {
            properties: {
              unit: "Square centimetres",
            },
            questionPageId: "pageId",
            type: "Unit",
          },
        },
      });
    });

    it("should have a default value", () => {
      const inputId = "autocomplete-input";
      render(<GroupedAnswerProperties {...unitProps} />, {
        route: "/q/1/page/0",
        urlParamMatcher: "/q/:questionnaireId/page/:pageId",
      });

      expect(screen.getByTestId(inputId).value).toEqual("");
    });

    it("should have a set initial value", () => {
      unitProps.page.answers[0].properties.unit = "Acres";
      const inputId = "autocomplete-input";
      render(<GroupedAnswerProperties {...unitProps} />, {
        route: "/q/1/page/0",
        urlParamMatcher: "/q/:questionnaireId/page/:pageId",
      });

      expect(screen.getByTestId(inputId).value).toEqual("Acres (ac)");
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
      const wrapper = shallow(<GroupedAnswerProperties {...props} />);
      expect(wrapper.find(DurationProperties)).toHaveLength(1);
    });

    it("should update all the duration answers when their unit is changed", () => {
      const updateAnswersOfType = jest.fn();
      useMutation.mockImplementation(() => [updateAnswersOfType]);
      const wrapper = shallow(<GroupedAnswerProperties {...props} />);
      const durationPropertiesElement = wrapper.find(DurationProperties).dive();
      durationPropertiesElement
        .find("[data-test='duration-select']")
        .simulate("change", { value: YEARS });
      expect(updateAnswersOfType).toHaveBeenCalledWith({
        variables: {
          input: {
            properties: {
              unit: "Years",
            },
            questionPageId: "pageId",
            type: "Duration",
          },
        },
      });
    });
  });

  describe("Text answers", () => {
    const ERR_MAX_LENGTH_TOO_LARGE = "ERR_MAX_LENGTH_TOO_LARGE";
    const ERR_MAX_LENGTH_TOO_SMALL = "ERR_MAX_LENGTH_TOO_SMALL";
    const newProps = ({ maxLength, errorCode }) => ({
      page: {
        id: "pageId",
        answers: [
          {
            id: "1",
            type: TEXTAREA,
            displayName: "qq",
            properties: {
              maxLength,
              required: false,
            },
            validationErrorInfo: {
              id: "1",
              errors: [
                {
                  errorCode,
                  field: "properties",
                  id: "answers-50903a1b-a33b-44c1-b135-3bb8626f81b3-properties",
                  type: "answers",
                  __typename: "ValidationError",
                },
              ],
              totalCount: 1,
            },
            __typename: "BasicAnswer",
          },
        ],
      },
      updateAnswersOfType: jest.fn(),
    });

    it("should render 'Enter a character less than x' error on textarea answers", () => {
      render(
        <GroupedAnswerProperties
          {...newProps({ maxLength: 8, errorCode: ERR_MAX_LENGTH_TOO_SMALL })}
        />,
        {
          route: "/q/1/page/2",
          urlParamMatcher: "/q/:questionnaireId/page/:pageId",
        }
      );

      expect(screen.getByTestId("MaxCharacterTooSmall")).toBeVisible();
      expect(screen.getByTestId("MaxCharacterTooSmall").textContent).toBe(
        "Error:" + String.fromCharCode(160) + characterErrors.CHAR_MUST_EXCEED_9
      );
    });

    it("should render 'Enter a character more than x' error on textarea answers", () => {
      render(
        <GroupedAnswerProperties
          {...newProps({
            maxLength: 2001,
            errorCode: ERR_MAX_LENGTH_TOO_LARGE,
          })}
        />,
        {
          route: "/q/1/page/2",
          urlParamMatcher: "/q/:questionnaireId/page/:pageId",
        }
      );

      expect(screen.getByTestId("MaxCharacterTooBig")).toBeVisible();
      expect(screen.getByTestId("MaxCharacterTooBig").textContent).toBe(
        "Error:" +
          String.fromCharCode(160) +
          characterErrors.CHAR_LIMIT_2000_EXCEEDED
      );
    });

    it("should not render an error message if errorCode isn't related to length", () => {
      render(
        <GroupedAnswerProperties
          {...newProps({
            maxLength: 2001,
            errorCode: "ERR_MAX_LENGTH_SUPER_LARGE",
          })}
        />,
        {
          route: "/q/1/page/2",
          urlParamMatcher: "/q/:questionnaireId/page/:pageId",
        }
      );

      expect(
        screen.queryByTestId("MaxCharacterTooBig")
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId("MaxCharacterTooSmall")
      ).not.toBeInTheDocument();
    });
  });
});
