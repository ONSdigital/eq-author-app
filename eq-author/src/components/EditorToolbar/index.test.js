import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitForElementToBeRemoved,
} from "tests/utils/rtl";
import EditorToolbar from "./index";
import {
  buildQuestionnaire,
  buildFolders,
} from "tests/utils/createMockQuestionnaire";
import { useQuestionnaire } from "components/QuestionnaireContext";

jest.mock("components/QuestionnaireContext", () => ({
  __esModule: true,
  useQuestionnaire: jest.fn(),
}));

const mockQuestionnaire = buildQuestionnaire({ sectionCount: 2 });
const mockFolders = buildFolders({ folderCount: 3 }).map((item, index) => {
  item.displayName = `Folder ${index + 1}`;
  return item;
});
const currentSection = mockQuestionnaire.sections[0];
currentSection.folders = mockFolders;

useQuestionnaire.mockImplementation(() => ({
  questionnaire: mockQuestionnaire,
}));

const folder = buildFolders({ folderCount: 2 });
folder.section = { id: "1" };

const deleteDialogText =
  "All questions in this folder will also be removed. This may affect piping and routing rules elsewhere.";

describe("EditorToolbar", () => {
  function setup(props) {
    const shortCodeOnUpdate = jest.fn();
    const onMove = jest.fn();
    const onDuplicate = jest.fn();
    const onDelete = jest.fn();
    render(
      <EditorToolbar
        shortCode={"Hello"}
        title={"Title"}
        pageType={"folder"}
        shortCodeOnUpdate={shortCodeOnUpdate}
        onMove={onMove}
        onDuplicate={onDuplicate}
        onDelete={onDelete}
        disableMove={false}
        disableDuplicate={false}
        disableDelete={false}
        data={folder[0]}
        {...props}
      />
    );
    return { shortCodeOnUpdate, onMove, onDuplicate, onDelete };
  }

  beforeEach(() => setup());

  it("should render", () => {
    expect(screen.getByTestId("btn-move-folder")).toBeInTheDocument();
    expect(screen.getByTestId("btn-duplicate-folder")).toBeInTheDocument();
    expect(screen.getByTestId("btn-delete-folder")).toBeInTheDocument();
  });

  it("should open delete dialog", async () => {
    expect(screen.queryByText(deleteDialogText)).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId("btn-delete-folder"));

    expect(screen.queryByText(deleteDialogText)).toBeInTheDocument();
  });

  it("should close delete dialog", async () => {
    fireEvent.click(screen.getByTestId("btn-delete-folder"));

    fireEvent.click(screen.getByTestId("btn-cancel-modal"));

    await waitForElementToBeRemoved(() => screen.queryByText(deleteDialogText));

    expect(screen.queryByText(deleteDialogText)).not.toBeInTheDocument();
  });

  it("should open move dialog", async () => {
    expect(screen.queryByText("Move folder")).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId("btn-move-folder"));

    expect(screen.queryByText("Move folder")).toBeInTheDocument();
  });

  it("should close move dialog", async () => {
    fireEvent.click(screen.getByTestId("btn-move-folder"));

    expect(screen.queryByText("Move folder")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("move-modal").children[0]);

    await waitForElementToBeRemoved(() => screen.queryByText("Move folder"));

    expect(screen.queryByText("Move folder")).not.toBeInTheDocument();
  });
});
