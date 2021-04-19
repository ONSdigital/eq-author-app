import React from "react";
import { useMutation, useQuery } from "@apollo/react-hooks";
import {
  useCreatePageWithFolder,
  useCreateFolder,
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
import Collapsible from "components/Collapsible";
import Button from "components/buttons/Button";
import IconText from "components/IconText";

import AddPage from "assets/icon-add-page.svg?inline";
import onCompleteDelete from "./onCompleteDelete";

import onCompleteDuplicate from "./onCompleteDuplicate";

import GET_FOLDER_QUERY from "App/folder/graphql/getFolderQuery.graphql";
import UPDATE_FOLDER_MUTATION from "App/folder/graphql/updateFolderMutation.graphql";
import MOVE_FOLDER_MUTATION from "App/folder/graphql/moveFolder.graphql";
import DUPLICATE_FOLDER_MUTATION from "graphql/duplicateFolder.graphql";
import DELETE_FOLDER_MUTATION from "App/folder/graphql/deleteFolder.graphql";
import GET_SECTION from "graphql/getSection.graphql";

import { colors } from "constants/theme";

const Guidance = styled(Collapsible)`
  margin-left: 2em;
  margin-right: 2em;
`;

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

  const { loading, error, data } = useQuery(GET_FOLDER_QUERY, {
    variables: { input: { folderId } },
    fetchPolicy: "cache-and-network",
  });

  let folderPosition, pages;

  const [saveShortCode] = useMutation(UPDATE_FOLDER_MUTATION);
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

  useSetNavigationCallbacks(
    {
      onAddQuestionPage: (createInsideFolder) =>
        createInsideFolder
          ? onAddQuestionPage({ folderId, position: 0 })
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
          enabled: true,
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

  return (
    <EditorPage
      title={displayName}
      design
      logic
      validationErrorInfo={validationErrorInfo}
    >
      <StyledPanel data-test="folders-page">
        <EditorToolbar
          key={`toolbar-folder-${folderId}`}
          title={alias}
          shortCode={alias}
          pageType={FOLDER}
          shortCodeOnUpdate={(alias) =>
            saveShortCode({
              variables: { input: { folderId: id, alias } },
            })
          }
          data={data.folder}
          onMove={({ from, to }) => {
            moveFolder({
              variables: {
                input: {
                  id,
                  position: to.position,
                  sectionId: to.sectionId,
                },
              }, // conditional refetch to check when last folder in section
              ...(from.sectionId !== to.sectionId
                ? {
                    refetchQueries: [
                      {
                        query: GET_SECTION,
                        variables: {
                          input: {
                            sectionId: from.sectionId,
                          },
                        },
                      },
                    ],
                  }
                : {}),
            });
          }}
          onDuplicate={() =>
            duplicateFolder({
              variables: { input: { id, position: position + 1 } },
            })
          }
          onDelete={() =>
            deleteFolder({
              variables: { input: { id } },
            })
          }
        />
        <h2>Folders</h2>
        <p>
          Folders are used to apply an action or event to multiple questions at
          once. Respondents do not see the folders.
        </p>
        <Guidance
          title="What is the benefit of using folders?"
          key={`guidance-folder-${folderId}`}
        >
          <p>
            Folders are groups of related questions. Logic can be applied to the
            whole folder or each question within the folder, they allow you to
            build more complex navigation in your questionnaire.
          </p>
          <p>
            Folders do not appear as sections when respondents are completing
            the questionnaire; respondents only see the questions contained
            within folders if they meet the conditions you have applied.
          </p>
        </Guidance>
      </StyledPanel>
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
            addPageWithFolder({ sectionId: section.id, position: position + 1 })
          }
          data-test="btn-add-page-outside-folder"
        >
          <IconText icon={AddPage}>Add question outside folder</IconText>
        </BorderedButton>
      </ButtonGroup>
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
