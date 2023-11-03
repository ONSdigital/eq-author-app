import React from "react";
import { useQuery } from "@apollo/react-hooks";
import PropTypes from "prop-types";

import Loading from "components/Loading";
import Error from "components/Error";

import SkipLogicPage from "./SkipLogicPage";
import Logic from "App/shared/Logic";

import SKIPLOGIC_QUERY from "./fragment.graphql";

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

export const SkipLogicRoute = ({ match: { params }, folder }) => {
  const { loading, data } = useQuery(SKIPLOGIC_QUERY, {
    variables: {
      input: {
        id: params.confirmationId || params.pageId || params.folderId,
      },
    },
    fetchPolicy: "cache-and-network",
  });

  const page = data?.skippable;

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
      {page ? (
        <SkipLogicPage page={page} />
      ) : loading ? (
        <Loading height="20em"> Loading skip logic </Loading>
      ) : (
        <Error> Something went wrong </Error>
      )}
    </Logic>
  );
};

SkipLogicRoute.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      pageId: PropTypes.string,
      confirmationId: PropTypes.string,
    }).isRequired,
  }).isRequired,

  folder: CustomPropTypes.folder,
};

export default SkipLogicRoute;
