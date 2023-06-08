import React, { useState, useEffect, createContext, useContext } from "react";
import PropTypes from "prop-types";

import {
  useCreateQuestionPage,
  useCreateCalculatedSummaryPage,
} from "hooks/useCreateQuestionPage";
import {
  useCreateFolder,
  useCreateListCollectorFolder,
} from "hooks/useCreateFolder";

export const defaultCallbacks = {
  onAddQuestionPage: () => {
    throw new Error("onAddQuestionPage callback not defined");
  },
  onAddCalculatedSummaryPage: () => {
    throw new Error("onAddCalculatedSummaryPage callback not defined");
  },
  onAddFolder: () => {
    throw new Error("onAddFolder callback not defined");
  },
  onAddListCollectorFolder: () => {
    throw new Error("onAddListCollectorFolder callback not defined");
  },
};

const CallbackContext = createContext({
  callbacks: defaultCallbacks,
  setCallbacks: () => null,
});

export const CallbackContextProvider = ({ children }) => {
  const [callbacks, setCallbacks] = useState(defaultCallbacks);

  return (
    <CallbackContext.Provider value={{ callbacks, setCallbacks }}>
      {children}
    </CallbackContext.Provider>
  );
};

CallbackContextProvider.propTypes = {
  children: PropTypes.node,
};

export const useNavigationCallbacks = () =>
  useContext(CallbackContext).callbacks;

export const useSetNavigationCallbacks = (callbacks, dependencies) => {
  const { setCallbacks } = useContext(CallbackContext);

  useEffect(() => {
    if (dependencies.every((x) => x)) {
      setCallbacks(callbacks);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
};

export const useSetNavigationCallbacksForPage = ({ page, folder, section }) => {
  const addQuestionPage = useCreateQuestionPage();
  const addListCollectorFolder = useCreateListCollectorFolder();
  const addCalculatedSummaryPage = useCreateCalculatedSummaryPage();
  const addFolder = useCreateFolder();

  useSetNavigationCallbacks(
    {
      onAddQuestionPage: () =>
        addQuestionPage({
          folderId: folder.id,
          position: page.position + 1,
        }),
      onAddCalculatedSummaryPage: () =>
        addCalculatedSummaryPage({
          folderId: folder.id,
          position: page.position + 1,
        }),
      onAddFolder: () =>
        addFolder({
          sectionId: section.id,
          position: folder.position + 1,
        }),
      onAddListCollectorFolder: () =>
        addListCollectorFolder({
          folderId: folder.id,
          position: page.position + 1,
        }),
    },
    [page, folder, section]
  );
};
