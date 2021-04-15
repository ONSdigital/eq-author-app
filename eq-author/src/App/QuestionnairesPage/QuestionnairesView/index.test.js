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

import { useLockUnlockQuestionnaire } from "hooks/useSetQuestionnaireLocked";

jest.mock("hooks/useSetQuestionnaireLocked", () => ({
  useLockUnlockQuestionnaire: jest.fn(() => [jest.fn(), jest.fn()]),
}));

jest.mock("lodash", () => ({
  ...jest.requireActual("lodash"),
  debounce: jest.fn((fn) => fn),
}));

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
        const { getAllByTitle, getByTestId } = render(
          <QuestionnairesView {...props} />
        );
        const deleteButton = getAllByTitle("Delete")[0];
        fireEvent.click(deleteButton);
        const confirmButton = getByTestId("btn-delete-modal");
        fireEvent.click(confirmButton);

        expect(props.onDeleteQuestionnaire).toHaveBeenCalledWith(
          "questionnaire1"
        );
      });

      it("should autofocus the next row after when one is deleted", () => {
        const { getAllByTitle, getByTestId, getByTitle, rerender } = render(
          <QuestionnairesView {...props} />
        );

        const deleteButton = getAllByTitle("Delete")[0];
        fireEvent.click(deleteButton);
        const confirmButton = getByTestId("btn-delete-modal");
        fireEvent.click(confirmButton);

        rerender(
          <QuestionnairesView
            {...props}
            questionnaires={props.questionnaires.slice(1)}
          />
        );

        expect(getByTitle("Questionnaire 2")).toEqual(document.activeElement);
      });

      it("should autofocus the last row if the last row is deleted", () => {
        const { getAllByTitle, getByTestId, getByTitle, rerender } = render(
          <QuestionnairesView {...props} />
        );

        const deleteButton = getAllByTitle("Delete")[2];
        fireEvent.click(deleteButton);
        const confirmButton = getByTestId("btn-delete-modal");
        fireEvent.click(confirmButton);
        rerender(
          <QuestionnairesView
            {...props}
            questionnaires={props.questionnaires.slice(0, 2)}
          />
        );

        expect(getByTitle("Questionnaire 2")).toEqual(document.activeElement);
      });

      it("should not blow up if you delete the last item", async () => {
        const questionnaires = props.questionnaires.slice(0, 1);
        const { getAllByTitle, getByTestId } = render(
          <QuestionnairesView {...props} questionnaires={questionnaires} />
        );

        const deleteButton = getAllByTitle("Delete")[0];
        fireEvent.click(deleteButton);
        const confirmButton = getByTestId("btn-delete-modal");
        fireEvent.click(confirmButton);

        // Wait for modal to animate out
        await waitForElementToBeRemoved(() => getByTestId("btn-delete-modal"));

        expect(document.body).toEqual(document.activeElement);
      });

      it("should focus the last item of the previous page when the only item of a page is deleted", () => {
        const questionnaires = new Array(17)
          .fill("")
          .map((_, index) => buildQuestionnaire(index));

        const {
          getByText,
          getAllByTitle,
          getByTitle,
          getByTestId,
          rerender,
        } = render(
          <QuestionnairesView {...props} questionnaires={questionnaires} />
        );

        // Move to page 2
        const nextButton = getByText("Go to next page");
        fireEvent.click(nextButton);
        expect(getByText("Showing 1 of 17")).toBeTruthy();

        // Delete the only questionnaire on the page
        const deleteButton = getAllByTitle("Delete")[0];
        fireEvent.click(deleteButton);
        const confirmButton = getByTestId("btn-delete-modal");
        fireEvent.click(confirmButton);

        rerender(
          <QuestionnairesView
            {...props}
            questionnaires={questionnaires.slice(0, 16)}
          />
        );

        expect(getByText("Showing 16 of 16")).toBeTruthy();
        expect(getByTitle("Questionnaire 15")).toEqual(document.activeElement);
      });

      it("should not delete the questionnaire if the cancel button is clicked", async () => {
        const { getAllByTitle, getByText, getByTestId } = render(
          <QuestionnairesView {...props} />
        );
        const deleteButton = getAllByTitle("Delete")[0];
        fireEvent.click(deleteButton);
        const cancelButton = getByText("Cancel");
        fireEvent.click(cancelButton);

        await waitForElementToBeRemoved(() => getByTestId("btn-delete-modal"));

        expect(props.onDeleteQuestionnaire).not.toHaveBeenCalled();
      });

      it("should not delete the questionnaire if the close button is clicked", async () => {
        const { getAllByTitle, getByLabelText, getByTestId } = render(
          <QuestionnairesView {...props} />
        );
        const deleteButton = getAllByTitle("Delete")[0];
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

        const {
          getByText,
          getByTitle,
          getAllByTitle,
          getByTestId,
          queryByTestId,
        } = render(
          <QuestionnairesView {...props} questionnaires={questionnaires} />
        );
        const sortTitleButton = getByText("Title");
        fireEvent.click(sortTitleButton);

        // Delete Questionnaire 2
        const deleteButton = getAllByTitle("Delete")[1];
        fireEvent.click(deleteButton);
        const confirmButton = getByTestId("btn-delete-modal");
        fireEvent.click(confirmButton);
        await waitForElementToBeRemoved(() => getByTestId("btn-delete-modal"));

        expect(queryByTestId("btn-delete-modal")).toBeNull();

        expect(getByTitle("Questionnaire 3")).toHaveFocus();
      });

      it("should not re-focus the row after switching page", async () => {
        const questionnaires = new Array(18)
          .fill(null)
          .map((_, index) => buildQuestionnaire(index));

        const {
          getByText,
          getAllByTitle,
          getByTestId,
          rerender,
          getAllByTestId,
        } = render(
          <QuestionnairesView {...props} questionnaires={questionnaires} />
        );

        // Move to page 2
        const nextButton = getByText("Go to next page");
        fireEvent.click(nextButton);
        expect(getByText("Showing 2 of 18")).toBeTruthy();

        // Delete the last one on the page - the other one is focused
        const deleteButton = getAllByTitle("Delete")[1];
        fireEvent.click(deleteButton);
        const confirmButton = getByTestId("btn-delete-modal");
        fireEvent.click(confirmButton);

        rerender(
          <QuestionnairesView
            {...props}
            questionnaires={questionnaires.slice(0, 17)}
          />
        );
        expect(document.activeElement).not.toEqual(document.body);

        const previousButton = getByText("Go to previous page");
        fireEvent.click(previousButton);
        expect(getByText("Showing 16 of 17")).toBeTruthy();

        fireEvent.click(nextButton);
        expect(getByText("Showing 1 of 17")).toBeTruthy();

        expect(document.activeElement).not.toEqual(
          getAllByTestId("anchor-questionnaire-title")[0]
        );
      });

      it("should not re-focus the row after switching order", () => {
        const questionnaires = new Array(18)
          .fill(null)
          .map((_, index) => buildQuestionnaire(index));

        const { getByText, getAllByTitle, getByTestId, rerender } = render(
          <QuestionnairesView {...props} questionnaires={questionnaires} />
        );

        // Move to page 2
        const nextButton = getByText("Go to next page");
        fireEvent.click(nextButton);
        expect(getByText("Showing 2 of 18")).toBeTruthy();

        // Delete the last one on the page - the other one is focused
        const deleteButton = getAllByTitle("Delete")[1];
        fireEvent.click(deleteButton);
        const confirmButton = getByTestId("btn-delete-modal");
        fireEvent.click(confirmButton);

        rerender(
          <QuestionnairesView
            {...props}
            questionnaires={questionnaires.slice(0, 17)}
          />
        );

        expect(document.activeElement).not.toEqual(document.body);
      });

      it("should not re-focus the row after applying search", () => {
        jest.useFakeTimers();

        const {
          getAllByTitle,
          getByTestId,
          getByLabelText,
          queryByText,
          rerender,
        } = render(<QuestionnairesView {...props} />);

        // Delete the last one on the page - the other one is focused
        const deleteButton = getAllByTitle("Delete")[0];
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
        props.questionnaires = props.questionnaires.slice(0, 1).map((q) => ({
          ...q,
          permission: READ,
        }));
        const { getByTitle, queryByTestId, getByLabelText, getByText } = render(
          <QuestionnairesView {...props} />
        );

        fireEvent.click(getByLabelText("All"));
        expect(getByText("Questionnaire 1 Title")).toBeTruthy();

        const deleteButton = getByTitle("Delete");
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

      it("should show 16 results on each page", () => {
        const { getByText, queryByText, container } = render(
          <QuestionnairesView {...props} />
        );

        expect(getByText("Showing 16 of 18")).toBeTruthy();
        expect(getByText("1 of 2")).toBeTruthy();
        // Header is a row as well
        expect(container.querySelectorAll("tr")).toHaveLength(16 + 1);
        expect(queryByText("Questionnaire 16 Title")).toBeFalsy();
      });

      it("should navigate forward", () => {
        const { container, getByText, queryByText } = render(
          <QuestionnairesView {...props} />
        );

        const nextButton = getByText("Go to next page");
        fireEvent.click(nextButton);

        expect(getByText("Showing 2 of 18")).toBeTruthy();
        expect(getByText("2 of 2")).toBeTruthy();

        expect(container.querySelectorAll("tr")).toHaveLength(2 + 1);
        expect(queryByText("Questionnaire 16 Title")).toBeTruthy();
      });

      it("should navigate backwards", () => {
        const { getByText } = render(<QuestionnairesView {...props} />);

        const nextButton = getByText("Go to next page");
        fireEvent.click(nextButton);

        expect(getByText("2 of 2")).toBeTruthy();

        const previousPage = getByText("Go to previous page");
        fireEvent.click(previousPage);

        expect(getByText("1 of 2")).toBeTruthy();
      });

      it("should be impossible to navigate to a page before the first one", () => {
        const { getByText } = render(<QuestionnairesView {...props} />);

        expect(getByText("1 of 2")).toBeTruthy();

        const previousPage = getByText("Go to previous page");
        fireEvent.click(previousPage);

        expect(getByText("1 of 2")).toBeTruthy();
      });

      it("should be impossible to navigate to a page after the last one", () => {
        const { getByText } = render(<QuestionnairesView {...props} />);

        const nextButton = getByText("Go to next page");
        fireEvent.click(nextButton);

        expect(getByText("2 of 2")).toBeTruthy();

        fireEvent.click(nextButton);

        expect(getByText("2 of 2")).toBeTruthy();
      });

      it("should start on the page left last time", () => {
        const { getByText, queryByText, unmount } = render(
          <QuestionnairesView {...props} />
        );

        expect(getByText("1 of 2")).toBeTruthy();

        const nextButton = getByText("Go to next page");
        fireEvent.click(nextButton);

        expect(getByText("2 of 2")).toBeTruthy();

        unmount();

        expect(queryByText("2 of 2")).toBeFalsy();

        const { getByText: getByTextNewRender } = render(
          <QuestionnairesView {...props} />
        );

        expect(getByTextNewRender("2 of 2")).toBeTruthy();
      });

      it("should handle out of date local storage", () => {
        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ currentPageIndex: 1000 })
        );
        const { getByText } = render(<QuestionnairesView {...props} />);

        expect(getByText("2 of 2")).toBeTruthy();
      });
    });

    describe("Sorting", () => {
      const getRowTitleAtIndex = (getAllByTestId, index) =>
        getAllByTestId("table-row")[index].children[0].textContent;

      beforeEach(() => {
        props.questionnaires = [
          buildQuestionnaire(4, { createdAt: "2019-05-10T12:36:50.984Z" }),
          buildQuestionnaire(2, { createdAt: "2019-05-09T12:36:50.984Z" }),
          buildQuestionnaire(1, { createdAt: "2019-05-11T12:36:50.984Z" }),
          buildQuestionnaire(3, { createdAt: "2019-05-08T12:36:50.984Z" }),
          buildQuestionnaire(5, { createdAt: "2019-05-12T12:36:50.984Z" }),
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

      it("should sort by title descending when title header is clicked twice", () => {
        const { getByTestId, getAllByTestId } = render(
          <QuestionnairesView {...props} />
        );

        const sortTitleButton = getByTestId("title-sort-button");
        fireEvent.click(sortTitleButton);
        fireEvent.click(sortTitleButton);

        for (let index = 0, reverseNum = 5; index < 5; index++, reverseNum--) {
          expect(getRowTitleAtIndex(getAllByTestId, index)).toEqual(
            `Questionnaire ${reverseNum} Title`
          );
        }
      });

      it("should sort across multiple pages", () => {
        const questionnaires = new Array(17)
          .fill("")
          .map((_, index) => buildQuestionnaire(index));

        const { getByText, queryByText } = render(
          <QuestionnairesView {...props} questionnaires={questionnaires} />
        );

        const sortTitleButton = getByText("Title");
        fireEvent.click(sortTitleButton);
        // 9 is on the second page as it is sorted alphabetically, so 1,10,...16,2,3
        expect(queryByText("Questionnaire 9 Title")).toBeFalsy();

        fireEvent.click(sortTitleButton);
        expect(queryByText("Questionnaire 9 Title")).toBeTruthy();
      });

      it("should start with the sort order left last time", () => {
        const { getByText, getAllByTestId, unmount } = render(
          <QuestionnairesView {...props} />
        );

        const sortTitleButton = getByText("Title");
        fireEvent.click(sortTitleButton);
        expect(getRowTitleAtIndex(getAllByTestId, 0)).toEqual(
          "Questionnaire 1 Title"
        );
        fireEvent.click(sortTitleButton);

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

        const showAllButton = getByLabelText("All");

        fireEvent.click(showAllButton);

        const search = getByLabelText("Search");
        fireEvent.change(search, {
          target: { value: "not in any questionnaire" },
        });
        act(() => {
          jest.runAllTimers();
        });

        expect(
          queryByText("No results found for 'not in any questionnaire'")
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

        expect(getByText("2 of 2")).toBeTruthy();

        const search = getByLabelText("Search");
        fireEvent.change(search, {
          target: { value: "Questionnaire" },
        });
        act(() => {
          jest.runAllTimers();
        });

        expect(getByText("1 of 2")).toBeTruthy();
      });
    });
    describe("Filtering", () => {
      it("starts with read only filtered out and correctly toggles between all and editable lists", () => {
        const questionnaires = [
          buildQuestionnaire(1, {
            permission: WRITE,
          }),
          buildQuestionnaire(2, {
            permission: READ,
          }),
          buildQuestionnaire(3, {
            permission: READ,
          }),
        ];

        const { getByLabelText, queryByText } = render(
          <QuestionnairesView {...props} questionnaires={questionnaires} />
        );

        const showAllButton = getByLabelText("All");
        const showOnlyEditable = getByLabelText("Editor");

        expect(queryByText("Questionnaire 1 Title")).toBeTruthy();
        expect(queryByText("Questionnaire 2 Title")).toBeFalsy();
        expect(queryByText("Questionnaire 3 Title")).toBeFalsy();

        fireEvent.click(showAllButton);

        expect(queryByText("Questionnaire 1 Title")).toBeTruthy();
        expect(queryByText("Questionnaire 2 Title")).toBeTruthy();
        expect(queryByText("Questionnaire 3 Title")).toBeTruthy();

        fireEvent.click(showOnlyEditable);

        expect(queryByText("Questionnaire 1 Title")).toBeTruthy();
        expect(queryByText("Questionnaire 2 Title")).toBeFalsy();
        expect(queryByText("Questionnaire 3 Title")).toBeFalsy();
      });

      it("should render correct error when no owned questionnaires", () => {
        props.questionnaires = [
          buildQuestionnaire(1, {
            permission: READ,
          }),
        ];

        const { queryByText } = render(
          <QuestionnairesView
            {...props}
            questionnaires={props.questionnaires}
          />
        );

        expect(
          queryByText("You do not have editor access to any questionnaires")
        ).toBeTruthy();
      });

      it("should render correct error when no owned questionnaires match a search term", () => {
        props.questionnaires = [
          buildQuestionnaire(1, {
            permission: WRITE,
          }),
        ];

        const { queryByText, getByLabelText } = render(
          <QuestionnairesView
            {...props}
            questionnaires={props.questionnaires}
          />
        );

        const search = getByLabelText("Search");
        fireEvent.change(search, {
          target: { value: "not in any questionnaire" },
        });

        expect(
          queryByText(
            "You do not have editor access to any questionnaires matching this criteria"
          )
        ).toBeTruthy();
      });
    });
  });
});
