import React from "react";
import MovePageModal from ".";
import { shallow } from "enzyme";
import { byTestAttr } from "tests/utils/selectors";
import { buildQuestionnaire } from "tests/utils/createMockQuestionnaire";

const getSectionModal = wrapper =>
  wrapper.find(byTestAttr("section-select-modal"));

const getSectionItem = wrapper =>
  wrapper.find(byTestAttr("section-item-select"));

const getPagePositionModal = wrapper =>
  wrapper.find(byTestAttr("page-position-modal"));

describe("MovePageModal", () => {
  const questionnaire = buildQuestionnaire();
  const currentSection = questionnaire.sections[0];
  const currentPage = currentSection.pages[0];

  const createWrapper = (props = {}, render = shallow) =>
    render(
      <MovePageModal
        isOpen
        onClose={jest.fn()}
        questionnaire={questionnaire}
        sectionId={currentSection.id}
        page={currentPage}
        selectedPosition={0}
        onMovePage={jest.fn()}
        {...props}
      />
    );

  it("should render", () => {
    expect(createWrapper()).toMatchSnapshot();
  });

  it("opens section select modal when correct button is clicked", () => {
    const wrapper = createWrapper();

    wrapper
      .find("MovePageModal__Trigger")
      .first()
      .simulate("click");

    expect(getSectionModal(wrapper).prop("isOpen")).toBe(true);
  });

  it("opens position select modal when correct button is clicked", () => {
    const wrapper = createWrapper();

    getPagePositionModal(wrapper).simulate("click");

    expect(getPagePositionModal(wrapper).prop("isOpen")).toBe(true);
  });

  it("should close section select modal on confirm", () => {
    const wrapper = createWrapper();

    wrapper.find("MovePageModal__Trigger").simulate("click");

    getSectionModal(wrapper).simulate("confirm", {
      preventDefault: jest.fn()
    });

    expect(getSectionModal(wrapper).prop("isOpen")).toBe(false);
  });

  it("should update selected section on change", () => {
    const wrapper = createWrapper();
    const selectedSection = questionnaire.sections[1];

    getSectionItem(wrapper).simulate("change", { value: selectedSection.id });

    expect(wrapper.find("PositionModal").prop("options")).toBe(
      selectedSection.pages
    );
  });
});
