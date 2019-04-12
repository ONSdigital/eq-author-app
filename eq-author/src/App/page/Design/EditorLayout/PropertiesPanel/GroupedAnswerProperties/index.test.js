import React from "react";
import { shallow } from "enzyme";

import { CURRENCY, DATE } from "constants/answer-types";

import Accordion from "components/Accordion";

import { UnwrappedGroupedAnswerProperties } from "./";

describe("Grouped Answer Properties", () => {
  let page, updateAnswersOfType;
  beforeEach(() => {
    page = {
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
    };
    updateAnswersOfType = jest.fn();
  });

  it("should render the answers grouped by type", () => {
    const wrapper = shallow(
      <UnwrappedGroupedAnswerProperties
        page={page}
        updateAnswersOfType={updateAnswersOfType}
      />
    );
    const accordions = wrapper.find(Accordion);
    expect(accordions).toHaveLength(2);
    expect(accordions.at(0).prop("title")).toEqual("CURRENCY PROPERTIES");
    expect(accordions.at(1).prop("title")).toEqual("DATE PROPERTIES");
  });

  it("should show one copy of the shared property decimal", () => {
    const wrapper = shallow(
      <UnwrappedGroupedAnswerProperties
        page={page}
        updateAnswersOfType={updateAnswersOfType}
      />
    );
    expect(wrapper.find("[data-test='decimals']")).toHaveLength(1);
  });

  it("should render the options for each answer", () => {
    const wrapper = shallow(
      <UnwrappedGroupedAnswerProperties
        page={page}
        updateAnswersOfType={updateAnswersOfType}
      />
    );
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
    const wrapper = shallow(
      <UnwrappedGroupedAnswerProperties
        page={page}
        updateAnswersOfType={updateAnswersOfType}
      />
    );
    wrapper
      .find("[data-test='decimals']")
      .dive() // Not sure why we need to do this
      .simulate("change", { value: 5 });
    expect(updateAnswersOfType).toHaveBeenCalledWith(CURRENCY, "pageId", {
      decimals: 5,
    });
  });
});
