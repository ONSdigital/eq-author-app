import React from "react";

import { useMutation, useQuery } from "@apollo/react-hooks";

import PropTypes from "prop-types";
import styled from "styled-components";

import Loading from "components/Loading";
import Error from "components/Error";
import Panel from "components/Panel";
import EditorPage from "components/EditorLayout";
import EditorToolbar from "components/EditorToolbar";
import Collapsible from "components/Collapsible";

import onCompleteDuplicate from "./onCompleteDuplicate";

import GET_FOLDER_QUERY from "./getFolderQuery.graphql";
import UPDATE_FOLDER_MUTATION from "./updateFolderMutation.graphql";
import DUPLICATE_FOLDER_MUTATION from "graphql/duplicateFolder.graphql";

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

  let sectionId, folderPosition;
  if (data) {
    sectionId = data.folder.section.id;
    folderPosition = data.folder.position;
  }

  const [saveShortCode] = useMutation(UPDATE_FOLDER_MUTATION);

  const [duplicateFolder] = useMutation(DUPLICATE_FOLDER_MUTATION, {
    onCompleted: (data) => {
      onCompleteDuplicate(
        data,
        history,
        questionnaireId,
        sectionId,
        folderPosition
      );
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

  const {
    folder: { id, position, alias },
  } = data;

  const shortCodeOnUpdate = (alias) => {
    return saveShortCode({
      variables: { input: { folderId: id, alias } },
    });
  };

  const handleDuplicateFolder = (e) => {
    e.stopPropagation();
    return duplicateFolder({
      variables: { input: { id, position } },
    });
  };

  return (
    <EditorPage title={alias || "Untitled folder"}>
      <StyledPanel data-test="folders-page">
        <EditorToolbar
          shortCode={alias}
          shortCodeOnUpdate={shortCodeOnUpdate}
          onMove={() => alert("onMove")}
          onDuplicate={handleDuplicateFolder}
          onDelete={() => alert("onDelete")}
          disableMove
          disableDuplicate
          disableDelete
          key={`toolbar-folder-${folderId}`}
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
