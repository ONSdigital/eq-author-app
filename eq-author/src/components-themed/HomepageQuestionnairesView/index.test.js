import React from "react";

import { sortBy } from "lodash";

import {
  render,
  fireEvent,
  act,
  waitForElementToBeRemoved,
} from "tests/utils/rtl";

import { READ, WRITE } from "constants/questionnaire-permissions";

import QuestionnairesView, { STORAGE_KEY } from "./";

import { UNPUBLISHED } from "constants/publishStatus";
import * as Headings from "constants/table-headings";

import { useLockUnlockQuestionnaire } from "hooks/useSetQuestionnaireLocked";

import suppressConsoleMessage from "tests/utils/supressConsol";

/*
 * @description Suppresses specific messages from being logged in the Console.
 */
suppressConsoleMessage("ReactComponent is not a styled component", "warn");

// eslint-disable-next-line no-console
console.log(
  `Warn: there are manually suppressed warnings or errors in this test file due to dependencies needing updates - See EAR-1095`
);
jest.mock("hooks/useSetQuestionnaireLocked", () => ({
  useLockUnlockQuestionnaire: jest.fn(() => [jest.fn(), jest.fn()]),
}));

jest.mock("lodash", () => ({
  ...jest.requireActual("lodash"),
  debounce: jest.fn((fn) => fn),
}));

const enabledHeadings = [
  Headings.TITLE,
  Headings.OWNER,
  Headings.CREATED,
  Headings.MODIFIED,
  Headings.LOCKED,
  Headings.STARRED,
  Headings.ACCESS,
  Headings.ACTIONS,
];

describe("QuestionnairesView", () => {
  const user = {
    id: "3",
    name: "Foo",
    email: "foo@bar.com",
    displayName: "Foo",
  };

  const buildQuestionnaire = (index, overrides) => ({
    id: `questionnaire${index}`,
    displayName: `Questionnaire ${index}`,
    title: `Questionnaire ${index} Title`,
    shortTitle: "",
    createdAt: `2019-05-${30 - index}T12:36:50.984Z`,
    updatedAt: `2019-05-${30 - index}T12:36:50.984Z`,
    createdBy: user,
    permission: WRITE,
    publishStatus: UNPUBLISHED,
    starred: false,
    locked: false,
    ...overrides,
  });
  let props;
  beforeEach(() => {
    const questionnaires = [
      buildQuestionnaire(1),
      {
        ...buildQuestionnaire(2),
        locked: true,
      },
      buildQuestionnaire(3),
    ];

    props = {
      questionnaires,
      onDeleteQuestionnaire: jest.fn(),
      onDuplicateQuestionnaire: jest.fn(),
      onCreateQuestionnaire: jest.fn(),
      canCreateQuestionnaire: true,
      enabledHeadings: enabledHeadings,
      onQuestionnaireClick: jest.fn(),
    };
  });

  afterEach(() => {
    window.localStorage.removeItem(STORAGE_KEY);
  });

  describe("Empty state", () => {
    beforeEach(() => {
      props.questionnaires = [];
    });
    it("should show a message when there are no questionnaires", () => {
      const { getByText } = render(<QuestionnairesView {...props} />);

      expect(getByText("No questionnaires found")).toBeTruthy();
    });

    it("should allow you to create a questionnaire", () => {
      const { getByText, getByLabelText } = render(
        <QuestionnairesView {...props} />
      );

      const createButton = getByText("Create a questionnaire");
      fireEvent.click(createButton);

      fireEvent.change(getByLabelText("Questionnaire title"), {
        target: { value: "Questionnaire title" },
      });
      fireEvent.change(getByLabelText("Questionnaire type"), {
        target: { value: "Business" },
      });
      fireEvent.click(getByText("Create"));

      expect(props.onCreateQuestionnaire).toHaveBeenCalled();
    });

    it("should be possible to cancel creating a questionnaire", async () => {
      const { getByText, queryByLabelText } = render(
        <QuestionnairesView {...props} />
      );

      const createButton = getByText("Create a questionnaire");
      fireEvent.click(createButton);

      expect(queryByLabelText("Questionnaire title")).toBeTruthy();

      const cancelButton = getByText("Cancel");
      fireEvent.click(cancelButton);

      await waitForElementToBeRemoved(() =>
        queryByLabelText("Questionnaire title")
      );

      expect(queryByLabelText("Questionnaire title")).toBeFalsy();
    });
  });

  describe("Non-empty state", () => {
    it("should render the questionnaires", () => {
      const { getByText } = render(<QuestionnairesView {...props} />);

      expect(getByText("Questionnaire 1 Title")).toBeTruthy();
      expect(getByText("Questionnaire 2 Title")).toBeTruthy();
    });

    it("should render the questionnaires when the storage is corrupted", () => {
      window.localStorage.setItem(STORAGE_KEY, "{]");
      const { getByText } = render(<QuestionnairesView {...props} />);
      expect(getByText("Questionnaire 1 Title")).toBeTruthy();
    });

    it("should render the questionnaires when the storage is incorrect", () => {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ foo: "bar" }));
      const { getByText } = render(<QuestionnairesView {...props} />);
      expect(getByText("Questionnaire 1 Title")).toBeTruthy();
    });

    it("should allow you to create a questionnaire", () => {
      const { getByText, getByLabelText } = render(
        <QuestionnairesView {...props} />
      );

      const createButton = getByText("Create questionnaire");
      fireEvent.click(createButton);

      fireEvent.change(getByLabelText("Questionnaire title"), {
        target: { value: "Questionnaire title" },
      });
      fireEvent.change(getByLabelText("Questionnaire type"), {
        target: { value: "Business" },
      });
      fireEvent.click(getByText("Create"));

      expect(props.onCreateQuestionnaire).toHaveBeenCalled();
    });

    it("should be possible to cancel creating a questionnaire", async () => {
      const { getByText, queryByLabelText } = render(
        <QuestionnairesView {...props} />
      );

      const createButton = getByText("Create questionnaire");
      fireEvent.click(createButton);

      expect(queryByLabelText("Questionnaire title")).toBeTruthy();

      const cancelButton = getByText("Cancel");
      fireEvent.click(cancelButton);

      await waitForElementToBeRemoved(() =>
        queryByLabelText("Questionnaire title")
      );

      expect(queryByLabelText("Questionnaire title")).toBeFalsy();
    });
  });

  describe("Locking", () => {
    it("should show lock confirmation modal when lock button pushed (unlocked questionnaire)", () => {
      const lockQuestionnaire = jest.fn();
      useLockUnlockQuestionnaire.mockImplementation(() => [
        lockQuestionnaire,
        jest.fn(),
      ]);

      const { getAllByTitle, getByText } = render(
        <QuestionnairesView {...props} />
      );
      const lockButton = getAllByTitle("Lock")[0];
      fireEvent.click(lockButton);

      const confirmButton = getByText("Lock");
      expect(confirmButton).not.toBeNull();

      fireEvent.click(confirmButton);
      expect(lockQuestionnaire).toHaveBeenCalledWith(
        props.questionnaires[0].id
      );
    });

    it("should show unlock confirmation modal when lock button pushed (locked questionnaire)", () => {
      const unlockQuestionnaire = jest.fn();
      useLockUnlockQuestionnaire.mockImplementation(() => [
        jest.fn(),
        unlockQuestionnaire,
      ]);

      const { getAllByTitle, getByText } = render(
        <QuestionnairesView {...props} />
      );
      const lockButton = getAllByTitle("Lock")[1];
      fireEvent.click(lockButton);

      const confirmButton = getByText("Unlock");
      expect(confirmButton).not.toBeNull();

      fireEvent.click(confirmButton);
      expect(unlockQuestionnaire).toHaveBeenCalledWith(
        props.questionnaires[1].id
      );
    });
  });

  describe("Deletion", () => {
    it("should call onDeleteQuestionnaire when a questionnaire is deleted", () => {
      const { getAllByTestId, getByTestId } = render(
        <QuestionnairesView {...props} />
      );
      const deleteButton = getAllByTestId("btn-delete-questionnaire")[0];
      fireEvent.click(deleteButton);
      const confirmButton = getByTestId("btn-delete-modal");
      fireEvent.click(confirmButton);

      expect(props.onDeleteQuestionnaire).toHaveBeenCalledWith(
        "questionnaire1"
      );
    });

    it("should autofocus the next row after when one is deleted", () => {
      const { getAllByTestId, getByTestId, rerender } = render(
        <QuestionnairesView {...props} />
      );

      const deleteButton = getAllByTestId("btn-delete-questionnaire")[0];
      fireEvent.click(deleteButton);
      const confirmButton = getByTestId("btn-delete-modal");
      fireEvent.click(confirmButton);

      rerender(
        <QuestionnairesView
          {...props}
          questionnaires={props.questionnaires.slice(1)}
        />
      );
      expect(getAllByTestId("anchor-questionnaire-title")[0]).toEqual(
        document.activeElement
      );
    });

    it("should autofocus the last row if the last row is deleted", () => {
      const { getAllByTestId, getByTestId, rerender } = render(
        <QuestionnairesView {...props} />
      );

      const deleteButton = getAllByTestId("btn-delete-questionnaire")[2];
      fireEvent.click(deleteButton);
      const confirmButton = getByTestId("btn-delete-modal");
      fireEvent.click(confirmButton);
      rerender(
        <QuestionnairesView
          {...props}
          questionnaires={props.questionnaires.slice(0, 2)}
        />
      );
      expect(getAllByTestId("anchor-questionnaire-title")[1]).toEqual(
        document.activeElement
      );
    });

    it("should not blow up if you delete the last item", async () => {
      const questionnaires = props.questionnaires.slice(0, 1);
      const { getByTestId, getAllByTestId } = render(
        <QuestionnairesView {...props} questionnaires={questionnaires} />
      );

      const deleteButton = getAllByTestId("btn-delete-questionnaire")[0];
      fireEvent.click(deleteButton);
      const confirmButton = getByTestId("btn-delete-modal");
      fireEvent.click(confirmButton);

      expect(document.body).toEqual(document.activeElement);
    });

    it("should focus the last item of the previous page when the only item of a page is deleted", () => {
      const questionnaires = new Array(13)
        .fill("")
        .map((_, index) => buildQuestionnaire(index));

      const { getByText, getAllByTestId, getByTestId, rerender } = render(
        <QuestionnairesView {...props} questionnaires={questionnaires} />
      );

      // Move to page 2
      const nextButton = getByText("Go to next page");
      fireEvent.click(nextButton);
      expect(getByText("Page 2 of 2")).toBeTruthy();

      // Delete the only questionnaire on the page
      const deleteButton = getAllByTestId("btn-delete-questionnaire")[0];
      fireEvent.click(deleteButton);
      const confirmButton = getByTestId("btn-delete-modal");
      fireEvent.click(confirmButton);

      rerender(
        <QuestionnairesView
          {...props}
          questionnaires={questionnaires.slice(0, 12)}
        />
      );

      expect(getByText("Page 1 of 1")).toBeTruthy();

      expect(getAllByTestId("anchor-questionnaire-title")[11]).toEqual(
        document.activeElement
      );
    });

    it("should not delete the questionnaire if the cancel button is clicked", async () => {
      const { getAllByTestId, getByText } = render(
        <QuestionnairesView {...props} />
      );
      const deleteButton = getAllByTestId("btn-delete-questionnaire")[0];
      fireEvent.click(deleteButton);
      const cancelButton = getByText("Cancel");
      fireEvent.click(cancelButton);

      expect(props.onDeleteQuestionnaire).not.toHaveBeenCalled();
    });

    it("should not delete the questionnaire if the close button is clicked", async () => {
      const { getByLabelText, getByTestId, getAllByTestId } = render(
        <QuestionnairesView {...props} />
      );
      const deleteButton = getAllByTestId("btn-delete-questionnaire")[0];
      fireEvent.click(deleteButton);
      const closeButton = getByLabelText("Close");
      fireEvent.click(closeButton);

      await waitForElementToBeRemoved(() => getByTestId("btn-delete-modal"));

      expect(props.onDeleteQuestionnaire).not.toHaveBeenCalled();
    });

    it("should focus the next questionnaire based on the current sorting", async () => {
      const questionnaires = [
        buildQuestionnaire(3, { createdAt: "2019-01-03T12:36:50.984Z" }),
        buildQuestionnaire(2, { createdAt: "2019-01-02T12:36:50.984Z" }),
        buildQuestionnaire(1, { createdAt: "2019-01-01T12:36:50.984Z" }),
      ];

      const { getByText, getByTestId, getAllByTestId, queryByTestId } = render(
        <QuestionnairesView {...props} questionnaires={questionnaires} />
      );
      const sortTitleButton = getByText("Title");
      fireEvent.click(sortTitleButton);

      // Delete Questionnaire 2
      const deleteButton = getAllByTestId("btn-delete-questionnaire")[1];
      fireEvent.click(deleteButton);
      const confirmButton = getByTestId("btn-delete-modal");
      fireEvent.click(confirmButton);

      expect(queryByTestId("btn-delete-modal")).toBeNull();

      expect(getAllByTestId("anchor-questionnaire-title")[2]).toHaveFocus();
    });

    it("should not re-focus the row after switching page", async () => {
      const questionnaires = new Array(14)
        .fill(null)
        .map((_, index) => buildQuestionnaire(index));

      const { getByText, getByTestId, rerender, getAllByTestId } = render(
        <QuestionnairesView {...props} questionnaires={questionnaires} />
      );

      // Move to page 2
      const nextButton = getByText("Go to next page");
      fireEvent.click(nextButton);
      expect(getByText("Page 2 of 2")).toBeTruthy();

      // Delete the last one on the page - the other one is focused
      const deleteButton = getAllByTestId("btn-delete-questionnaire")[1];
      fireEvent.click(deleteButton);
      const confirmButton = getByTestId("btn-delete-modal");
      fireEvent.click(confirmButton);

      rerender(
        <QuestionnairesView
          {...props}
          questionnaires={questionnaires.slice(0, 13)}
        />
      );
      expect(document.activeElement).not.toEqual(document.body);

      const previousButton = getByText("Go to previous page");
      fireEvent.click(previousButton);
      expect(getByText("Page 1 of 2")).toBeTruthy();

      fireEvent.click(nextButton);
      expect(getByText("Page 2 of 2")).toBeTruthy();

      expect(document.activeElement).not.toEqual(
        getAllByTestId("anchor-questionnaire-title")[0]
      );
    });

    it("should not re-focus the row after switching order", () => {
      const questionnaires = new Array(14)
        .fill(null)
        .map((_, index) => buildQuestionnaire(index));

      const { getByText, getByTestId, getAllByTestId, rerender } = render(
        <QuestionnairesView {...props} questionnaires={questionnaires} />
      );

      // Move to page 2
      const nextButton = getByText("Go to next page");
      fireEvent.click(nextButton);
      expect(getByText("Page 2 of 2")).toBeTruthy();

      // Delete the last one on the page - the other one is focused
      const deleteButton = getAllByTestId("btn-delete-questionnaire")[1];
      fireEvent.click(deleteButton);
      const confirmButton = getByTestId("btn-delete-modal");
      fireEvent.click(confirmButton);

      rerender(
        <QuestionnairesView
          {...props}
          questionnaires={questionnaires.slice(0, 13)}
        />
      );

      expect(document.activeElement).not.toEqual(document.body);
    });

    it("should not re-focus the row after applying search", () => {
      jest.useFakeTimers();

      const {
        getByTestId,
        getAllByTestId,
        getByLabelText,
        queryByText,
        rerender,
      } = render(<QuestionnairesView {...props} />);

      // Delete the last one on the page - the other one is focused
      const deleteButton = getAllByTestId("btn-delete-questionnaire")[0];
      fireEvent.click(deleteButton);
      const confirmButton = getByTestId("btn-delete-modal");
      fireEvent.click(confirmButton);

      rerender(
        <QuestionnairesView
          {...props}
          questionnaires={props.questionnaires.slice(1)}
        />
      );

      expect(document.activeElement).not.toEqual(document.body);

      const search = getByLabelText("Search");
      fireEvent.change(search, {
        target: { value: "not in any questionnaire" },
      });
      act(() => {
        jest.runAllTimers();
      });
      expect(queryByText("Questionnaire 2 Title")).toBeFalsy();

      fireEvent.change(search, { target: { value: "" } });
      act(() => {
        jest.runAllTimers();
      });
      expect(queryByText("Questionnaire 2 Title")).toBeTruthy();
    });

    it("should not be able to delete a read only questionnaire", () => {
      props.questionnaires[0].permission = READ;

      const { getAllByTestId, queryByTestId, getByText } = render(
        <QuestionnairesView {...props} />
      );

      expect(getByText("Questionnaire 1 Title")).toBeTruthy();

      const deleteButton = getAllByTestId("btn-delete-questionnaire")[0];
      fireEvent.click(deleteButton);
      const confirmButton = queryByTestId("btn-delete-modal");

      expect(confirmButton).toBeFalsy();
      expect(props.onDeleteQuestionnaire).not.toHaveBeenCalled();
    });
  });

  describe("Duplication", () => {
    it("should call onDuplicateQuestionnaire with the questionnaire when the button is clicked", () => {
      const { getAllByText } = render(<QuestionnairesView {...props} />);

      const duplicateButton = getAllByText("Duplicate")[0];

      fireEvent.click(duplicateButton);

      expect(props.onDuplicateQuestionnaire).toHaveBeenCalledWith(
        props.questionnaires[0]
      );
    });
  });

  describe("Pagination", () => {
    beforeEach(() => {
      props.questionnaires = new Array(18)
        .fill("")
        .map((_, index) => buildQuestionnaire(index));
    });

    it("should show 12 results on each page", () => {
      const { getByText, queryByText, container, queryByTestId } = render(
        <QuestionnairesView {...props} />
      );

      expect(getByText("Page 1 of 2")).toBeTruthy();
      expect(queryByTestId("pagination-1")).toBeTruthy();
      expect(queryByTestId("pagination-2")).toBeTruthy();

      // Header is a row as well
      expect(container.querySelectorAll("tr")).toHaveLength(12 + 1);
      expect(queryByText("Questionnaire 16 Title")).toBeFalsy();
    });

    it("should navigate forward", () => {
      const { container, getByText, queryByText, queryByTestId } = render(
        <QuestionnairesView {...props} />
      );

      const nextButton = getByText("Go to next page");
      fireEvent.click(nextButton);

      expect(getByText("Page 2 of 2")).toBeTruthy();
      expect(queryByTestId("pagination-1")).toBeTruthy();
      expect(queryByTestId("pagination-2")).toBeTruthy();
      // expect(getByText("1 2")).toBeTruthy(); // test focus

      expect(container.querySelectorAll("tr")).toHaveLength(6 + 1);
      expect(queryByText("Questionnaire 16 Title")).toBeTruthy();
    });

    it("should navigate backwards", () => {
      const { getByText } = render(<QuestionnairesView {...props} />);

      const nextButton = getByText("Go to next page");
      fireEvent.click(nextButton);

      expect(getByText("Page 2 of 2")).toBeTruthy();

      const previousPage = getByText("Go to previous page");
      fireEvent.click(previousPage);

      expect(getByText("Page 1 of 2")).toBeTruthy();
    });

    it("should be impossible to navigate to a page before the first one", () => {
      const { getByText } = render(<QuestionnairesView {...props} />);

      expect(getByText("Page 1 of 2")).toBeTruthy();

      const previousPage = getByText("Go to previous page");
      fireEvent.click(previousPage);

      expect(getByText("Page 1 of 2")).toBeTruthy();
    });

    it("should be impossible to navigate to a page after the last one", () => {
      const { getByText } = render(<QuestionnairesView {...props} />);

      const nextButton = getByText("Go to next page");
      fireEvent.click(nextButton);

      expect(getByText("Page 2 of 2")).toBeTruthy();

      fireEvent.click(nextButton);

      expect(getByText("Page 2 of 2")).toBeTruthy();
    });

    it("should start on the page left last time", () => {
      const { getByText, queryByText, unmount } = render(
        <QuestionnairesView {...props} />
      );

      expect(getByText("Page 1 of 2")).toBeTruthy();

      const nextButton = getByText("Go to next page");
      fireEvent.click(nextButton);

      expect(getByText("Page 2 of 2")).toBeTruthy();

      unmount();

      expect(queryByText("Page 2 of 2")).toBeFalsy();

      const { getByText: getByTextNewRender } = render(
        <QuestionnairesView {...props} />
      );

      expect(getByTextNewRender("Page 2 of 2")).toBeTruthy();
    });

    it("shoud handle out of date local storage", () => {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ currentPageIndex: 1000 })
      );
      const { getByText } = render(<QuestionnairesView {...props} />);

      expect(getByText("Page 2 of 2")).toBeTruthy();
    });

    it("it should render the correct page numbers when there are more than 7 pages", () => {
      const questionnaires = new Array(121)
        .fill("")
        .map((_, index) => buildQuestionnaire(index));
      const { queryByTestId, getByText } = render(
        <QuestionnairesView {...props} questionnaires={questionnaires} />
      );
      expect(getByText("Page 1 of 11")).toBeTruthy();

      //checking if left range is rendered correctly
      expect(queryByTestId("pagination-1")).toBeTruthy();
      expect(queryByTestId("pagination-2")).toBeTruthy();
      expect(queryByTestId("pagination-3")).toBeTruthy();
      expect(queryByTestId("pagination-4")).toBeTruthy();
      expect(queryByTestId("pagination-5")).toBeTruthy();
      expect(queryByTestId("dots-7")).toBeTruthy();
      expect(queryByTestId("pagination-11")).toBeTruthy();
    });
    it("it should render the correct middle range when there are more than 7 pages clicking a specifc page number", () => {
      const questionnaires = new Array(121)
        .fill("")
        .map((_, index) => buildQuestionnaire(index));
      const { queryByTestId, getByText } = render(
        <QuestionnairesView {...props} questionnaires={questionnaires} />
      );

      const pageNum = queryByTestId("pagination-5");
      fireEvent.click(pageNum);
      expect(getByText("Page 5 of 11")).toBeTruthy();

      //navigate to 7th page to test the middle range when displaying page numbers
      expect(queryByTestId("pagination-1")).toBeTruthy();
      expect(queryByTestId("dots-1")).toBeTruthy();
      expect(queryByTestId("pagination-3")).toBeTruthy();
      expect(queryByTestId("pagination-4")).toBeTruthy();
      expect(queryByTestId("pagination-5")).toBeTruthy();
      expect(queryByTestId("pagination-6")).toBeTruthy();
      expect(queryByTestId("pagination-7")).toBeTruthy();
      expect(queryByTestId("dots-7")).toBeTruthy();
      expect(queryByTestId("pagination-11")).toBeTruthy();
    });

    it("it should render the correct page numbers at the end when there are more than 7 pages when clicking on the last page number", () => {
      const questionnaires = new Array(121)
        .fill("")
        .map((_, index) => buildQuestionnaire(index));
      const { queryByTestId, getByText } = render(
        <QuestionnairesView {...props} questionnaires={questionnaires} />
      );

      const pageNum = queryByTestId("pagination-11");
      fireEvent.click(pageNum);
      expect(getByText("Page 11 of 11")).toBeTruthy();

      //checking if right range is rendered correctly
      expect(queryByTestId("pagination-1")).toBeTruthy();
      expect(queryByTestId("dots-1")).toBeTruthy();
      expect(queryByTestId("pagination-5")).toBeTruthy();
      expect(queryByTestId("pagination-6")).toBeTruthy();
      expect(queryByTestId("pagination-7")).toBeTruthy();
      expect(queryByTestId("pagination-8")).toBeTruthy();
      expect(queryByTestId("pagination-9")).toBeTruthy();
      expect(queryByTestId("pagination-10")).toBeTruthy();
      expect(queryByTestId("pagination-11")).toBeTruthy();
    });
  });

  describe("Sorting", () => {
    const getRowTitleAtIndex = (getAllByTestId, index) =>
      getAllByTestId("table-row")[index].children[0].textContent;

    beforeEach(() => {
      props.questionnaires = [
        buildQuestionnaire(4, { createdAt: "2019-05-10T12:36:50.984Z" }),
        buildQuestionnaire(2, {
          createdAt: "2019-05-09T12:36:50.984Z",
          locked: true,
        }),
        buildQuestionnaire(1, {
          createdAt: "2019-05-11T12:36:50.984Z",
        }),
        buildQuestionnaire(3, {
          createdAt: "2019-05-08T12:36:50.984Z",
          starred: true,
        }),
        buildQuestionnaire(5, {
          createdAt: "2019-05-12T12:36:50.984Z",
          permission: READ,
        }),
      ];
    });

    it("should initially sort by created date with newest first", () => {
      const { getAllByTestId } = render(<QuestionnairesView {...props} />);
      const sortedQuestionnaires = sortBy(
        props.questionnaires,
        "createdAt"
      ).reverse();

      for (let index = 0; index < 5; index++) {
        expect(getRowTitleAtIndex(getAllByTestId, index)).toEqual(
          sortedQuestionnaires[index].title
        );
      }
    });

    it("should sort by title ascending when title header is clicked", () => {
      const { getByTestId, getAllByTestId } = render(
        <QuestionnairesView {...props} />
      );

      fireEvent.click(getByTestId("title-sort-button"));
      for (let index = 0; index < 5; index++) {
        expect(getRowTitleAtIndex(getAllByTestId, index)).toEqual(
          `Questionnaire ${index + 1} Title`
        );
      }
    });

    it("should sort by title descending when title header is clicked twice", async () => {
      const { getByTestId, getAllByTestId } = render(
        <QuestionnairesView {...props} />
      );

      fireEvent.click(getByTestId("title-sort-button"));
      fireEvent.click(getByTestId("title-sort-button"));

      for (let index = 0, reverseNum = 5; index < 5; index++, reverseNum--) {
        expect(getRowTitleAtIndex(getAllByTestId, index)).toEqual(
          `Questionnaire ${reverseNum} Title`
        );
      }
    });

    it("should sort by locked descending when locked header is clicked", () => {
      const { getByTestId, getAllByTestId } = render(
        <QuestionnairesView {...props} />
      );

      fireEvent.click(getByTestId("locked-sort-button"));
      expect(getRowTitleAtIndex(getAllByTestId, 0)).toEqual(
        `Questionnaire 2 Title`
      );

      fireEvent.click(getByTestId("locked-sort-button"));
      expect(getRowTitleAtIndex(getAllByTestId, 0)).toEqual(
        `Questionnaire 4 Title`
      );
    });

    it("should sort by starred descending when starred header is clicked", () => {
      const { getByTestId, getAllByTestId } = render(
        <QuestionnairesView {...props} />
      );

      fireEvent.click(getByTestId("starred-sort-button"));
      expect(getRowTitleAtIndex(getAllByTestId, 0)).toEqual(
        `Questionnaire 3 Title`
      );
      fireEvent.click(getByTestId("starred-sort-button"));
      expect(getRowTitleAtIndex(getAllByTestId, 0)).toEqual(
        `Questionnaire 4 Title`
      );
    });

    it("should sort by View only descending when access header is clicked", () => {
      const { getByTestId, getAllByTestId } = render(
        <QuestionnairesView {...props} />
      );

      fireEvent.click(getByTestId("access-sort-button"));
      expect(getRowTitleAtIndex(getAllByTestId, 0)).toEqual(
        `Questionnaire 5 Title`
      );

      fireEvent.click(getByTestId("access-sort-button"));
      expect(getRowTitleAtIndex(getAllByTestId, 0)).toEqual(
        `Questionnaire 3 Title`
      );
    });

    it("should sort across multiple pages", () => {
      const questionnaires = new Array(17)
        .fill("")
        .map((_, index) => buildQuestionnaire(index));

      const { getByText, queryByText } = render(
        <QuestionnairesView {...props} questionnaires={questionnaires} />
      );

      fireEvent.click(getByText("Title"));
      // 9 is on the second page as it is sorted alphabetically, so 1,10,...16,2,3
      expect(queryByText("Questionnaire 9 Title")).toBeFalsy();

      fireEvent.click(getByText("Title"));
      expect(queryByText("Questionnaire 9 Title")).toBeTruthy();
    });

    it("should start with the sort order left last time", () => {
      const { getByText, getAllByTestId, unmount } = render(
        <QuestionnairesView {...props} />
      );

      fireEvent.click(getByText("Title"));
      expect(getRowTitleAtIndex(getAllByTestId, 0)).toEqual(
        "Questionnaire 1 Title"
      );

      fireEvent.click(getByText("Title"));

      expect(getRowTitleAtIndex(getAllByTestId, 0)).toEqual(
        "Questionnaire 5 Title"
      );

      unmount();

      const { getAllByTestId: getAllByTestIdNewRender } = render(
        <QuestionnairesView {...props} />
      );
      expect(getRowTitleAtIndex(getAllByTestIdNewRender, 0)).toEqual(
        "Questionnaire 5 Title"
      );
    });
  });

  describe("Searching", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    it("should search questionnaire by title", async () => {
      const { getByLabelText, queryByText } = render(
        <QuestionnairesView {...props} />
      );

      const search = getByLabelText("Search");
      fireEvent.change(search, { target: { value: "questIonnaIre 1" } });
      act(() => {
        jest.runAllTimers();
      });

      expect(queryByText("Questionnaire 2 Title")).toBeFalsy();
      expect(queryByText("Questionnaire 1 Title")).toBeTruthy();
    });

    it("should search questionnaire by short title", async () => {
      const questionnaires = [
        buildQuestionnaire(1, { shortTitle: "Short 1" }),
        buildQuestionnaire(2, { shortTitle: "Short 2" }),
      ];

      const { getByLabelText, queryByText } = render(
        <QuestionnairesView {...props} questionnaires={questionnaires} />
      );

      const search = getByLabelText("Search");
      fireEvent.change(search, { target: { value: "shOrt 2" } });
      act(() => {
        jest.runAllTimers();
      });

      expect(queryByText("Short 1")).toBeFalsy();
      expect(queryByText("Short 2")).toBeTruthy();
    });

    it("should not save the search term", () => {
      const { getByLabelText, queryByText, unmount } = render(
        <QuestionnairesView {...props} />
      );

      expect(queryByText("Questionnaire 2 Title")).toBeTruthy();
      expect(queryByText("Questionnaire 1 Title")).toBeTruthy();

      const search = getByLabelText("Search");
      fireEvent.change(search, { target: { value: "questionnaire 1" } });
      act(() => {
        jest.runAllTimers();
      });

      expect(queryByText("Questionnaire 2 Title")).toBeFalsy();
      expect(queryByText("Questionnaire 1 Title")).toBeTruthy();

      unmount();

      const { queryByText: secondQueryByText } = render(
        <QuestionnairesView {...props} />
      );

      expect(secondQueryByText("Questionnaire 2 Title")).toBeTruthy();
      expect(secondQueryByText("Questionnaire 1 Title")).toBeTruthy();
    });

    it("should show a message when there are no results found", () => {
      const { getByLabelText, queryByText } = render(
        <QuestionnairesView {...props} />
      );

      const search = getByLabelText("Search");
      fireEvent.change(search, {
        target: { value: "not in any questionnaire" },
      });
      act(() => {
        jest.runAllTimers();
      });

      expect(
        queryByText("No results found for 'not in any questionnaire'.")
      ).toBeTruthy();
    });

    it("should navigate back to page one when you change the search term", () => {
      const questionnaires = new Array(17)
        .fill("")
        .map((_, i) => buildQuestionnaire(i));
      const { getByLabelText, getByText } = render(
        <QuestionnairesView {...props} questionnaires={questionnaires} />
      );

      const nextButton = getByText("Go to next page");
      fireEvent.click(nextButton);

      expect(getByText("Page 2 of 2")).toBeTruthy();

      const search = getByLabelText("Search");
      fireEvent.change(search, {
        target: { value: "Questionnaire" },
      });
      act(() => {
        jest.runAllTimers();
      });

      expect(getByText("Page 1 of 2")).toBeTruthy();
    });
  });
});
