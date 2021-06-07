import React from "react";
import { render, } from "tests/utils/rtl";

import QuestionnaireSelectModal from "./";

describe("Questionnaire Select Modal", () => {
  let onClose, onSubmit, props, searchBar, accessFilter, children;

  beforeEach(() => {
    onClose = jest.fn();
    onSubmit = jest.fn();
    searchBar = <div>This is the search component</div>;
    accessFilter = <div>This is the accessFilter component</div>;
    children = <div>This is the child component</div>;

    props = { searchBar, accessFilter };
  });

  const renderModal = () =>
    render(
        <QuestionnaireSelectModal {...props} >
            {children}
        </QuestionnaireSelectModal>
    );

    it("should render", async () => {
        const { getByTestId } = renderModal();
        
        expect(getByTestId("questionnaire-select-modal")).toBeInTheDocument();
    });

    it("it should render the children", async () => {
        const { getByText } = renderModal();
        
        expect(getByText("This is the child component")).toBeInTheDocument();
    });

    it("it should render a searchBar component", async () => {
        const { getByText } = renderModal();
        
        expect(getByText("This is the search component")).toBeInTheDocument();
    });

    it("it should render a accessFilter component", async () => {
        const { getByText } = renderModal();
        
        expect(getByText("This is the accessFilter component")).toBeInTheDocument();
    });

});