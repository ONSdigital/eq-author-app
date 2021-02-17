import React from "react";
import MovePageModal from ".";
import { shallow } from "enzyme";
import { byTestAttr } from "tests/utils/selectors";
import { buildQuestionnaire } from "tests/utils/createMockQuestionnaire";
import { useQuestionnaire } from "components/QuestionnaireContext";

jest.mock("components/QuestionnaireContext", () => ({
  __esModule: true,
  useQuestionnaire: jest.fn(),
}));

const getSectionModal = (wrapper) =>
  wrapper.find(byTestAttr("section-select-modal"));

const getSectionItem = (wrapper) =>
  wrapper.find(byTestAttr("section-item-select"));

const mockQuestionnaire = buildQuestionnaire({ sectionCount: 2 });
const currentSection = mockQuestionnaire.sections[0];
const currentPage = currentSection.folders[0].pages[0];

useQuestionnaire.mockImplementation(() => ({
  questionnaire: mockQuestionnaire,
}));

describe("MovePageModal", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(
      <MovePageModal
        isOpen
        onClose={jest.fn()}
        sectionId={currentSection.id}
        page={currentPage}
        onMovePage={jest.fn()}
      />
    );
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("opens section select Modals when correct button is clicked", () => {
    wrapper.find("MovePageModal__Trigger").first().simulate("click");

    expect(getSectionModal(wrapper).prop("isOpen")).toBe(true);
  });

  it("should close section select Modals on confirm", () => {
    wrapper.find("MovePageModal__Trigger").simulate("click");

    getSectionModal(wrapper).simulate("confirm", {
      preventDefault: jest.fn(),
    });

    expect(getSectionModal(wrapper).prop("isOpen")).toBe(false);
  });

  it("should update selected section on change", () => {
    const selectedSection = mockQuestionnaire.sections[1];
    getSectionItem(wrapper).simulate("change", {
      value: mockQuestionnaire.sections[1].id,
    });

    expect(wrapper.find("PositionModal").prop("options")).toStrictEqual(
      selectedSection.folders.flatMap(({ pages }) => pages)
    );
  });
});

describe("MovePageModal: questionnaire not loaded", () => {
  it("shouldn't render if questionnaire not yet available", () => {
    useQuestionnaire.mockImplementation(() => ({
      questionnaire: undefined,
    }));

    const wrapper = shallow(
      <MovePageModal
        isOpen
        onClose={jest.fn()}
        sectionId="1"
        page={null}
        onMovePage={jest.fn()}
      />
    );

    expect(wrapper.isEmptyRender()).toBe(true);
  });
});
