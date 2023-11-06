import React from "react";
import Logic from "App/shared/Logic";
import NoRouting, {
  Title,
  Paragraph,
} from "App/shared/Logic/Routing/NoRouting";
import Panel from "components/Panel";

import CustomPropTypes from "custom-prop-types";

import {
  useCreatePageWithFolder,
  useCreateFolder,
  useCreateListCollectorFolder,
} from "hooks/useCreateFolder";
import {
  useCreateQuestionPage,
  useCreateCalculatedSummaryPage,
} from "hooks/useCreateQuestionPage";
import { useSetNavigationCallbacks } from "components/NavigationCallbacks";

export const NO_ROUTING_TITLE = "Routing logic not available for folders";
export const NO_ROUTING_PARAGRAPH =
  "The route will be based on the answer to the previous question.";

const Routing = ({ folder }) => {
  const page = folder;

  const addPageWithFolder = useCreatePageWithFolder();
  const onAddQuestionPage = useCreateQuestionPage();
  const addFolder = useCreateFolder();
  const addCalculatedSummaryPage = useCreateCalculatedSummaryPage();
  const addListCollectorFolder = useCreateListCollectorFolder();

  useSetNavigationCallbacks(
    {
      onAddQuestionPage: (createInsideFolder) =>
        createInsideFolder
          ? onAddQuestionPage({ folderId: folder.id, position: 0 })
          : addPageWithFolder({
              sectionId: folder.section.id,
              position: folder.position + 1,
            }),
      onAddCalculatedSummaryPage: (createInsideFolder) =>
        createInsideFolder
          ? addCalculatedSummaryPage({
              folderId: folder.id,
              position: folder.pages.length + 1,
            })
          : addPageWithFolder({
              sectionId: folder.section.id,
              position: folder.position + 1,
              isCalcSum: true,
            }),
      onAddFolder: () =>
        addFolder({
          sectionId: folder.section.id,
          position: folder.position + 1,
        }),
      onAddListCollectorFolder: () =>
        addListCollectorFolder({
          sectionId: folder.section.id,
          position: folder.position + 1,
        }),
    },
    [folder]
  );

  return (
    <Logic page={page}>
      <Panel>
        <NoRouting disabled>
          <Title>{NO_ROUTING_TITLE}</Title>
          <Paragraph>{NO_ROUTING_PARAGRAPH}</Paragraph>
        </NoRouting>
      </Panel>
    </Logic>
  );
};

Routing.propTypes = {
  folder: CustomPropTypes.folder,
};

export default Routing;
