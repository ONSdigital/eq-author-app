import React from "react";
import { shallow } from "enzyme";

import { CalculatedSummaryPageEditor } from "./";

describe("CalculatedSummaryPageEditor", () => {
  let mockHandlers, page;
  beforeEach(() => {
    mockHandlers = {
      fetchAnswers: jest.fn(),
      onChange: jest.fn(),
      onUpdate: jest.fn(),
      onChangeUpdate: jest.fn(),
      onUpdateCalculatedSummaryPage: jest.fn(),
    };
    page = {
      id: "1",
      title: "",
      alias: "",
      pageType: "CalculatedSummaryPage",
      position: 1,
      displayName: "Foo",
      totalTitle: "",
      section: { id: "1", displayName: "This Section" },
      summaryAnswers: [],
      availableSummaryAnswers: [],
    };
  });

  it("should render", () => {
    const wrapper = shallow(
      <CalculatedSummaryPageEditor {...mockHandlers} page={page} />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
