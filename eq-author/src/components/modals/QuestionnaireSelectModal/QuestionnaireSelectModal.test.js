import React from "react";
import { render } from "tests/utils/rtl";

import QuestionnaireSelectModal from "./";

describe("Questionnaire Select Modal", () => {
  let props, isOpen, onClose, children;

  beforeEach(() => {
    isOpen = true;
    children = <div>This is the child component</div>;
    onClose = jest.fn();
    props = { isOpen, onClose };
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
