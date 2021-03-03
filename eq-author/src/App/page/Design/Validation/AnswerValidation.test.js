import React from "react";
import { shallow } from "enzyme";
import { render as rtlRender } from "tests/utils/rtl";

import {
  NUMBER,
  CURRENCY,
  PERCENTAGE,
  UNIT,
  DATE,
  DATE_RANGE,
} from "constants/answer-types";
import { CENTIMETRES } from "constants/unit-types";

import SidebarButton, { Detail } from "components/buttons/SidebarButton";
import ModalWithNav from "components/modals/ModalWithNav";
import AnswerValidation, {
  validationTypes,
  SidebarValidation,
} from "./AnswerValidation";
import {
  MIN_INCLUSIVE_TEXT,
  MAX_INCLUSIVE_TEXT,
  DURATION_ERROR_MESSAGE,
  MAX_GREATER_THAN_MIN,
  EARLIEST_BEFORE_LATEST_DATE,
  ERR_NO_VALUE,
} from "constants/validationMessages";

const render = (props, render = shallow) => {
  return render(<AnswerValidation {...props} />);
};

describe("AnswerValidation", () => {
  let props;

  beforeEach(() => {
    props = {
      answer: {
        id: "1",
        type: NUMBER,
        validation: {
          minValue: {
            enabled: false,
            validationErrorInfo: { errors: [] },
          },
          maxValue: {
            enabled: false,
            validationErrorInfo: { errors: [] },
          },
        },
      },
    };
  });

  it("should render", () => {
    expect(render(props)).toMatchSnapshot();
  });

  it("should not render when there are no valid validation types", () => {
    props.answer.type = "Radio";
    expect(render(props)).toMatchSnapshot();
  });

  it("should initialise with modal box closed", () => {
    const wrapper = render(props);
    const modal = wrapper.find(ModalWithNav);
    expect(modal.prop("isOpen")).toEqual(false);
  });

  it("should correctly update state when opening a Modal", () => {
    const wrapper = render(props);
    wrapper.find(SidebarValidation).first().simulate("click");

    setTimeout(() => {
      const modal = wrapper.find(ModalWithNav);
      expect(modal.prop("isOpen")).toBe(true);
    }, 1000);
  });

  it("should correctly update state when closing a Modal", () => {
    const wrapper = render(props);
    wrapper.find(ModalWithNav).simulate("close");
    const modal = wrapper.find(ModalWithNav);
    expect(modal.prop("isOpen")).toBe(false);
  });

  describe("validation object array", () => {
    validationTypes.forEach((validationType) => {
      it(`should render the ${validationType.title} validation`, () => {
        const wrapper = shallow(validationType.render());

        expect(wrapper).toMatchSnapshot();
      });
    });
  });

  describe("Numeric answer validation preview", () => {
    const NUMBER_TYPES = [PERCENTAGE, NUMBER, CURRENCY, UNIT];
    const VALIDATIONS = ["maxValue", "minValue"];
    VALIDATIONS.forEach((validation) => {
      describe(validation, () => {
        it("should render custom values", () => {
          const wrapper = (type) => {
            const properties = {};
            if (type === UNIT) {
              properties.unit = CENTIMETRES;
            }
            return render({
              ...props,
              answer: {
                id: "1",
                type: type,
                properties,
                validation: {
                  [validation]: {
                    enabled: true,
                    custom: 5,
                    entityType: "Custom",
                  },
                },
              },
            });
          };

          NUMBER_TYPES.forEach((type) => {
            expect(
              wrapper(type).find(SidebarButton).find(Detail)
            ).toMatchSnapshot();
          });
        });

        it("should not render when the custom value is null", () => {
          const wrapper = (type) =>
            render({
              ...props,
              answer: {
                id: "1",
                type: type,
                validation: {
                  [validation]: {
                    enabled: true,
                    custom: null,
                    entityType: "Custom",
                  },
                },
              },
            });

          NUMBER_TYPES.forEach((type) => {
            expect(
              wrapper(type).find(SidebarButton).find(Detail)
            ).toMatchSnapshot();
          });
        });

        it("should render previous answer", () => {
          const wrapper = (type) =>
            render({
              ...props,
              answer: {
                id: "1",
                type: type,
                validation: {
                  [validation]: {
                    enabled: true,
                    previousAnswer: {
                      displayName: "foobar",
                    },
                  },
                },
              },
            });

          NUMBER_TYPES.forEach((type) => {
            expect(
              wrapper(type).find(SidebarButton).find(Detail)
            ).toMatchSnapshot();
          });
        });

        it("should render with additional inclusive text when appropriate on all number types", () => {
          props = {
            ...props,
            answer: {
              id: "1",
              validation: {
                [validation]: {
                  enabled: true,
                  inclusive: false,
                  previousAnswer: {
                    displayName: "foobar",
                  },
                },
              },
            },
          };

          NUMBER_TYPES.forEach((type) => {
            props.answer.type = type;

            const { getAllByText } = rtlRender(<AnswerValidation {...props} />);

            if (validation === VALIDATIONS[0]) {
              expect(
                getAllByText(`Max value ${MAX_INCLUSIVE_TEXT}`)
              ).toBeTruthy();
            }

            if (validation === VALIDATIONS[1]) {
              expect(
                getAllByText(`Min value ${MIN_INCLUSIVE_TEXT}`)
              ).toBeTruthy();
            }
          });
        });

        it("should display when unit type is null", () => {
          const wrapper = () => {
            const properties = {};
            properties.unit = null;
            return render({
              ...props,
              answer: {
                id: "1",
                type: UNIT,
                properties,
                validation: {
                  [validation]: {
                    enabled: true,
                    custom: 5,
                    entityType: "Custom",
                  },
                },
              },
            });
          };

          expect(
            wrapper(UNIT).find(SidebarButton).find(Detail)
          ).toMatchSnapshot();
        });
      });
    });
  });

  it("should render an error message when numeric input is null", () => {
    const error = [
      {
        errorCode: "ERR_NO_VALUE",
        field: "custom",
        id: "maxValue-0183a9c0-b79f-4766-ba7a-3c3718bb9f26-custom",
        type: "validation",
        __typename: "ValidationError",
      },
    ];
    props.answer.validation.maxValue.validationErrorInfo.errors = error;

    const { getAllByText } = rtlRender(<AnswerValidation {...props} />);

    expect(getAllByText(ERR_NO_VALUE)).toBeTruthy();
  });

  it("should render an error message when min val > max Val", () => {
    const error = [
      {
        errorCode: "ERR_MIN_LARGER_THAN_MAX",
        field: "custom",
        id: "maxValue-0183a9c0-b79f-4766-ba7a-3c3718bb9f26-custom",
        type: "validation",
        __typename: "ValidationError",
      },
    ];
    props.answer.validation.maxValue.validationErrorInfo.errors = error;

    const { getByText } = rtlRender(<AnswerValidation {...props} />);

    expect(getByText(MAX_GREATER_THAN_MIN)).toBeTruthy();
  });

  describe("Date validation preview", () => {
    it("Date Validation - should render an error message when earliest date is after latest date", () => {
      props = {
        answer: {
          id: "2",
          type: DATE,
          validation: {
            earliestDate: {
              enabled: false,
              validationErrorInfo: { errors: [] },
            },
            latestDate: {
              enabled: false,
              validationErrorInfo: { errors: [] },
            },
          },
        },
      };
      const error = [
        {
          errorCode: "ERR_EARLIEST_AFTER_LATEST",
          field: "custom",
          id: "latestDate-2-b79f-4766-ba7a-3c3718bb9f26-custom",
          type: "validation",
          __typename: "ValidationError",
        },
      ];
      props.answer.validation.latestDate.validationErrorInfo.errors = error;

      const { getByText } = rtlRender(<AnswerValidation {...props} />);

      expect(getByText(EARLIEST_BEFORE_LATEST_DATE)).toBeTruthy();
    });

    it("Date Validation - should display validation message when error present", () => {
      props = {
        answer: {
          id: "2",
          type: DATE,
          validation: {
            earliestDate: {
              enabled: false,
              validationErrorInfo: { errors: [] },
            },
            latestDate: {
              enabled: false,
              validationErrorInfo: { errors: [] },
            },
          },
        },
      };
      const error = [
        {
          errorCode: "ERR_NO_VALUE",
          field: "custom",
          id: "latestDate-2-b79f-4766-ba7a-3c3718bb9f26-custom",
          type: "validation",
          __typename: "ValidationError",
        },
      ];
      props.answer.validation.latestDate.validationErrorInfo.errors = error;
      const { getAllByText } = rtlRender(<AnswerValidation {...props} />);

      expect(getAllByText(ERR_NO_VALUE)).toBeTruthy();
    });

    it("DateRange validation - should render an error message when earliest date is after latest date", () => {
      props = {
        answer: {
          id: "2",
          type: DATE_RANGE,

          validation: {
            earliestDate: {
              enabled: true,
              relativePosition: "Before",
              offset: { unit: "Days", value: 2 },
              validationErrorInfo: { errors: [] },
            },
            latestDate: {
              enabled: true,
              relativePosition: "Before",
              offset: { unit: "Days", value: 2 },
              validationErrorInfo: { errors: [] },
            },
          },
        },
      };
      const error = [
        {
          errorCode: "ERR_EARLIEST_AFTER_LATEST",
          field: "custom",
          id: "latestDate-2-b79f-4766-ba7a-3c3718bb9f26-custom",
          type: "validation",
          __typename: "ValidationError",
        },
      ];
      props.answer.validation.latestDate.validationErrorInfo.errors = error;

      const { getByText } = rtlRender(<AnswerValidation {...props} />);

      expect(getByText(EARLIEST_BEFORE_LATEST_DATE)).toBeTruthy();
    });

    it("DateRange validation - should render an error message when min duration is larger than max duration", () => {
      props = {
        answer: {
          id: "2",
          type: DATE_RANGE,

          validation: {
            minDuration: {
              enabled: true,
              duration: { unit: "Days", value: 2 },
              validationErrorInfo: { errors: [] },
            },
            maxDuration: {
              enabled: true,
              duration: { unit: "Days", value: 2 },
              validationErrorInfo: { errors: [] },
            },
          },
        },
      };
      const error = [
        {
          errorCode: "ERR_MAX_DURATION_TOO_SMALL",
          field: "duration",
          id: "maxDuration-ef710be2-a0bb-44ee-924f-36d5b0e82a3e-duration",
          type: "validation",
          __typename: "ValidationError",
        },
      ];
      props.answer.validation.minDuration.validationErrorInfo.errors = error;
      props.answer.validation.maxDuration.validationErrorInfo.errors = error;

      const { getByText } = rtlRender(<AnswerValidation {...props} />);

      expect(getByText(DURATION_ERROR_MESSAGE)).toBeTruthy();
    });
  });
});
