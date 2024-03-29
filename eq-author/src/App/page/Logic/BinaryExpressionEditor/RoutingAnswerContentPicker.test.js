import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { render } from "tests/utils/rtl";

import { DATE_RANGE, NUMBER, UNIT, DURATION } from "constants/answer-types";
import { TEXT, TEXT_OPTIONAL } from "constants/metadata-types";

import RoutingAnswerContentPicker, {
  preprocessAnswers,
  preprocessMetadata,
} from "./RoutingAnswerContentPicker";

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

  describe("preprocessAnswers", () => {
    it("should remove answers which aren't valid for routing", () => {
      const answers = [
        { type: DATE_RANGE },
        { type: NUMBER },
        { type: UNIT },
        { type: DURATION },
      ];
      const processedAnswers = answers.map(preprocessAnswers);

      expect(
        processedAnswers.find(({ type }) => type === DURATION)
      ).toBeFalsy();
      expect(
        processedAnswers.find(({ type }) => type === DATE_RANGE)
      ).toBeFalsy();
    });

    it("should fetch metadata which are valid for routing", () => {
      const metadata = [{ type: TEXT.value }, { type: TEXT_OPTIONAL.value }];
      const processedMetadata = metadata.map(preprocessMetadata);
      expect(
        processedMetadata.find(({ type }) => type === TEXT.value)
      ).toBeTruthy();
      expect(
        processedMetadata.find(({ type }) => type === TEXT_OPTIONAL.value)
      ).toBeTruthy();
    });
  });
});
