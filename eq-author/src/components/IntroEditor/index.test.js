import React from "react";
import { shallow } from "enzyme";
import { UnwrappedIntroEditor, ENABLE_INTRO } from "./index";
import RichTextEditor from "components/RichTextEditor";

describe("Intro Editor", () => {
  let handleUpdate;
  let handleChange;
  let handleDelete;
  let section;

  beforeEach(() => {
    handleUpdate = jest.fn();
    handleChange = jest.fn();
    handleDelete = jest.fn();
    section = {
      id: "1",
      introductionTitle: "Foo",
      introductionContent: "Bar",
      introductionEnabled: true
    };
  });

  it("should render section disabled", () => {
    Object.assign(section, {
      introductionTitle: null,
      introductionContent: null,
      introductionEnabled: false
    });

    const wrapper = shallow(
      <UnwrappedIntroEditor
        section={section}
        onUpdate={handleUpdate}
        onChange={handleChange}
        onDeleteSectionIntro={handleDelete}
      />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it("should render section enabled", () => {
    const wrapper = shallow(
      <UnwrappedIntroEditor
        section={section}
        onUpdate={handleUpdate}
        onChange={handleChange}
        onDeleteSectionIntro={handleDelete}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("clicking add introduction should call handle change with correct parameters", () => {
    Object.assign(section, {
      introductionTitle: null,
      introductionContent: null,
      introductionEnabled: false
    });

    const wrapper = shallow(
      <UnwrappedIntroEditor
        section={section}
        onUpdate={handleUpdate}
        onChange={handleChange}
        onDeleteSectionIntro={handleDelete}
      />
    );

    wrapper.find('[data-test="btn-add-intro"]').simulate("click");
    expect(handleChange).toHaveBeenCalledWith(ENABLE_INTRO, handleUpdate);
  });

  it("should call handleUpdate on blur", () => {
    const wrapper = shallow(
      <UnwrappedIntroEditor
        section={section}
        onUpdate={handleUpdate}
        onChange={handleChange}
        onDeleteSectionIntro={handleDelete}
      />
    );
    const editors = wrapper.find(RichTextEditor);
    expect(editors.length).toEqual(2);

    editors.forEach((rte, i) => {
      const change = { value: `<p>${i}</p>` };
      rte.simulate("update", change);

      expect(handleChange).toHaveBeenLastCalledWith(change, handleUpdate);
    });
  });

  it("clicking delete button should call ondelete", () => {
    const wrapper = shallow(
      <UnwrappedIntroEditor
        section={section}
        onUpdate={handleUpdate}
        onChange={handleChange}
        onDeleteSectionIntro={handleDelete}
      />
    );
    wrapper
      .find('[data-test="btn-delete"]')
      .first()
      .simulate("click");
    expect(handleDelete).toHaveBeenLastCalledWith({
      id: "1",
      introductionContent: "Bar",
      introductionEnabled: true,
      introductionTitle: "Foo"
    });
  });
});
