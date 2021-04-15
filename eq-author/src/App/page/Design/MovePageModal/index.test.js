import React from "react";
import MovePageModal, { buildPageList } from ".";
import { shallow } from "enzyme";
import { byTestAttr } from "tests/utils/selectors";
import { buildQuestionnaire } from "tests/utils/createMockQuestionnaire";
import { useQuestionnaire } from "components/QuestionnaireContext";

jest.mock("components/QuestionnaireContext", () => ({
  __esModule: true,
  useQuestionnaire: jest.fn(),
}));

jest.mock("components/PositionModal");

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

  it("should close section select Modals on close", () => {
    wrapper.find("MovePageModal__Trigger").simulate("click");

    expect(getSectionModal(wrapper).prop("isOpen")).toBe(true);

    getSectionModal(wrapper).simulate("close");

    expect(getSectionModal(wrapper).prop("isOpen")).toBe(false);
  });

  it("should update selected section on change", () => {
    const selectedSection = mockQuestionnaire.sections[1];
    getSectionItem(wrapper).simulate("change", {
      value: mockQuestionnaire.sections[1].id,
    });

    expect(wrapper.find("PositionModal").prop("options")).toMatchObject(
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
describe("MovePageModal: buildPageList", () => {
  let output, folders;

  beforeEach(() => {
    folders = [
      {
        id: "folder-1",
        enabled: true,
        position: 0,
        __typename: "Folder",
        pages: [
          {
            id: "folder-1-page-1",
            position: 0,
          },
          {
            id: "folder-1-page-2",
            position: 1,
          },
        ],
      },
      {
        id: "folder-2",
        enabled: false,
        position: 1,
        pages: [
          {
            id: "folder-2-page-1",
            position: 2,
          },
        ],
      },
    ];
    output = buildPageList(folders);
  });

  it("should include enabled folders in output", () => {
    expect(
      output.filter(({ __typename }) => __typename === "Folder")[0]
    ).toMatchObject({
      __typename: "Folder",
      parentEnabled: false,
      enabled: true,
    });
  });

  it("should not included disabled folders in output", () => {
    expect(
      output.filter(({ enabled, type }) => !enabled && type === "Folder")
    ).toHaveLength(0);
  });

  it("should include parent details on enabled folders", () => {
    expect(output.filter(({ id }) => id.startsWith("folder-1-page"))).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          parentEnabled: true,
          parentId: output[0].id,
          position: expect.any(Number),
        }),
      ])
    );
  });

  it("should have null parentId for disabled folders", () => {
    const [target] = output.filter(({ id }) => id.includes("folder-2"));
    expect(target.parentId).toBeNull();
  });
});
