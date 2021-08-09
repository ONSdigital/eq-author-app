import React from "react";
import { render } from "tests/utils/rtl";

import QuestionnaireSelectModal from "./";

describe("Questionnaire Select Modal", () => {
  let props, isOpen, children;

  beforeEach(() => {
    isOpen = true;
    children = <div>This is the child component</div>;

    props = { isOpen };
  });

  const renderModal = () =>
    render(
      <QuestionnaireSelectModal {...props}>{children}</QuestionnaireSelectModal>
    );

  it("should render", async () => {
    const { getByTestId } = renderModal();

    expect(getByTestId("questionnaire-select-modal")).toBeInTheDocument();
  });
});
