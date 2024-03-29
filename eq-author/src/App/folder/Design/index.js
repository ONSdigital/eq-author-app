import React from "react";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { colors } from "constants/theme";
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

import PropTypes from "prop-types";
import styled from "styled-components";

import { FOLDER } from "constants/entities";

import Loading from "components/Loading";
import Error from "components/Error";
import Panel from "components/Panel";
import EditorPage from "components/EditorLayout";
import EditorToolbar from "components/EditorToolbar";
import Button from "components/buttons/Button";
import IconText from "components/IconText";

import AddPage from "assets/icon-add-page.svg?inline";
import onCompleteDelete from "./onCompleteDelete";

import onCompleteDuplicate from "./onCompleteDuplicate";

import GET_FOLDER_QUERY from "App/folder/graphql/getFolderQuery.graphql";
import UPDATE_FOLDER_MUTATION from "App/folder/graphql/updateFolderMutation.graphql";
import MOVE_FOLDER_MUTATION from "graphql/moveFolder.graphql";
import DUPLICATE_FOLDER_MUTATION from "graphql/duplicateFolder.graphql";
import DELETE_FOLDER_MUTATION from "App/folder/graphql/deleteFolder.graphql";

import ListCollectorFolderEditor from "./ListCollectorFolderEditor";
import BasicFolderEditor from "./BasicFolderEditor";

const StyledPanel = styled(Panel)`
  & > h2 {
    margin-left: 2em;
    margin-right: 2em;
    font-size: 1em;
  }

  & > p {
    margin-left: 2em;
    margin-right: 2em;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 2em;
  margin-top: 1.2em;
`;
const BorderedButton = styled(Button)`
  border: 1px solid ${colors.primary};
  padding: 0.5em;
`;

const FolderDesignPage = ({ history, match }) => {
  const { folderId, questionnaireId } = match.params;

  const addPageWithFolder = useCreatePageWithFolder();
  const onAddQuestionPage = useCreateQuestionPage();
  const addFolder = useCreateFolder();
  const addCalculatedSummaryPage = useCreateCalculatedSummaryPage();
  const addListCollectorFolder = useCreateListCollectorFolder();

  const { loading, error, data } = useQuery(GET_FOLDER_QUERY, {
    variables: { input: { folderId } },
    fetchPolicy: "cache-and-network",
  });

  let folderPosition, pages;

  const [updateFolder] = useMutation(UPDATE_FOLDER_MUTATION);
  const [moveFolder] = useMutation(MOVE_FOLDER_MUTATION);
  const [duplicateFolder] = useMutation(DUPLICATE_FOLDER_MUTATION, {
    onCompleted: ({ duplicateFolder }) =>
      duplicateFolder &&
      onCompleteDuplicate(duplicateFolder, history, questionnaireId),
  });

  const [deleteFolder] = useMutation(DELETE_FOLDER_MUTATION, {
    onCompleted: ({ deleteFolder }) =>
      deleteFolder &&
      onCompleteDelete(
        deleteFolder,
        history,
        questionnaireId,
        folderPosition,
        pages
      ),
  });

  const folder = data?.folder;

  const handleAddQuestionPageInsideFolder = () => {
    if (folder.listId != null) {
      return onAddQuestionPage({ folderId, position: 2 });
    } else {
      return onAddQuestionPage({ folderId, position: 0 });
    }
  };

  useSetNavigationCallbacks(
    {
      onAddQuestionPage: (createInsideFolder) =>
        createInsideFolder
          ? handleAddQuestionPageInsideFolder()
          : addPageWithFolder({
              sectionId: folder.section.id,
              position: folder.position + 1,
            }),
      onAddCalculatedSummaryPage: (createInsideFolder) =>
        createInsideFolder
          ? addCalculatedSummaryPage({
              folderId,
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

  if (loading) {
    return (
      <EditorPage>
        <Panel>
          <Loading height="38rem" />
        </Panel>
      </EditorPage>
    );
  }

  if (error) {
    return (
      <EditorPage>
        <Panel>
          <Error>Oops! Something went wrong.</Error>
        </Panel>
      </EditorPage>
    );
  }

  if (!data) {
    return (
      <EditorPage>
        <Panel>
          <Error>This folder does not exist.</Error>
        </Panel>
      </EditorPage>
    );
  }

  folderPosition = folder?.position;
  pages = folder?.pages;

  const {
    folder: { id, position, section, alias, displayName, validationErrorInfo },
  } = data;

  // Checks if folder is a list collector folder by checking if folder has listId attribute
  const isListCollectorFolder = folder.listId !== undefined;

  return (
    <EditorPage
      title={displayName}
      design
      logic={!isListCollectorFolder}
      validationErrorInfo={validationErrorInfo}
    >
      <StyledPanel data-test="folders-page">
        <EditorToolbar
          key={`toolbar-folder-${folderId}`}
          title={alias}
          shortCode={alias}
          pageType={FOLDER}
          shortCodeOnUpdate={(alias) =>
            updateFolder({
              variables: { input: { folderId: id, alias } },
            })
          }
          data={data.folder}
          onMove={({ to }) => {
            moveFolder({
              variables: {
                input: {
                  id,
                  position: to.position,
                  sectionId: to.sectionId,
                },
              },
            });
          }}
          onDuplicate={() =>
            duplicateFolder({
              variables: { input: { id, position: position + 1 } },
              refetchQueries: ["GetQuestionnaire"],
            })
          }
          onDelete={() =>
            deleteFolder({
              variables: { input: { id } },
            })
          }
        />
        {isListCollectorFolder ? (
          <ListCollectorFolderEditor
            questionnaireId={questionnaireId}
            folder={folder}
            history={history}
          />
        ) : (
          <BasicFolderEditor folderId={folderId} />
        )}
      </StyledPanel>

      {!isListCollectorFolder && (
        <ButtonGroup>
          <BorderedButton
            variant="tertiary"
            small
            onClick={() => onAddQuestionPage({ folderId, position: 0 })}
            data-test="btn-add-page-inside-folder"
          >
            <IconText icon={AddPage}>Add question inside folder</IconText>
          </BorderedButton>
          <BorderedButton
            variant="tertiary"
            small
            onClick={() =>
              addPageWithFolder({
                sectionId: section.id,
                position: position + 1,
              })
            }
            data-test="btn-add-page-outside-folder"
          >
            <IconText icon={AddPage}>Add question outside folder</IconText>
          </BorderedButton>
        </ButtonGroup>
      )}
    </EditorPage>
  );
};

FolderDesignPage.propTypes = {
  match: PropTypes.object.isRequired, // eslint-disable-line
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
};

export default FolderDesignPage;
