import React from "react";
import { shallow } from "enzyme";
import { byTestAttr } from "tests/utils/selectors";
import PipingMenu, {
  splitDateRangeAnswers,
} from "components/RichTextEditor/PipingMenu";

import {
  ANSWER,
  METADATA,
  VARIABLES,
} from "components/ContentPickerSelect/content-types";

import { DATE_RANGE, NUMBER } from "constants/answer-types";

import { buildQuestionnaire } from "tests/utils/createMockQuestionnaire";
import { useCurrentPageId } from "components/RouterContext";
import { useQuestionnaire } from "components/QuestionnaireContext";

jest.mock("components/RouterContext", () => ({
  useCurrentPageId: jest.fn(),
}));

jest.mock("components/QuestionnaireContext", () => ({
  useQuestionnaire: jest.fn(),
}));

const PIPING_BUTTON_VALUE = byTestAttr("piping-button");

const mockMetadata = [
  {
    id: "1",
    displayName: "Metadata",
  },
];

const mockQuestionnaire = buildQuestionnaire({
  sectionCount: 1,
  folderCount: 1,
  pageCount: 2,
});
mockQuestionnaire.metadata = mockMetadata;
mockQuestionnaire.sections[0].folders[0].pages[0].answers = [
  {
    id: "answer-1",
    type: "Number",
    displayName: "Answer 1",
    label: "Answer 1",
  },
];

describe("PipingMenu", () => {
  let handleItemChosen = jest.fn();

  const render = ({
    currentPageId = "1.1.2",
    questionnaire = mockQuestionnaire,
    ...props
  } = {}) => {
    useCurrentPageId.mockImplementation(() => currentPageId);
    useQuestionnaire.mockImplementation(() => ({ questionnaire }));

    return shallow(
      <PipingMenu
        onItemChosen={handleItemChosen}
        allowableTypes={[ANSWER, METADATA, VARIABLES]}
        canFocus
        {...props}
      />
    );
  };

  it("should render", () => {
    const wrapper = render();
    expect(wrapper).toMatchSnapshot();
  });

  it("should render as disabled when disabled", () => {
    const wrapper = render({
      disabled: true,
    });
    expect(wrapper.find(PIPING_BUTTON_VALUE).prop("disabled")).toBe(true);
  });

  it("should render as disabled when there is no answerData and metadataData", () => {
    const wrapper = render({
      questionnaire: {
        ...mockQuestionnaire,
        metadata: [],
      },
      currentPageId: "1.1.1",
    });
    expect(wrapper.find(PIPING_BUTTON_VALUE).prop("disabled")).toBe(true);
  });

  it("should open the picker when clicked", () => {
    const wrapper = render();
    wrapper.find("[data-test='piping-button']").simulate("click");
    expect(wrapper.find("[data-test='picker']").prop("isOpen")).toBe(true);
  });

  it("should open the metadata picker when clicked", () => {
    const wrapper = render();
    wrapper.find("[data-test='piping-button-metadata']").simulate("click");
    expect(wrapper.find("[data-test='picker']").prop("isOpen")).toBe(true);
  });

  it("should open the variable picker when clicked", () => {
    const wrapper = render();
    wrapper.find("[data-test='piping-button-variable']").simulate("click");
    expect(wrapper.find("[data-test='picker']").prop("isOpen")).toBe(true);
  });

  it("should call onItemChosen and close the picker when something is chosen", () => {
    const wrapper = render();
    wrapper.find("[data-test='piping-button']").simulate("click");
    wrapper.find("[data-test='picker']").simulate("submit", {
      id: 1,
      displayName: "item",
    });
    expect(handleItemChosen).toHaveBeenCalledWith({
      id: 1,
      displayName: "item",
    });
    expect(wrapper.find("[data-test='picker']").prop("isOpen")).toBe(false);
  });

  it("should close the picker on picker close event", () => {
    const wrapper = render();
    wrapper.find("[data-test='piping-button']").simulate("click");
    wrapper.find("[data-test='picker']").simulate("close");
    expect(wrapper.find("[data-test='picker']").prop("isOpen")).toBe(false);
  });

  describe("splitDateRangeAnswers", () => {
    it("should split date range answers into entries for to / from", () => {
      const answers = [
        { id: 0, type: DATE_RANGE, secondaryLabel: "my-fave-secondary-label" },
        { id: 1, type: NUMBER },
      ];

      const processedAnswers = answers.map(splitDateRangeAnswers);

      expect(processedAnswers[0]).toHaveLength(2);
      expect(processedAnswers[0]).toEqual([
        {
          id: "0from",
          type: DATE_RANGE,
          secondaryLabel: answers[0].secondaryLabel,
        },
        {
          id: "0to",
          type: DATE_RANGE,
          secondaryLabel: answers[0].secondaryLabel,
          displayName: answers[0].secondaryLabel,
        },
      ]);

      expect(processedAnswers[1]).toEqual(answers[1]);
    });
  });
});
