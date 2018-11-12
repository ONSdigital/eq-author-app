import React from "react";
import { shallow } from "enzyme";

import { Detail as SidebarButtonDetail } from "components/SidebarButton";

import { UnconnectedAnswerValidation } from "components/Validation/AnswerValidation";

import {
  CUSTOM,
  PREVIOUS_ANSWER,
  NOW
} from "constants/validation-entity-types";

const render = (props, render = shallow) => {
  return render(<UnconnectedAnswerValidation {...props} />);
};

describe("Date Preview", () => {
  let props;

  beforeEach(() => {
    props = {
      answer: {
        id: "1",
        type: "Number",
        validation: {
          minValue: {
            enabled: false
          },
          maxValue: {
            enabled: false
          }
        }
      },
      gotoTab: jest.fn()
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
                value: 0
              },
              relativePosition: "Before",
              entityType: CUSTOM
            },
            latestDate: {
              enabled: false
            }
          }
        }
      });
      expect(
        wrapper
          .find(SidebarButtonDetail)
          .at(0)
          .prop("children")
      ).toMatchSnapshot();
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
                value: 5
              },
              relativePosition: "Before",
              entityType: CUSTOM
            },
            latestDate: {
              enabled: false
            }
          }
        }
      });
      expect(
        wrapper
          .find(SidebarButtonDetail)
          .at(0)
          .prop("children")
      ).toMatchSnapshot();
    });

    it("should render a preview without a customDate", () => {
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
                value: 5
              },
              relativePosition: "Before",
              entityType: CUSTOM
            },
            latestDate: {
              enabled: false
            }
          }
        }
      });
      expect(
        wrapper
          .find(SidebarButtonDetail)
          .at(0)
          .prop("children")
      ).toMatchSnapshot();
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
              displayName: "foobar"
            },
            offset: {
              unit: "Months",
              value: 5
            },
            relativePosition: "Before",
            entityType: PREVIOUS_ANSWER
          },
          latestDate: {
            enabled: false
          }
        }
      }
    });
    expect(
      wrapper
        .find(SidebarButtonDetail)
        .at(0)
        .prop("children")
    ).toMatchSnapshot();
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
              value: 12
            },
            relativePosition: "Before",
            entityType: NOW
          },
          latestDate: {
            enabled: false
          }
        }
      }
    });
    expect(
      wrapper
        .find(SidebarButtonDetail)
        .at(0)
        .prop("children")
    ).toMatchSnapshot();
  });
});
