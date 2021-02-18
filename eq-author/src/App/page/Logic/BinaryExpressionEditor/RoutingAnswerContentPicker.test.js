import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { render } from "tests/utils/rtl";

import RoutingAnswerContentPicker from "./RoutingAnswerContentPicker";

const data = {
  availableAnswers: [
    {
      id: "answerid",
      displayName: "Answer",
      page: {
        id: "pageid",
        displayName: "Page",
        section: {
          id: "sectionid",
          displayName: "Section",
        },
      },
    },
  ],
};

jest.mock("@apollo/react-hooks", () => ({
  __esModule: true,
  useQuery: jest.fn(),
}));

useQuery.mockImplementation(() => ({
  data: data,
  loading: false,
}));

const defaultSetup = () => {
  const testName = "displayName";
  const utils = render(
    <RoutingAnswerContentPicker
      id="id"
      path="availableAnswers"
      data={data}
      selectedContentDisplayName={testName}
      onSubmit={jest.fn()}
    />
  );
  return { testName, ...utils };
};

describe("RoutingAnswerContentPicker", () => {
  it("should render", () => {
    const { getByText, testName } = defaultSetup();
    expect(getByText(testName)).toBeVisible();
  });
});
