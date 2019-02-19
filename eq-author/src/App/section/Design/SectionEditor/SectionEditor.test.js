import React from "react";
import { shallow } from "enzyme";
import SectionEditor from "App/section/Design/SectionEditor";
import RichTextEditor from "components/RichTextEditor";

describe("SectionEditor", () => {
  const section1 = {
    id: "section-1",
    title: "Section 1",
    alias: "alias",
    introductionTitle: "Intro title",
    introductionContent: "Intro content",
    questionnaire: {
      id: "2",
      navigation: true,
    },
  };

  const section2 = {
    id: "section-2",
    title: "Section 2",
    alias: "alias",
    introductionTitle: "Intro title",
    introductionContent: "Intro content",
    questionnaire: {
      id: "2",
      navigation: true,
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

  it("should show the section title when navigation is enabled", () => {
    const section = {
      ...section1,
      questionnaire: {
        id: "2",
        navigation: true,
      },
    };
    const wrapper = render({ section });
    expect(wrapper.find("[testSelector='txt-section-title']").length).toEqual(
      1
    );
  });

  it("should not show the section title when navigation is disabled", () => {
    const section = {
      ...section1,
      questionnaire: {
        id: "2",
        navigation: false,
      },
    };
    const wrapper = render({ section });
    expect(wrapper.find("[testSelector='txt-section-title']").length).toEqual(
      0
    );
  });

  it("should not autofocus the section title when its empty and navigation has just been turned on", () => {
    const wrapper = render({
      section: {
        ...section1,
        title: "",
        questionnaire: {
          id: "2",
          navigation: false,
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
        },
      },
    });

    expect(
      wrapper.find("[testSelector='txt-section-title']").prop("autoFocus")
    ).toBe(false);
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
