import React from "react";
import { render, fireEvent } from "tests/utils/rtl";

import ContentPickerSelect, {
  contentPickerSelectID,
  defaultContentName,
} from "components/ContentPickerSelectv3";

import { useTruncation } from "./useTruncation";

import {
  ANSWER,
  METADATA,
  CONTENT_TYPE_FIELDS,
} from "components/ContentPickerSelectv3/content-types";
import { CURRENCY, NUMBER } from "constants/answer-types";

jest.mock("./useTruncation", () => ({
  __esModule: true,
  useTruncation: jest.fn(),
}));

useTruncation.mockImplementation(() => [false, { current: null }]);

const props = {
  loading: false,
  name: "contentPicker",
  selectedContentDisplayName: "foobar",
};

const answerData = [
  {
    id: "section-1",
    title: "",
    folders: [
      {
        pages: [
          {
            id: "page-1",
            pageType: "QuestionPage",
            title: "<p>Question one</p>",
            answers: [
              {
                id: "answer-1",
                displayName: "Answer 1",
                type: "Number",
              },
            ],
          },
        ],
      },
    ],
  },
];

const metadataData = [
  {
    id: "12345",
    type: "Date",
  },
  {
    id: "2",
    type: "Text",
  },
  {
    id: "3",
    type: "Language",
  },
  {
    id: "4",
    type: "Region",
  },
];
const data = {};
const defaultSetup = (props) => {
  const onSubmit = jest.fn();

  const utils = render(<ContentPickerSelect {...props} onSubmit={onSubmit} />);

  const select = utils.getByTestId(contentPickerSelectID);
  const selectAnswer = "Select an answer";
  const confirm = "Confirm";
  return { onSubmit, select, selectAnswer, confirm, ...utils };
};

const modifiedSetup = (newProps) => {
  const utils = defaultSetup({ ...props, ...newProps });
  return { ...utils };
};

const answerSetup = ({
  selectedContentDisplayName = undefined,
  answerData,
  ...extra
} = {}) => {
  data[ANSWER] = answerData;
  const utils = modifiedSetup({
    contentTypes: [ANSWER],
    answerTypes: [NUMBER, CURRENCY],
    selectedContentDisplayName,
    data,
    ...extra,
  });
  return { ...utils };
};

const metadataSetup = () => {
  data[METADATA] = metadataData;
  const utils = modifiedSetup({
    contentTypes: [METADATA],
    selectedContentDisplayName: "Select metadata",
    data,
  });
  const pickerDisplayName = "Select metadata";
  return { pickerDisplayName, ...utils };
};

describe("ContentPickerSelect", () => {
  describe("Answerdata types", () => {
    it("should render", () => {
      const { getByText, select } = answerSetup();

      expect(getByText(defaultContentName)).toBeVisible();
      expect(select).toBeVisible();
    });

    it("should disable select button when loading", () => {
      const { select } = answerSetup({ loading: true });

      expect(select).toBeDisabled();
    });

    it("should disable select button when error", () => {
      const { select } = answerSetup({ error: { foo: "bar" } });

      expect(select).toBeDisabled();
    });

    it("should disable select button when disable is true", () => {
      const { select } = answerSetup({ disabled: true });

      expect(select).toBeDisabled();
    });

    it("should open content picker", () => {
      const { select, selectAnswer, confirm, getByText, queryByTestId } =
        answerSetup({
          selectedContentDisplayName: "Hello moto",
        });

      fireEvent.click(select);

      expect(getByText(selectAnswer)).toBeVisible();
      expect(queryByTestId("no-previous-answers")).toBeVisible();
      expect(getByText(confirm)).toBeDisabled();
    });

    it("should close content picker", () => {
      const { select, selectAnswer, getByText, queryByTestId } = answerSetup({
        selectedContentDisplayName: "Hello moto",
      });

      fireEvent.click(select);

      expect(getByText(selectAnswer)).toBeVisible();
      expect(queryByTestId("no-previous-answers")).toBeVisible();

      fireEvent.click(getByText("Cancel"));

      expect(getByText(selectAnswer)).not.toBeVisible();
      expect(queryByTestId("no-previous-answers")).not.toBeVisible();
    });

    it("should correctly handle picker submit", () => {
      const { select, confirm, getByText, onSubmit } = answerSetup({
        answerData,
      });

      fireEvent.click(select);
      fireEvent.click(getByText("Answer 1"));
      fireEvent.click(getByText(confirm));

      expect(onSubmit).toHaveBeenCalledWith({
        name: CONTENT_TYPE_FIELDS[ANSWER],
        value: {
          displayName: "Answer 1",
          id: "answer-1",
          pipingType: "answers",
          type: "Number",
        },
      });
    });

    it("should use question title", () => {
      const { getByText } = answerSetup({
        answerData,
        selectedContentDisplayName: {
          displayName: "Answer 1",
          page: { alias: "", title: "Hello moto" },
        },
      });

      expect(getByText("Hello moto")).toBeVisible();
      expect(getByText("Answer 1")).toBeVisible();
    });

    it("should use question title and alias", () => {
      const { getByText } = answerSetup({
        answerData,
        selectedContentDisplayName: {
          displayName: "Answer 1",
          page: { alias: "short", title: "Hello moto" },
        },
      });

      expect(getByText("short - Hello moto")).toBeVisible();
      expect(getByText("Answer 1")).toBeVisible();
    });

    it("should truncate question title", () => {
      useTruncation.mockImplementationOnce(() => [true, { current: null }]);

      const { getByText, getAllByText } = answerSetup({
        answerData,
        selectedContentDisplayName: {
          displayName: "Answer 1",
          page: {
            alias: "short",
            title: "Hello moto",
          },
        },
      });

      expect(getAllByText("short - Hello moto")).toHaveLength(2);
      expect(getAllByText("short - Hello moto")[0]).toBeVisible();
      expect(getAllByText("short - Hello moto")[1]).toHaveAttribute(
        "data-id",
        "tooltip"
      );
      expect(getByText("Answer 1")).toBeVisible();
    });

    it("should truncate content picker select button with default text", () => {
      useTruncation.mockImplementationOnce(() => [true, { current: null }]);

      const { getAllByText, selectAnswer } = answerSetup();

      expect(getAllByText(selectAnswer)).toHaveLength(2);
      expect(getAllByText(selectAnswer)[0]).toBeVisible();
      expect(getAllByText(selectAnswer)[1]).toHaveAttribute(
        "data-id",
        "tooltip"
      );
    });
  });

  describe("metadata types", () => {
    it("should render", () => {
      const { select, pickerDisplayName, getAllByText } = metadataSetup();
      fireEvent.click(select);

      expect(getAllByText(pickerDisplayName)).toHaveLength(2);
    });
  });
});
