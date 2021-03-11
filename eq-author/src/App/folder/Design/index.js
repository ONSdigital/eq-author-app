import React from "react";
import { useMutation, useQuery } from "@apollo/react-hooks";

import PropTypes from "prop-types";
import styled from "styled-components";

import { FOLDER } from "constants/entities";

import Loading from "components/Loading";
import Error from "components/Error";
import Panel from "components/Panel";
import EditorPage from "components/EditorLayout";
import EditorToolbar from "components/EditorToolbar";
import Collapsible from "components/Collapsible";
import onCompleteDelete from "./onCompleteDelete";

import onCompleteDuplicate from "./onCompleteDuplicate";

import GET_FOLDER_QUERY from "./getFolderQuery.graphql";
import UPDATE_FOLDER_MUTATION from "./updateFolderMutation.graphql";
import DUPLICATE_FOLDER_MUTATION from "graphql/duplicateFolder.graphql";
import DELETE_FOLDER_MUTATION from "./deleteFolder.graphql";

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

const FolderDesignPage = ({ history, match }) => {
  const { folderId, questionnaireId } = match.params;

  const { loading, error, data } = useQuery(GET_FOLDER_QUERY, {
    variables: { input: { folderId } },
  });

  let folderPosition, pages;

  const [saveShortCode] = useMutation(UPDATE_FOLDER_MUTATION);
  const [deleteFolder] = useMutation(DELETE_FOLDER_MUTATION, {
    onCompleted: (data) => {
      onCompleteDelete(data, history, questionnaireId, folderPosition, pages);
    },
  });

  const [duplicateFolder] = useMutation(DUPLICATE_FOLDER_MUTATION, {
    onCompleted: (data) => {
      onCompleteDuplicate(data, history, questionnaireId);
    },
  });

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

  folderPosition = data.folder.position;
  pages = data.folder.pages;

  const {
    folder: { id, position, alias, displayName },
  } = data;

  const shortCodeOnUpdate = (alias) =>
    saveShortCode({
      variables: { input: { folderId: id, alias } },
    });

  return (
    <EditorPage title={displayName} design logic>
      <StyledPanel data-test="folders-page">
        <EditorToolbar
          shortCode={alias}
          pageType={FOLDER}
          shortCodeOnUpdate={shortCodeOnUpdate}
          onMove={() => alert("onMove")}
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
          disableMove
          key={`toolbar-folder-${folderId}`}
          title={alias}
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
