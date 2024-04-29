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
} from "components/ContentPickerSelectv3/content-types";

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

const mockSupplementaryData = {
  surveyId: "221",
  data: [
    {
      schemaFields: [
        {
          identifier: "employer_paye",
          description:
            "The tax office employer reference. This will be between 1 and 10 characters, which can be letters and numbers.",
          type: "string",
          example: "AB456",
          selector: "reference",
          id: "c5f64732-3bb2-40ba-8b0d-fc3b7e22c834",
        },
      ],
      id: "f0d7091a-44be-4c88-9d78-a807aa7509ec",
      listName: "",
    },
    {
      schemaFields: [
        {
          identifier: "local-units",
          description: "Name of the local unit",
          type: "string",
          example: "STUBBS BUILDING PRODUCTS LTD",
          selector: "name",
          id: "673a30af-5197-4d2a-be0c-e5795a998491",
        },
        {
          identifier: "local-units",
          description: "The “trading as” name for the local unit",
          type: "string",
          example: "STUBBS PRODUCTS",
          selector: "trading_name",
          id: "af2ff1a6-fc5d-419f-9538-0d052a5e6728",
        },
      ],
      id: "6e901afa-473a-4704-8bbd-de054569379c",
      listName: "local-units",
    },
  ],
  sdsDateCreated: "2023-12-15T11:21:34Z",
  sdsGuid: "621c954b-5523-4eda-a3eb-f18bebd20b8d",
  sdsVersion: "1",
  id: "b6c84aee-ea11-41e6-8be8-5715b066d297",
};

const mockQuestionnaire = buildQuestionnaire({
  sectionCount: 1,
  folderCount: 1,
  pageCount: 2,
});
mockQuestionnaire.metadata = mockMetadata;
mockQuestionnaire.supplementaryData = mockSupplementaryData;
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

  const listCollectorRender = ({
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
        listId="123"
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

  it("should render as disabled when there is no answerData, metadataData, and supplementaryData", () => {
    const wrapper = render({
      questionnaire: {
        ...mockQuestionnaire,
        metadata: [],
        supplementaryData: [],
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

  it("should open the answer picker when clicked", () => {
    const wrapper = listCollectorRender();
    wrapper.find("[data-test='piping-button']").simulate("click");
    expect(wrapper.find("[data-test='picker']").prop("isOpen")).toBe(true);
    expect(wrapper.find("List Answer")).toBeTruthy();
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
