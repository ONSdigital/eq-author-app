import React from "react";
import { render, fireEvent } from "tests/utils/rtl";
import {
  ANSWER,
  METADATA,
  VARIABLES,
  DESTINATION,
} from "components/ContentPickerSelect/content-types";

import ContentPicker from "./";

import { EndOfQuestionnaire, NextPage } from "constants/destinations";
import { destinationKey } from "constants/destinationKey";

import { useQuestionnaire } from "components/QuestionnaireContext";

jest.mock("components/QuestionnaireContext", () => ({
  useQuestionnaire: jest.fn(),
}));

describe("Content picker", () => {
  let data, onClose, onSubmit, startingSelectedAnswers, questionnaire, props;

  beforeEach(() => {
    onClose = jest.fn();
    onSubmit = jest.fn();
    startingSelectedAnswers = [];
    questionnaire = { hub: false };
    data = [
      {
        id: "section 1",
        displayName: "Untitled Section",
        folders: [
          {
            id: "folders 1",
            pages: [
              {
                id: "Page 1",
                displayName: "Page 1",
                answers: [
                  {
                    id: "Percentage 1",
                    displayName: "Percentage 1",
                    type: "Percentage",
                  },
                  {
                    id: "Number 1",
                    displayName: "Number 1",
                    type: "Number",
                  },
                  {
                    id: "Currency 1",
                    displayName: "Currency 1",
                    type: "Currency",
                  },
                ],
              },
              {
                id: "Page 2",
                displayName: "Page 2",
                answers: [
                  {
                    id: "Percentage 2",
                    displayName: "Percentage 2",
                    type: "Percentage",
                  },
                  {
                    id: "Currency 2",
                    displayName: "Currency 2",
                    type: "Currency",
                  },
                  {
                    id: "Number 2",
                    displayName: "Number 2",
                    type: "Number",
                  },
                ],
              },
            ],
          },
        ],
      },
    ];

    useQuestionnaire.mockImplementation(() => ({ questionnaire }));

    props = { data, onClose, onSubmit, startingSelectedAnswers };
  });

  const renderContentPicker = () => render(<ContentPicker {...props} isOpen />);

  it("should not render picker by default", () => {
    const { queryByTestId } = renderContentPicker();

    const modalHeader = queryByTestId("content-picker-empty");
    expect(modalHeader).toBeTruthy();
  });

  it("should call onClose prop when modal is cancelled", () => {
    const { getByText } = renderContentPicker();

    const cancelButton = getByText("Cancel");
    fireEvent.click(cancelButton);

    expect(onClose).toHaveBeenCalled();
  });

  describe("answer content", () => {
    beforeEach(() => {
      props = {
        ...props,
        contentType: ANSWER,
      };
    });

    it("should render answer picker when specified", () => {
      const { getByText } = renderContentPicker();

      const modalHeader = getByText("Select an answer");
      expect(modalHeader).toBeTruthy();
    });

    it("should call onSubmit with selected answers", () => {
      const { getByText } = renderContentPicker();

      const answer1 = data[0].folders[0].pages[0].answers[0];

      const answer1Item = getByText(answer1.displayName);
      const confirmButton = getByText("Confirm");

      fireEvent.click(answer1Item);
      fireEvent.click(confirmButton);

      expect(onSubmit).toHaveBeenCalledWith({
        ...answer1,
        pipingType: "answers",
      });
    });

    it("should not call onSubmit if no answers selected", () => {
      const { getByText } = renderContentPicker();

      const confirmButton = getByText("Confirm");

      fireEvent.click(confirmButton);

      expect(onSubmit).not.toHaveBeenCalled();
    });

    it("should select item via keyboard enter", () => {
      const { getByText } = renderContentPicker();

      const answer1 = data[0].folders[0].pages[0].answers[0];

      const answer1Item = getByText(answer1.displayName);
      const confirmButton = getByText("Confirm");

      fireEvent.keyUp(answer1Item, { keyCode: 13 });
      fireEvent.click(confirmButton);

      expect(onSubmit).toHaveBeenCalledWith({
        ...answer1,
        pipingType: "answers",
      });
    });

    it("should not select item via any key other than enter", () => {
      const { getByText } = renderContentPicker();

      const answer1 = data[0].folders[0].pages[0].answers[0];

      const answer1Item = getByText(answer1.displayName);
      const confirmButton = getByText("Confirm");

      fireEvent.keyUp(answer1Item, { keyCode: 32 });
      fireEvent.click(confirmButton);

      expect(onSubmit).not.toHaveBeenCalled();
    });

    it("should only select 1 item at a time by default", () => {
      const { getByText } = renderContentPicker();

      const answer1 = data[0].folders[0].pages[0].answers[0];
      const answer2 = data[0].folders[0].pages[0].answers[1];

      const answer1Item = getByText(answer1.displayName).closest("li");
      const answer2Item = getByText(answer2.displayName).closest("li");

      const confirmButton = getByText("Confirm");

      fireEvent.click(answer1Item);
      fireEvent.click(answer2Item);

      fireEvent.click(confirmButton);

      expect(answer1Item).toHaveAttribute("aria-selected", "false");
      expect(answer2Item).toHaveAttribute("aria-selected", "true");

      expect(onSubmit).toHaveBeenCalledWith({
        ...answer2,
        pipingType: "answers",
      });
    });

    it("should unselect selected item", () => {
      const { getByText } = renderContentPicker();

      const answer1 = data[0].folders[0].pages[0].answers[0];

      const answer1Item = getByText(answer1.displayName).closest("li");

      fireEvent.click(answer1Item);
      expect(answer1Item).toHaveAttribute("aria-selected", "true");

      fireEvent.click(answer1Item);
      expect(answer1Item).toHaveAttribute("aria-selected", "false");
    });

    it("should only select multiple items if specified", () => {
      props = {
        ...props,
        multiselect: true,
      };

      const { getByText } = renderContentPicker();

      const answer1 = data[0].folders[0].pages[0].answers[0];
      const answer2 = data[0].folders[0].pages[0].answers[1];

      const answer1Item = getByText(answer1.displayName).closest("li");
      const answer2Item = getByText(answer2.displayName).closest("li");

      const confirmButton = getByText("Confirm");

      fireEvent.click(answer1Item);
      fireEvent.click(answer2Item);

      fireEvent.click(confirmButton);

      expect(answer1Item).toHaveAttribute("aria-selected", "true");
      expect(answer2Item).toHaveAttribute("aria-selected", "true");

      expect(onSubmit).toHaveBeenCalledWith([
        { ...answer1, pipingType: "answers" },
        { ...answer2, pipingType: "answers" },
      ]);
    });

    it("should unselect selected item when multiselect specified", () => {
      props = {
        ...props,
        multiselect: true,
      };

      const { getByText } = renderContentPicker();

      const answer1 = data[0].folders[0].pages[0].answers[0];
      const answer2 = data[0].folders[0].pages[0].answers[1];

      const answer1Item = getByText(answer1.displayName).closest("li");
      const answer2Item = getByText(answer2.displayName).closest("li");

      fireEvent.click(answer1Item);
      fireEvent.click(answer2Item);

      expect(answer1Item).toHaveAttribute("aria-selected", "true");
      expect(answer2Item).toHaveAttribute("aria-selected", "true");

      fireEvent.click(answer1Item);

      expect(answer1Item).toHaveAttribute("aria-selected", "false");
      expect(answer2Item).toHaveAttribute("aria-selected", "true");

      const confirmButton = getByText("Confirm");
      fireEvent.click(confirmButton);

      expect(onSubmit).toHaveBeenCalledWith([
        { ...answer2, pipingType: "answers" },
      ]);
    });
  });

  describe("metadata content", () => {
    beforeEach(() => {
      data = [
        {
          alias: "metaAlias",
          dateValue: null,
          displayName: "metaAlias",
          id: "meta1",
          key: "metaKey",
          languageValue: null,
          regionValue: null,
          textValue: "metaValue",
          type: "Text",
        },
        {
          alias: "metaAlias2",
          dateValue: null,
          displayName: "metaAlias2",
          id: "meta2",
          key: "metaKey2",
          languageValue: null,
          regionValue: null,
          textValue: "metaValue2",
          type: "Text",
        },
      ];

      props = {
        ...props,
        data,
        contentType: METADATA,
      };
    });

    it("should render metdata error message when no data supplied", () => {
      props.data = [];
      const { getByText, getByTestId } = renderContentPicker();

      expect(
        getByText("There are no previous metadata to pick from")
      ).toBeTruthy();
      expect(getByTestId("no-previous-answers")).toBeTruthy();
    });

    it("should render metadata picker when specified", () => {
      const { getByText } = renderContentPicker();

      const modalHeader = getByText("Select metadata");
      expect(modalHeader).toBeTruthy();
    });

    it("should call onSubmit with selected answers", () => {
      const { getByText } = renderContentPicker();

      const meta1 = props.data[0];

      const meta1Item = getByText(meta1.displayName);
      const confirmButton = getByText("Confirm");

      fireEvent.click(meta1Item);
      fireEvent.click(confirmButton);

      expect(onSubmit).toHaveBeenCalledWith({
        ...meta1,
        pipingType: "metadata",
      });
    });

    it("should select item via keyboard enter", () => {
      const { getByText } = renderContentPicker();
      const meta1 = props.data[0];

      const meta1Item = getByText(meta1.displayName);
      const confirmButton = getByText("Confirm");

      fireEvent.keyUp(meta1Item, { keyCode: 13 });
      fireEvent.click(confirmButton);

      expect(onSubmit).toHaveBeenCalledWith({
        ...meta1,
        pipingType: "metadata",
      });
    });

    it("should not select item via any key other than enter", () => {
      const { getByText } = renderContentPicker();

      const meta1 = data[0];

      const meta1Item = getByText(meta1.displayName);
      const confirmButton = getByText("Confirm");

      fireEvent.keyUp(meta1Item, { keyCode: 32 });
      fireEvent.click(confirmButton);

      expect(onSubmit).not.toHaveBeenCalled();
    });

    it("should only select 1 item at a time by default", () => {
      const { getByText } = renderContentPicker();

      const meta1 = data[0];
      const meta2 = data[1];

      const meta1Item = getByText(meta1.displayName).closest("li");
      const meta2Item = getByText(meta2.displayName).closest("li");

      const confirmButton = getByText("Confirm");

      fireEvent.click(meta1Item);
      fireEvent.click(meta2Item);

      fireEvent.click(confirmButton);

      expect(meta1Item).toHaveAttribute("aria-selected", "false");
      expect(meta2Item).toHaveAttribute("aria-selected", "true");

      expect(onSubmit).toHaveBeenCalledWith({
        ...meta2,
        pipingType: "metadata",
      });
    });

    it("should unselect selected item", () => {
      const { getByText } = renderContentPicker();

      const meta1 = data[0];

      const meta1Item = getByText(meta1.displayName).closest("li");

      fireEvent.click(meta1Item);
      expect(meta1Item).toHaveAttribute("aria-selected", "true");

      fireEvent.click(meta1Item);
      expect(meta1Item).toHaveAttribute("aria-selected", "false");
    });

    it("should only select multiple items if specified", () => {
      props = {
        ...props,
        multiselect: true,
      };

      const { getByText } = renderContentPicker();

      const meta1 = data[0];
      const meta2 = data[1];

      const meta1Item = getByText(meta1.displayName).closest("li");
      const meta2Item = getByText(meta2.displayName).closest("li");

      const confirmButton = getByText("Confirm");

      fireEvent.click(meta1Item);
      fireEvent.click(meta2Item);

      fireEvent.click(confirmButton);

      expect(meta1Item).toHaveAttribute("aria-selected", "true");
      expect(meta2Item).toHaveAttribute("aria-selected", "true");

      expect(onSubmit).toHaveBeenCalledWith([
        { ...meta1, pipingType: "metadata" },
        { ...meta2, pipingType: "metadata" },
      ]);
    });

    it("should unselect selected item when multiselect specified", () => {
      props = {
        ...props,
        multiselect: true,
      };

      const { getByText } = renderContentPicker();

      const meta1 = data[0];
      const meta2 = data[1];

      const meta1Item = getByText(meta1.displayName).closest("li");
      const meta2Item = getByText(meta2.displayName).closest("li");

      fireEvent.click(meta1Item);
      fireEvent.click(meta2Item);

      expect(meta1Item).toHaveAttribute("aria-selected", "true");
      expect(meta2Item).toHaveAttribute("aria-selected", "true");

      fireEvent.click(meta1Item);

      expect(meta1Item).toHaveAttribute("aria-selected", "false");
      expect(meta2Item).toHaveAttribute("aria-selected", "true");

      const confirmButton = getByText("Confirm");
      fireEvent.click(confirmButton);

      expect(onSubmit).toHaveBeenCalledWith([
        { ...meta2, pipingType: "metadata" },
      ]);
    });
  });

  describe("variable content", () => {
    beforeEach(() => {
      props = {
        ...props,
        contentType: VARIABLES,
      };
    });

    it("should render variable picker when specified", () => {
      const { getByText } = renderContentPicker();

      const modalHeader = getByText("Select a variable");
      expect(modalHeader).toBeTruthy();
    });

    it("should call onSubmit with selected variable", () => {
      const { getByText } = renderContentPicker();

      const variableItem = getByText("Total");
      const confirmButton = getByText("Confirm");

      fireEvent.click(variableItem);
      fireEvent.click(confirmButton);

      expect(onSubmit).toHaveBeenCalledWith({
        id: "total",
        displayName: "total",
        pipingType: "variable",
      });
    });

    it("should select item via keyboard enter", () => {
      const { getByText } = renderContentPicker();

      const variableItem = getByText("Total");
      const confirmButton = getByText("Confirm");

      fireEvent.keyUp(variableItem, { keyCode: 13 });
      fireEvent.click(confirmButton);

      expect(onSubmit).toHaveBeenCalledWith({
        id: "total",
        displayName: "total",
        pipingType: "variable",
      });
    });

    it("should not select item via any key other than enter", () => {
      const { getByText } = renderContentPicker();

      const variableItem = getByText("Total");
      const confirmButton = getByText("Confirm");

      fireEvent.keyUp(variableItem, { keyCode: 32 });
      fireEvent.click(confirmButton);

      expect(onSubmit).not.toHaveBeenCalled();
    });

    it("should unselect selected item", () => {
      const { getByText } = renderContentPicker();

      const variableItem = getByText("Total").closest("li");

      fireEvent.click(variableItem);
      expect(variableItem).toHaveAttribute("aria-selected", "true");

      fireEvent.click(variableItem);
      expect(variableItem).toHaveAttribute("aria-selected", "false");
    });
  });

  describe("destination content", () => {
    beforeEach(() => {
      props = {
        ...props,
        data: {
          logicalDestinations: jest.fn(() => [
            {
              id: NextPage,
              displayName: destinationKey[NextPage],
              logicalDestination: NextPage,
            },
            {
              id: EndOfQuestionnaire,
              displayName: destinationKey[EndOfQuestionnaire],
              logicalDestination: EndOfQuestionnaire,
              displayEnabled: !questionnaire.hub,
            },
          ]),
          pages: [
            {
              id: "1",
              displayName: "Question one",
              section: [
                {
                  id: "section-1",
                  displayName: "Section one",
                },
              ],
            },
            {
              id: "2",
              displayName: "Question two",
              section: [
                {
                  id: "section-1",
                  displayName: "Section one",
                },
              ],
            },
            {
              id: "3",
              displayName: "Question three",
              section: [
                {
                  id: "section-1",
                  displayName: "Section one",
                },
              ],
            },
            {
              id: "4",
              displayName: "Question four",
              section: [
                {
                  id: "section-1",
                  displayName: "Section one",
                },
              ],
            },
          ],
          sections: [
            {
              id: "section-2",
              displayName: "Section two",
            },
            {
              id: "section-3",
              displayName: "Section three",
            },
            {
              id: "section-4",
              displayName: "Section four",
            },
          ],
        },
        contentType: DESTINATION,
      };
    });

    it("should render destination picker when specified", () => {
      const { getByText } = renderContentPicker();

      const modalHeader = getByText("Select a destination");
      expect(modalHeader).toBeTruthy();
    });

    it("should call onSubmit with selected question", () => {
      const { getByText } = renderContentPicker();

      const destinationItem = getByText("Question one");
      const confirmButton = getByText("Confirm");

      fireEvent.click(destinationItem);
      fireEvent.click(confirmButton);

      expect(onSubmit).toHaveBeenCalledWith({
        displayName: "Question one",
        id: "1",
        section: [{ displayName: "Section one", id: "section-1" }],
      });
    });
  });
});
