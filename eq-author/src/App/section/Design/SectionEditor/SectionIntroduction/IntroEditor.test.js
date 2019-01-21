import React from "react";
import { shallow } from "enzyme";
import { UnwrappedIntroEditor } from "./IntroEditor";
import IconButtonDelete from "components/buttons/IconButtonDelete";
import RichTextEditor from "components/RichTextEditor";

describe("IntroEditor", () => {
  let defaultProps;

  beforeEach(() => {
    defaultProps = {
      sectionIntro: {
        id: "1",
        introductionTitle: "foo",
        introductionContent: "bar",
      },
      createSectionIntro: jest.fn(),
      onUpdate: jest.fn(),
      onChange: jest.fn(),
      deleteSectionIntro: jest.fn(),
      onChangeUpdate: jest.fn(),
    };
  });

  it("should render the editor", () => {
    const wrapper = shallow(<UnwrappedIntroEditor {...defaultProps} />);

    expect(wrapper).toMatchSnapshot();
  });

  it("should call deleteSectionIntro on delete click", () => {
    const wrapper = shallow(<UnwrappedIntroEditor {...defaultProps} />);

    wrapper.find(IconButtonDelete).simulate("click");

    expect(defaultProps.deleteSectionIntro).toHaveBeenCalledWith(
      defaultProps.sectionIntro
    );
  });

  it("should call handleUpdate on blur", () => {
    const wrapper = shallow(<UnwrappedIntroEditor {...defaultProps} />);
    const editors = wrapper.find(RichTextEditor);
    expect(editors.length).toEqual(2);

    editors.forEach((rte, i) => {
      const change = { value: `<p>${i}</p>` };
      rte.simulate("update", change);

      expect(defaultProps.onChangeUpdate).toHaveBeenCalledWith(change);
    });
  });
});
