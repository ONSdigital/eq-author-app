import React from "react";
import { shallow } from "enzyme";
import { UnwrappedSectionEditor } from "components/SectionEditor";
import RichTextEditor from "components/RichTextEditor";

describe("SectionEditor", () => {
  const section1 = {
    id: "section-1",
    title: "Section 1"
  };

  const section2 = {
    id: "section-2",
    title: "Section 2"
  };

  const match = {
    params: {
      questionnaireId: "1",
      sectionId: "2",
      pageId: "3"
    }
  };

  const mockHandlers = {
    onChange: jest.fn(),
    onUpdate: jest.fn(),
    onDeleteSectionConfirm: jest.fn(),
    onCloseDeleteConfirmDialog: jest.fn(),
    onMoveSectionDialog: jest.fn(),
    onCloseMoveSectionDialog: jest.fn()
  };

  let wrapper;

  const render = ({ ...props }) =>
    shallow(
      <UnwrappedSectionEditor
        section={section1}
        showDeleteConfirmDialog={false}
        showMoveSectionDialog={false}
        match={match}
        {...mockHandlers}
        {...props}
      />
    );

  beforeEach(() => {
    wrapper = render();
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
    wrapper.setProps({ section: section2 });
    expect(wrapper).toMatchSnapshot();
  });

  it("should invoke change and update callbacks onUpdate", () => {
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

  describe("DeleteConfirmDialog", () => {
    let deleteConfirmDialog;

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
