import React from "react";
import { render } from "tests/utils/rtl";
import Theme from "contexts/themeContext";

import SubmissionEditor from ".";

const questionnaire = {
  id: "questionnaire-1",
  submission: {
    id: "submission-1",
    furtherContent: "<p>Test</p>",
    viewPrintAnswers: true,
    emailConfirmation: true,
    feedback: true,
  },
};

const { submission } = questionnaire;

const renderSubmissionEditor = () => {
  return render(
    <Theme>
      <SubmissionEditor submission={submission} />
    </Theme>
  );
};

describe("Submission Editor", () => {
  it("should render", () => {
    const { getByTestId } = renderSubmissionEditor();
    expect(getByTestId("submission-editor")).toBeVisible();
  });
});
