import React from "react";
import { shallow } from "enzyme";
import { UnwrappedSectionIntroduction, AddIntroButton } from "./";
import IntroEditor from "./IntroEditor";

describe("SectionIntroduction", () => {
  let defaultProps;

  beforeEach(() => {
    defaultProps = {
      sectionId: "1",
      sectionIntro: {
        id: "1",
        introductionTitle: "foo",
        introductionContent: "bar",
      },
      createSectionIntro: jest.fn(),
    };
  });

  it("should render section disabled", () => {
    defaultProps.sectionIntro = null;

    const wrapper = shallow(<UnwrappedSectionIntroduction {...defaultProps} />);

    expect(wrapper.find(AddIntroButton).exists()).toBeTruthy();
  });

  it("should render section enabled", () => {
    const wrapper = shallow(<UnwrappedSectionIntroduction {...defaultProps} />);

    expect(wrapper.find(IntroEditor).exists()).toBeTruthy();
  });

  it("clicking add introduction should call createSectionIntro with correct parameters", () => {
    defaultProps.sectionIntro = null;

    const wrapper = shallow(<UnwrappedSectionIntroduction {...defaultProps} />);

    wrapper.find('[data-test="btn-add-intro"]').simulate("click");
    expect(defaultProps.createSectionIntro).toHaveBeenCalledWith(
      defaultProps.sectionId
    );
  });
});
