import React from "react";
import { shallow } from "enzyme";

import { Detail } from "components/buttons/SidebarButton";

import AnswerValidation from "./AnswerValidation";

import {
  CUSTOM,
  PREVIOUS_ANSWER,
  NOW,
} from "constants/validation-entity-types";

const render = (props, render = shallow) => {
  return render(<AnswerValidation {...props} />);
};

describe("Date Error", () => {
  let props;

  beforeEach(() => {
    props = {
      answer: {
        id: "1",
        type: "Number",
        validation: {
          minValue: {
            enabled: false,
            __typename: "MinValue",
          },
          maxValue: {
            enabled: false,
            __typename: "MaxValue",
          },
        },
      },
      gotoTab: jest.fn(),
    };
  });

  describe("custom", () => {
    it("should render preview dates without offset", () => {
      const wrapper = render({
        ...props,
        answer: {
          id: "1",
          type: "Date",
          validation: {
            earliestDate: {
              enabled: true,
              customDate: "2018-09-02",
              offset: {
                unit: "Days",
                value: 0,
              },
              relativePosition: "Before",
              entityType: CUSTOM,
              __typename: "EarliestDate",
            },
            latestDate: {
              enabled: false,
              __typename: "LatestDate",
            },
          },
        },
      });
      expect(wrapper.find(Detail).at(0).prop("children")).toMatchSnapshot();
    });

    it("should render preview dates with offset", () => {
      const wrapper = render({
        ...props,
        answer: {
          id: "1",
          type: "Date",
          validation: {
            earliestDate: {
              enabled: true,
              customDate: "2018-09-02",
              offset: {
                unit: "Months",
                value: 5,
              },
              relativePosition: "Before",
              entityType: CUSTOM,
              __typename: "EarliestDate",
            },
            latestDate: {
              enabled: false,
              __typename: "LatestDate",
            },
          },
        },
      });
      expect(wrapper.find(Detail).at(0).prop("children")).toMatchSnapshot();
    });

    it("should not render a preview without a customDate", () => {
      const wrapper = render({
        ...props,
        answer: {
          id: "1",
          type: "Date",
          validation: {
            earliestDate: {
              enabled: true,
              customDate: null,
              offset: {
                unit: "Months",
                value: 5,
              },
              relativePosition: "Before",
              entityType: CUSTOM,
              __typename: "EarliestDate",
            },
            latestDate: {
              enabled: false,
              __typename: "LatestDate",
            },
          },
        },
      });
      expect(wrapper.find(Detail).exists()).toBeFalsy();
    });
  });

  it("should render a preview with previous answer", () => {
    const wrapper = render({
      ...props,
      answer: {
        id: "1",
        type: "Date",
        validation: {
          earliestDate: {
            enabled: true,
            customDate: null,
            previousAnswer: {
              id: "2",
              displayName: "foobar",
            },
            offset: {
              unit: "Months",
              value: 5,
            },
            relativePosition: "Before",
            entityType: PREVIOUS_ANSWER,
            __typename: "EarliestDate",
          },
          latestDate: {
            enabled: false,
            __typename: "LatestDate",
          },
        },
      },
    });
    expect(wrapper.find(Detail).at(0).prop("children")).toMatchSnapshot();
  });

  it("should render a preview startDate", () => {
    const wrapper = render({
      ...props,
      answer: {
        id: "1",
        type: "Date",
        validation: {
          earliestDate: {
            enabled: true,
            customDate: null,
            offset: {
              unit: "days",
              value: 12,
            },
            relativePosition: "Before",
            entityType: NOW,
            __typename: "EarliestDate",
          },
          latestDate: {
            enabled: false,
            __typename: "LatestDate",
          },
        },
      },
    });
    expect(wrapper.find(Detail).at(0).prop("children")).toMatchSnapshot();
  });
});
