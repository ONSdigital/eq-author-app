import React, { useState } from "react";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import styled from "styled-components";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { Link } from "react-router-dom";

import Collapsible from "components/Collapsible";
import { Field, Input, Label } from "components/Forms";
import Loading from "components/Loading";
import Error from "components/Error";
import Select from "components/Select";

import GET_COLLECTION_LISTS_QUERY from "graphql/lists/collectionLists.graphql";
import UPDATE_FOLDER_MUTATION from "graphql/updateFolderMutation.graphql";

import { buildCollectionListsPath } from "utils/UrlUtils";

const Title = styled.h4`
  margin-bottom: ${(props) => props.marginBottom}em;
`;

const ContentContainer = styled.div`
  width: ${(props) => props.width}%;
`;

const Content = styled.p``;

const StyledInput = styled(Input)`
  width: 30em;
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
  const { id, listId, title } = folder;
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

  return (
    <StyledField>
      <Label htmlFor="list-collector-title">List collector title</Label>
      <StyledInput
        id="list-collector-title"
        name="list-collector-title"
        onChange={({ value }) => setFolderTitle(value)}
        onBlur={() =>
          updateFolder({
            variables: { input: { folderId: id, title: folderTitle } },
          })
        }
        value={folderTitle}
      />
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
        title="Design approaches to gather additional information on each list item"
        dataTestIdPrefix="list-collector-design-approach-details"
      >
        3 recommended design approaches are available for gathering information
        on each list item.
        <Title marginBottom="0.5">
          For up to 3 questions on each list item:
        </Title>
        <Content>
          Extend the list collector question pattern by adding follow-up
          questions after the question for adding a list item. This allows the
          same information to be gathered for each item added. After answering
          the follow-up questions, respondents proceed to the summary page,
          which displays only the list items and includes the question to
          confirm list completion. This process repeats until the list is
          complete. Follow-up questions are summarised in the section summary.
        </Content>
        <Title marginBottom="0.5">
          For more than 3 questions on each list item:
        </Title>
        <Content>
          Use the list collector question pattern (with no follow-up questions)
          to collect the list items, and then create a new repeating section
          linked to the same collection list as the list collector. Distinct
          sections, featuring the same questions, will be generated for each
          list item and displayed on the hub.
        </Content>
        <Title marginBottom="0.5">
          If percentage values for each list item are needed:
        </Title>
        <Content>
          Use a repeating label and input with a percentage answer type to
          generate a label and input field for each item added to the linked
          collection list.
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
        // hasError={some(page.validationErrorInfo.errors, {
        //   field: "listId",
        // })}
      />
    </StyledField>
  );
};

ListCollectorFolderEditor.propTypes = {
  questionnaireId: PropTypes.string,
  folder: PropTypes.object, //eslint-disable-line
  history: CustomPropTypes.history,
};

export default ListCollectorFolderEditor;
