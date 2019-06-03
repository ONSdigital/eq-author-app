import React from "react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { Provider } from "react-redux";
import { render as rtlRender, fireEvent } from "react-testing-library";

import { waitForElementToBeRemoved } from "dom-testing-library";

import QuestionnairesView, { STORAGE_KEY } from "./";

function render(
  ui,
  {
    route = "/",
    history = createMemoryHistory({ initialEntries: [route] }),
    ...renderOptions
  } = {}
) {
  const store = {
    getState: jest.fn(() => ({
      toasts: {},
      saving: { apiDownError: false },
    })),
    subscribe: jest.fn(),
    dispatch: jest.fn(),
  };
  const queries = rtlRender(
    <Provider store={store}>
      <Router history={history}>{ui}</Router>
    </Provider>,
    renderOptions
  );
  return {
    ...queries,
    rerender: ui =>
      queries.rerender(
        <Provider store={store}>
          <Router history={history}>{ui}</Router>
        </Provider>
      ),
    // adding `history` to the returned utilities to allow us
    // to reference it in our tests (just try to avoid using
    // this to test implementation details).
    history,
  };
}

const buildQuestionnaire = index => ({
  id: `questionnaire${index}`,
  displayName: `Questionnaire ${index}`,
  title: `Questionnaire ${index} Title`,
  shortTitle: "",
  createdAt: "2017/01/02",
  updatedAt: "2017/01/03",
  createdBy: {
    id: `user${index}`,
    name: `User #${index}`,
  },
});

describe("QuestionnairesView", () => {
  let props;
  beforeEach(() => {
    const questionnaires = [buildQuestionnaire(1), buildQuestionnaire(2)];
    const user = {
      id: "3",
      name: "Foo",
      email: "foo@bar.com",
      displayName: "Foo",
    };

    props = {
      questionnaires,
      user,
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

      fireEvent.change(getByLabelText("Questionnaire Title"), {
        target: { value: "Questionnaire title" },
      });
      fireEvent.change(getByLabelText("Questionnaire type"), {
        target: { value: "Business" },
      });
      fireEvent.click(getByText("Create"));

      expect(props.onCreateQuestionnaire).toHaveBeenCalled();
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

    it("should allow you to create a questionnaire", () => {
      const { getByText, getByLabelText } = render(
        <QuestionnairesView {...props} />
      );

      const createButton = getByText("Create questionnaire");
      fireEvent.click(createButton);

      fireEvent.change(getByLabelText("Questionnaire Title"), {
        target: { value: "Questionnaire title" },
      });
      fireEvent.change(getByLabelText("Questionnaire type"), {
        target: { value: "Business" },
      });
      fireEvent.click(getByText("Create"));

      expect(props.onCreateQuestionnaire).toHaveBeenCalled();
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

        const deleteButton = getAllByTitle("Delete")[1];
        fireEvent.click(deleteButton);
        const confirmButton = getByTestId("btn-delete-modal");
        fireEvent.click(confirmButton);
        rerender(
          <QuestionnairesView
            {...props}
            questionnaires={props.questionnaires.slice(0, 1)}
          />
        );

        expect(getByTitle("Questionnaire 1")).toEqual(document.activeElement);
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
  });
});
