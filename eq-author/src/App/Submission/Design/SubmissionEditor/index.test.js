import React from "react";
import { render } from "tests/utils/rtl";

import SubmissionEditor from ".";

const questionnaire = {
  id: "questionnaire-1",
  submission: {
    id: "submission-1",
  },
};

const { submission } = questionnaire;

const renderSubmissionEditor = (props) => {
  return render(<SubmissionEditor props={props} />);
};

describe("Submission Editor", () => {
  let props;

  beforeEach(() => {
    props = {
      submission,
    };
  });

  it("should render", () => {
    const getByTestId = renderSubmissionEditor(props);

    expect(getByTestId("submission-editor")).toBeVisible();
  });
});
