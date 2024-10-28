import React from "react";
import { render } from "tests/utils/rtl";
import { useMutation } from "@apollo/react-hooks";
import QcodesPage from "./QcodesPage";
import { QCodeContextProvider } from "components/QCodeContext";
import { buildQuestionnaire } from "tests/utils/createMockQuestionnaire";
import Theme from "contexts/themeContext";

jest.mock("@apollo/react-hooks", () => ({
  useMutation: jest.fn(),
  useSubscription: jest.fn(),
}));

useMutation.mockImplementation(jest.fn(() => [jest.fn()]));

describe("Qcodes Page", () => {
  const questionnaire = buildQuestionnaire({ answerCount: 1 });
  const renderQcodesPage = (component) =>
    render(
      <QCodeContextProvider questionnaire={questionnaire}>
        <Theme>{component}</Theme>
      </QCodeContextProvider>
    );
  it("should render Qcodes page", () => {
    const { getByTestId } = renderQcodesPage(<QcodesPage />);
    expect(getByTestId("qcodes-page-container")).toBeInTheDocument();
  });
});
