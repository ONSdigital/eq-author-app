import React from "react";
import Logic from "App/shared/Logic";
import NoRouting, {
  Title,
  Paragraph,
} from "App/shared/Logic/Routing/NoRouting";
import GET_FOLDER_QUERY from "App/folder/graphql/fragment.graphql";
import PropTypes from "prop-types";
import Panel from "components/Panel";

import { useQuery } from "@apollo/react-hooks";

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

const Routing = ({ match }) => {
  const { data } = useQuery(GET_FOLDER_QUERY, {
    variables: {
      input: {
        folderId: match.params.folderId,
      },
    },
  });

  const folder = data?.folder;

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
    <Logic page={folder}>
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
  match: PropTypes.shape({
    params: PropTypes.shape({
      folderId: PropTypes.string.isRequired,
    }),
  }),
};

export default Routing;
