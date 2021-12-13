import React from "react";
import { shallow } from "enzyme";
import { render as rtlRender } from "tests/utils/rtl";

import { SectionEditor } from "App/section/Design/SectionEditor";
import RichTextEditor from "components/RichTextEditor";
import { sectionErrors } from "constants/validationMessages";

describe("SectionEditor", () => {
  const section1 = {
    id: "section-1",
    title: "Section 1",
    alias: "alias",
    introductionTitle: "Intro title",
    introductionContent: "Intro content",
    requiredCompleted: true,
    showOnHub: true,
    sectionSummary: false,
    collapsibleSummary: false,
    questionnaire: {
      id: "2",
      navigation: true,
      hub: false,
      collapsibleSummary: false,
    },
    validationErrorInfo: {
      id: "3",
      totalCount: 0,
      errors: [],
    },
  };

  const section2 = {
    id: "section-2",
    title: "Section 2",
    alias: "alias",
    introductionTitle: "Intro title",
    introductionContent: "Intro content",
    requiredCompleted: true,
    showOnHub: true,
    sectionSummary: false,
    collapsibleSummary: false,
    questionnaire: {
      id: "2",
      navigation: true,
      hub: false,
      collapsibleSummary: false,
    },
    validationErrorInfo: {
      id: "3",
      totalCount: 0,
      errors: [],
    },
  };

  const match = {
    params: {
      questionnaireId: "1",
      sectionId: "2",
      pageId: "3",
    },
  };

  const mockHandlers = {
    onChange: jest.fn(),
    onUpdate: jest.fn(),
    onDeleteSectionConfirm: jest.fn(),
    onCloseDeleteConfirmDialog: jest.fn(),
    onMoveSectionDialog: jest.fn(),
    onCloseMoveSectionDialog: jest.fn(),
    getValidationError: jest.fn(),
  };

  const render = ({ ...props }) =>
    shallow(
      <SectionEditor
        section={section1}
        showDeleteConfirmDialog={false}
        showMoveSectionDialog={false}
        match={match}
        {...mockHandlers}
        {...props}
      />
    );

  it("should render", () => {
    const wrapper = render();
    expect(wrapper).toMatchSnapshot();
    wrapper.setProps({ section: section2 });
    expect(wrapper).toMatchSnapshot();
  });

  it("should invoke change and update callbacks onUpdate", () => {
    const wrapper = render();
    const editors = wrapper.find(RichTextEditor);
    expect(editors.length).toBeGreaterThan(0);

    editors.forEach((rte, i) => {
      const change = { name: "title", value: `<p>${i}</p>` };
      rte.simulate("update", change);

      expect(mockHandlers.onChange).toHaveBeenLastCalledWith(
        change,
        mockHandlers.onUpdate
      );
    });
  });

  it("should enable the section title when navigation is enabled", () => {
    const section = {
      ...section1,
      questionnaire: {
        id: "2",
        navigation: true,
        hub: false,
      },
    };
    const wrapper = render({ section });
    expect(wrapper.find(RichTextEditor).first().prop("disabled")).toEqual(
      false
    );
  });

  it("should enable the section title when Hub is enabled", () => {
    const section = {
      ...section1,
      questionnaire: {
        id: "2",
        navigation: false,
        hub: true,
      },
    };
    const wrapper = render({ section });
    expect(wrapper.find(RichTextEditor).first().prop("disabled")).toEqual(
      false
    );
  });

  it("should enable the section title when Collapsible sections is enabled and hub is disabled", () => {
    const section = {
      ...section1,
      title: "",
      questionnaire: {
        id: "2",
        navigation: false,
        hub: false,
        collapsibleSummary: true,
      },
    };
    const getValidationError = jest.fn().mockReturnValue("Validation error");

    const wrapper = render({ section, getValidationError });
    expect(wrapper.find(RichTextEditor).first().prop("disabled")).toEqual(
      false
    );
  });

  it("should validate the section title when Collapsible sections is enabled and hub is disabled", () => {
    const section = {
      ...section1,
      title: "",
      questionnaire: {
        id: "2",
        navigation: false,
        hub: false,
        collapsibleSummary: true,
      },
    };
    const getValidationError = jest.fn().mockReturnValue("Validation error");

    const wrapper = render({ section, getValidationError });

    expect(
      wrapper
        .find("[testSelector='txt-section-title']")
        .prop("errorValidationMsg")
    ).toBe("Validation error");

    expect(getValidationError).toHaveBeenCalledWith({
      field: "title",
      message: sectionErrors.SECTION_TITLE_NOT_ENTERED,
    });
  });

  it("should validate the section title when sectionSummary is enabled", () => {
    const section = {
      ...section1,
      requiredCompleted: false,
      showOnHub: false,
      sectionSummary: true,
      questionnaire: {
        id: "2",
        navigation: false,
        hub: false,
        collapsibleSummary: false,
      },
    };
    const getValidationError = jest.fn().mockReturnValue("Validation error");

    const wrapper = render({ section, getValidationError });

    expect(
      wrapper
        .find("[testSelector='txt-section-title']")
        .prop("errorValidationMsg")
    ).toBe("Validation error");

    expect(getValidationError).toHaveBeenCalledWith({
      field: "title",
      message: sectionErrors.SECTION_TITLE_NOT_ENTERED,
    });
  });

  it("should enable the hub settings collapsible section when Hub is enabled", () => {
    const section = {
      ...section1,
      questionnaire: {
        id: "2",
        navigation: false,
        hub: true,
      },
    };
    const { getByText } = rtlRender(() => (
      <SectionEditor
        section={section}
        showDeleteConfirmDialog={false}
        showMoveSectionDialog={false}
        match={match}
        {...mockHandlers}
      />
    ));

    expect(getByText("Hub settings")).toBeVisible();
  });

  it("should display the hub settings collapsible section as OPEN when requiredCompleted is true", () => {
    const section = {
      ...section1,
      questionnaire: {
        id: "2",
        navigation: false,
        hub: true,
      },
    };
    const { getByTestId } = rtlRender(() => (
      <SectionEditor
        section={section}
        showDeleteConfirmDialog={false}
        showMoveSectionDialog={false}
        match={match}
        {...mockHandlers}
      />
    ));

    expect(getByTestId("collapsible-body")).toBeVisible();
  });

  it("should not autofocus the section title when its empty and navigation has just been turned on", () => {
    const wrapper = render({
      section: {
        ...section1,
        title: "",
        questionnaire: {
          id: "2",
          navigation: false,
          hub: false,
        },
      },
    });

    wrapper.setProps({
      section: {
        ...section1,
        title: "",
        questionnaire: {
          id: "2",
          navigation: true,
          hub: false,
        },
      },
    });

    expect(
      wrapper.find("[testSelector='txt-section-title']").prop("autoFocus")
    ).toBe(false);
  });

  it("should show an error when there is a validation error", () => {
    const getValidationError = jest.fn().mockReturnValue("Validation error");
    const wrapper = render({
      section: {
        ...section1,
        title: "",
      },
      getValidationError,
    });
    expect(
      wrapper
        .find("[testSelector='txt-section-title']")
        .prop("errorValidationMsg")
    ).toBe("Validation error");

    expect(getValidationError).toHaveBeenCalledWith({
      field: "title",
      message: sectionErrors.SECTION_TITLE_NOT_ENTERED,
    });
  });

  describe("DeleteConfirmDialog", () => {
    let deleteConfirmDialog;
    let wrapper;

    beforeEach(() => {
      wrapper = render({ showDeleteConfirmDialog: true });
      deleteConfirmDialog = wrapper.find("DeleteConfirmDialog");
    });

    it("should display delete confirm dialog", () => {
      expect(deleteConfirmDialog.props().isOpen).toBe(true);
    });

    it("should call handler when confirmed", () => {
      deleteConfirmDialog.simulate("delete");
      expect(mockHandlers.onDeleteSectionConfirm).toHaveBeenCalled();
    });

    it("should call handler when closed", () => {
      deleteConfirmDialog.simulate("close");
      expect(mockHandlers.onCloseDeleteConfirmDialog).toHaveBeenCalled();
    });
  });
});
