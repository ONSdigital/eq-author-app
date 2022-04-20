import { useContext } from "react";

import {
  defaultCallbacks,
  useSetNavigationCallbacksForPage,
  useNavigationCallbacks,
  useSetNavigationCallbacks,
} from "components/NavigationCallbacks";

import {
  useCreateQuestionPage,
  useCreateCalculatedSummaryPage,
} from "hooks/useCreateQuestionPage";
import { useCreateFolder } from "hooks/useCreateFolder";

jest.mock("hooks/useCreateQuestionPage", () => ({
  useCreateQuestionPage: jest.fn(),
  useCreateCalculatedSummaryPage: jest.fn(),
  useCreateListCollectorPage: jest.fn(),
}));

jest.mock("hooks/useCreateFolder", () => ({
  useCreatePageWithFolder: jest.fn(),
  useCreateFolder: jest.fn(),
}));

jest.mock("react", () => ({
  createContext: jest.fn(),
  useContext: jest.fn(),
  useEffect: jest.fn((x) => x()),
}));

describe("Navigation callbacks", () => {
  afterEach(() => jest.clearAllMocks());

  it("should throw an error when undefined callbacks used", () => {
    expect(() => defaultCallbacks.onAddQuestionPage()).toThrow();
    expect(() => defaultCallbacks.onAddCalculatedSummaryPage()).toThrow();
    expect(() => defaultCallbacks.onAddFolder()).toThrow();
  });

  it("useSetNavigationCallbacks: shouldn't set callbacks unless all dependencies exist", () => {
    const setCallbacks = jest.fn();
    useContext.mockImplementation(() => ({ setCallbacks }));

    useSetNavigationCallbacks({ onAddQuestionPage: () => null }, [1337, false]);
    expect(setCallbacks).not.toHaveBeenCalled();
  });

  it("useSetNavigationCallbacksForPage: should generate correct callback functions", () => {
    let contextValue;
    useContext.mockImplementation(() => ({
      callbacks: contextValue,
      setCallbacks: (value) => {
        contextValue = value;
      },
    }));

    const addQuestionPage = jest.fn();
    const addCalculatedSummaryPage = jest.fn();
    const addFolder = jest.fn();
    useCreateQuestionPage.mockImplementation(() => addQuestionPage);
    useCreateCalculatedSummaryPage.mockImplementation(
      () => addCalculatedSummaryPage
    );
    useCreateFolder.mockImplementation(() => addFolder);

    useSetNavigationCallbacksForPage({
      page: { position: 0, folder: { enabled: true, position: 5 } },
      folder: { id: "folder-1", position: 0 },
      section: { id: "section-1" },
    });

    const callbacks = useNavigationCallbacks();

    callbacks.onAddQuestionPage();
    callbacks.onAddCalculatedSummaryPage();
    callbacks.onAddFolder();

    expect(addQuestionPage).toHaveBeenCalledTimes(1);
    expect(addQuestionPage).toHaveBeenCalledWith(
      expect.objectContaining({
        folderId: "folder-1",
        position: 1,
      })
    );
    expect(addCalculatedSummaryPage).toHaveBeenCalledTimes(1);
    expect(addCalculatedSummaryPage).toHaveBeenCalledWith(
      expect.objectContaining({
        folderId: "folder-1",
        position: 1,
      })
    );
    expect(addFolder).toHaveBeenCalledTimes(1);
  });
});
