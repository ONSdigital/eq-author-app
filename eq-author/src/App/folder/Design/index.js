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

import GET_FOLDER_QUERY from "./getFolderQuery.graphql";
import UPDATE_FOLDER_MUTATION from "./updateFolderMutation.graphql";

const Guidance = styled(Collapsible)`
  margin-left: 2em;
  margin-right: 2em;
`;

const FolderDesignPage = ({ match }) => {
  const { folderId } = match.params;

  const { loading, error, data } = useQuery(GET_FOLDER_QUERY, {
    variables: { input: { folderId } },
  });

  const [saveShortCode] = useMutation(UPDATE_FOLDER_MUTATION);

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
    folder: { id, alias },
  } = data;

  const shortCodeOnUpdate = (alias) => {
    return saveShortCode({
      variables: { input: { folderId: id, alias } },
    });
  };

  return (
    <EditorPage title={alias || "Untitled folder"}>
      <Panel data-test="folders-page">
        <EditorToolbar
          shortCode={alias}
          shortCodeOnUpdate={shortCodeOnUpdate}
          onMove={() => alert("onMove")}
          onDuplicate={() => alert("onDuplicate")}
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
            the questionnaire; respondents only see the questions contains
            within folders if they meet the conditions you have applied.
          </p>
        </Guidance>
      </Panel>
    </EditorPage>
  );
};

FolderDesignPage.propTypes = {
  match: PropTypes.object.isRequired, // eslint-disable-line
};

export default FolderDesignPage;
