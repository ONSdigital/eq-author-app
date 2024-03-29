import React, { useState } from "react";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import { colors } from "constants/theme";
import styled from "styled-components";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { Link } from "react-router-dom";

import Collapsible from "components/Collapsible";
import { Field, Input, Label } from "components/Forms";
import Loading from "components/Loading";
import Error from "components/Error";
import Select from "components/Select";
import ValidationError from "components/ValidationError";

import { LIST_COLLECTOR_FOLDER_ERRORS } from "constants/validationMessages";

import GET_COLLECTION_LISTS_QUERY from "graphql/lists/collectionLists.graphql";
import UPDATE_FOLDER_MUTATION from "graphql/updateFolderMutation.graphql";

import { buildCollectionListsPath } from "utils/UrlUtils";

// Uses h2 with overwritten h4 styling to improve accessibility - https://www.w3schools.com/tags/tag_hn.asp
const Title = styled.h2`
  display: block;
  font-size: 1em;
  margin-top: 1.33em;
  margin-bottom: 1.33em;
  margin-left: 0;
  margin-right: 0;
  font-weight: bold;
  margin-bottom: ${(props) => props.marginBottom}em;
`;

const ContentContainer = styled.div`
  width: ${(props) => props.width}%;
`;

const Content = styled.p``;

const StyledInput = styled(Input)`
  width: 30em;
  ${({ hasError }) =>
    hasError &&
    `
    border-color: ${colors.errorPrimary};
    &:focus,
    &:focus-within {
      border-color: ${colors.errorPrimary};
      outline-color: ${colors.errorPrimary};
      box-shadow: 0 0 0 2px ${colors.errorPrimary};
    }
    &:hover {
      border-color: ${colors.errorPrimary};
      outline-color: ${colors.errorPrimary};
    }
  `}
`;

const StyledField = styled(Field)`
  margin-left: 2em;
`;

const OrderedList = styled.ol`
  padding-left: 0;
  margin-top: 0;
  margin-left: 2em;
`;

const ListItem = styled.li``;

const ListCollectorFolderEditor = ({ questionnaireId, folder, history }) => {
  const { id, listId, title, validationErrorInfo } = folder;
  const [selectedListId, setSelectedListId] = useState(listId);
  const [folderTitle, setFolderTitle] = useState(title);

  let lists = [];
  const [updateFolder] = useMutation(UPDATE_FOLDER_MUTATION);

  const { loading, error, data } = useQuery(GET_COLLECTION_LISTS_QUERY, {
    fetchPolicy: "cache-and-network",
  });

  if (loading) {
    return <Loading height="100%">Questionnaire lists loading…</Loading>;
  }

  if (error) {
    return <Error>Something went wrong</Error>;
  }

  if (data) {
    lists = data.collectionLists?.lists || [];
  }

  const handleUpdateList = (listId) => {
    // Redirect to Collection Lists page when `Create new list` is selected from dropdown
    if (listId === "newList") {
      history.push(buildCollectionListsPath({ questionnaireId }));
      return;
    }

    setSelectedListId(listId);
    updateFolder({
      variables: {
        input: {
          folderId: id,
          listId,
        },
      },
    });
  };

  const getErrorMessage = (field) => {
    const errorCodeResult = validationErrorInfo.errors.find(
      (error) => error.field === field
    )?.errorCode;

    return LIST_COLLECTOR_FOLDER_ERRORS[errorCodeResult];
  };

  return (
    <StyledField data-test="list-collector-folder-editor">
      <Label htmlFor="list-collector-folder-title">List collector title</Label>
      <StyledInput
        id="list-collector-folder-title"
        name="list-collector-folder-title"
        onChange={({ value }) => setFolderTitle(value)}
        onBlur={() =>
          updateFolder({
            variables: { input: { folderId: id, title: folderTitle } },
          })
        }
        value={folderTitle}
        data-test="list-collector-folder-title-input"
        hasError={getErrorMessage("title")}
      />
      {getErrorMessage("title") && (
        <ValidationError>{getErrorMessage("title")}</ValidationError>
      )}
      <Title marginBottom="-0.5">List collector question pattern</Title>
      <ContentContainer width="90">
        <Content>
          The list collector question pattern allows respondents to add items to
          a list.
        </Content>
        <Content>
          It consists of a qualifier question, a question for entering or
          selecting list items, and a summary page with a question to confirm
          list completion.
        </Content>
      </ContentContainer>
      <Collapsible
        title="List collector question pattern: step-by-step"
        dataTestIdPrefix="list-collector-step-by-step"
      >
        <OrderedList>
          <ListItem>
            To start, the qualifier question determines if there is a list to
            collect. If the answer is no, the respondent moves to the next
            question after the list collector. If yes, the respondent is taken
            to the question for adding a list item.
          </ListItem>
          <ListItem>
            The question for adding a list item enables input or selection of
            one list item at a time.
          </ListItem>
          <ListItem>
            The added list item will be displayed on the summary page, as well
            as the question to confirm list completion. If the list has not been
            completed, the respondent is taken to the question to add another
            list item.
          </ListItem>
          <ListItem>This process repeats until the list is complete.</ListItem>
        </OrderedList>
      </Collapsible>
      <Collapsible
        title="How to gather additional information on each list item"
        dataTestIdPrefix="list-collector-design-approach-details"
      >
        How you approach gathering additional information for each list item
        will depend on how much detail you need.
        <Title marginBottom="0.5">
          If up to 3 follow-up questions are needed:
        </Title>
        <Content>
          Adding follow-up questions after the question for adding a list item
          will allow the same information to be gathered for each item added.
          After answering the follow-up questions, the respondent is shown the
          summary page, which only displays the list items and allows them to
          confirm whether the list is complete.
        </Content>
        <Content>
          This process repeats until the list is complete. Follow-up questions
          are summarised in the section summary.
        </Content>
        <Title marginBottom="0.5">
          For more than 3 questions on each list item:
        </Title>
        <Content>
          Use the list collector question pattern (with no follow-up questions)
          to collect the list items. Then create a new repeating section linked
          to the same collection list as the list collector. Distinct sections
          featuring the same questions will be generated for each list item and
          displayed on the hub.
        </Content>
        <Title marginBottom="0.5">
          If percentage values for each list item are needed:
        </Title>
        <Content>
          Use a repeating label and an input with a percentage answer type to
          allow users to enter a percentage answer for each list item added to
          the collection list.
        </Content>
      </Collapsible>
      <Title marginBottom="-0.5">Collection lists</Title>
      <ContentContainer width="99">
        <Content>
          A list collector question pattern must be linked to a collection list,
          which stores added list items. Multiple list collector question
          patterns can be linked to the same collection list. The collection
          list can be piped into a repeating section or follow-up question,
          allowing you to reference the added list items in subsequent question
          titles and answer labels.
        </Content>
        <Content>
          Collection lists are associated with answer templates that specify the
          answer types (for example text, radio etc) to be used in the question
          for adding a list item. These templates are used across all linked
          list collector question patterns.
        </Content>
        <Link to={buildCollectionListsPath({ questionnaireId })}>
          Create and manage collection lists
        </Link>
      </ContentContainer>
      <Title>Linked collection list</Title>
      <Select
        name="listId"
        dataTest="list-select"
        value={selectedListId}
        defaultValue="Select collection list"
        options={lists}
        additionalOption={{ value: "newList", displayName: "Create new list" }}
        handleChange={({ target }) => handleUpdateList(target.value)}
        ariaLabel={"Linked collection list"}
        hasError={validationErrorInfo.errors.some(
          (error) => error.field === "listId"
        )}
      />
      {getErrorMessage("listId") && (
        <ValidationError>{getErrorMessage("listId")}</ValidationError>
      )}
    </StyledField>
  );
};

ListCollectorFolderEditor.propTypes = {
  questionnaireId: PropTypes.string,
  folder: CustomPropTypes.folder,
  history: CustomPropTypes.history,
};

export default ListCollectorFolderEditor;
