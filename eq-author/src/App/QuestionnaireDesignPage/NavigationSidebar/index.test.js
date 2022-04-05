import React from "react";
import { render, fireEvent } from "tests/utils/rtl";
import { useParams } from "react-router-dom";
import { MeContext } from "App/MeContext";
import Theme from "contexts/themeContext";

import { buildQuestionnaire } from "tests/utils/createMockQuestionnaire";

import { CalculatedSummaryPage } from "constants/page-types";

import NavigationSidebar from ".";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
}));

useParams.mockImplementation(() => ({ entityId: "1" }));

const props = {
  questionnaire: buildQuestionnaire({ folderCount: 2 }),
};

const user = {
  id: "1",
  name: "Name",
};

const renderNavigationSidebar = (props) => {
  const utils = render(
    <MeContext.Provider value={{ me: user }}>
      <Theme>
        <NavigationSidebar {...props} />
      </Theme>
    </MeContext.Provider>
  );
  return { ...props, ...utils };
};

const defaultSetup = (changes = {}) => {
  const sectionOneID = "Section 1";
  const folderOneID = "Folder 1.1";
  const folderTwoID = "Folder 1.2";
  const pageOneID = "Page 1.1.1";
  const utils = renderNavigationSidebar({ ...props, ...changes });
  return { ...utils, sectionOneID, folderOneID, folderTwoID, pageOneID };
};

const introductionSetup = () => {
  const id = "introduction";
  const introduction = {
    id,
    validationErrorInfo: {
      errors: [],
      totalCount: 0,
    },
  };
  useParams.mockImplementationOnce(() => ({ entityId: id }));
  const questionnaire = buildQuestionnaire({ folderCount: 2 });
  questionnaire.introduction = introduction;
  const utils = defaultSetup({ questionnaire });
  return { ...utils };
};

const calculatedSetup = () => {
  const id = "1.calc.2";
  const calculated = {
    id,
    displayName: "Calculated Summary Page",
    pageId: CalculatedSummaryPage,
    pageType: "CalculatedSummaryPage",
    summaryAnswers: [],
    validationErrorInfo: {
      totalCount: 1,
    },
  };
  useParams.mockImplementation(() => ({ entityId: id }));
  const questionnaire = buildQuestionnaire({ folderCount: 2 });
  const numOfPages = questionnaire.sections[0].folders[1].pages;
  const newPosition = numOfPages.length + 1;
  questionnaire.sections[0].folders[1].pages.push({
    ...calculated,
    position: newPosition,
  });
  const utils = defaultSetup({ questionnaire });
  return { ...utils, id: calculated.id };
};

const confirmationSetup = () => {
  const id = "1.conf.2";
  const confirmation = {
    id,
    displayName: "confirmation question",
    positive: { id: "pos" },
    negative: { id: "neg" },
    validationErrorInfo: {
      totalCount: 0,
    },
  };
  useParams.mockImplementation(() => ({ entityId: id }));
  const questionnaire = buildQuestionnaire({ folderCount: 2 });
  questionnaire.sections[0].folders[1].pages[0].confirmation = confirmation;
  const utils = defaultSetup({ questionnaire });
  return { ...utils };
};

describe("Navigation sidebar", () => {
  it("should render", () => {
    const { getByTestId } = defaultSetup();
    expect(getByTestId("side-nav")).toBeTruthy();
  });

  it("should render nothing if questionnaire is null", () => {
    const { queryByTestId } = defaultSetup({ questionnaire: null });
    expect(queryByTestId("nav-section-header")).toBeNull();
  });

  it("should render sections/folders/pages", () => {
    const {
      getByText,
      queryByText,
      sectionOneID,
      folderOneID,
      folderTwoID,
      pageOneID,
    } = defaultSetup();
    expect(getByText(sectionOneID)).toBeVisible();
    expect(getByText(folderTwoID)).toBeVisible();
    expect(getByText(pageOneID)).toBeVisible();
    expect(queryByText(folderOneID)).toBeVisible();
  });

  it("should default to Close all sections", () => {
    const { getByText } = defaultSetup();
    expect(getByText("Close all sections")).toBeVisible();
  });

  it("should change to Open all sections on click", () => {
    const { getByText, queryByText } = defaultSetup();
    fireEvent.click(getByText("Close all sections"));
    expect(getByText("Open all sections")).toBeVisible();
    expect(queryByText("Close all sections")).toBeNull();
  });

  describe("Calculated summary pages", () => {
    it("should render calculated summary pages", () => {
      const { getByText } = calculatedSetup();
      expect(getByText("Calculated Summary Page")).toBeVisible();
    });

    it("should be disabled when on a calculated summary page", () => {
      const { getByText } = calculatedSetup();
      fireEvent.click(getByText("Calculated Summary Page").parentElement);
      expect(getByText("Calculated Summary Page").parentElement).toHaveClass(
        "activePage"
      );
    });
  });

  describe("Introduction page", () => {
    it("should render an introduction page", () => {
      const { getByText } = introductionSetup();
      expect(getByText("Introduction")).toBeVisible();
    });

    it("should be disabled when on an introduction page", () => {
      const { getByText } = introductionSetup();
      fireEvent.click(getByText("Introduction"));

      expect(getByText("Introduction").parentElement).toHaveClass("activePage");
    });
  });

  describe("Confirmation pages", () => {
    it("should render confirmation pages", () => {
      const { getByText } = confirmationSetup();
      expect(getByText("confirmation question").parentElement).toBeVisible();
    });

    it("should be disabled when on an confirmation pages", async () => {
      const { getByText } = confirmationSetup();
      expect(getByText("confirmation question")).toBeVisible();
      fireEvent.click(getByText("confirmation question"));
      expect(getByText("confirmation question").parentElement).toHaveClass(
        "activePage"
      );
    });
  });
});
