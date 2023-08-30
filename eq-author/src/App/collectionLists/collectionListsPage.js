import React from "react";
import PropTypes from "prop-types";
import Header from "components/EditorLayout/Header";
import Error from "components/Error";
import { useQuery, useMutation } from "@apollo/react-hooks";
import styled from "styled-components";
import Collapsible from "components/Collapsible";
import { colors } from "constants/theme";
import Loading from "components/Loading";
import Button from "components/buttons/Button";
import CollectionListItem from "./collectionListItem";
import { flowRight } from "lodash";

import COLLECTION_LISTS from "graphql/lists/collectionLists.graphql";
import CREATE_COLLECTION_LIST from "graphql/lists/createCollectionListMutation.graphql";
import DELETE_COLLECTION_LIST from "graphql/lists/deleteCollectionListMutation.graphql";
import UPDATE_COLLECTION_LIST from "graphql/lists/updateCollectionListMutation.graphql";
import CREATE_COLLECTION_LIST_ANSWER from "graphql/lists/createCollectionListAnswerMutation.graphql";
import DELETE_COLLECTION_LIST_ANSWER from "graphql/lists/deleteCollectionListAnswerMutation.graphql";
import withUpdateAnswer from "App/page/Design/answers/withUpdateAnswer";
import withCreateExclusive from "App/page/Design/answers/withCreateExclusive";
import withCreateOption from "App/page/Design/answers/withCreateOption";
import withUpdateOption from "App/page/Design/answers/withUpdateOption";
import withDeleteOption from "App/page/Design/answers/withDeleteOption";

const List = styled.ol`
  margin: 0 0 1.5em 1.5em;
  padding: 0;
  counter-reset: item;
`;

const ListItem = styled.li`
  margin: 0;
  padding: 0.2em 0;
  text-indent: -1.5em;
  list-style-type: none;
  counter-increment: item;
  &:before {
    display: inline-block;
    width: 1.5em;
    padding-right: 0.5em;
    font-weight: bold;
    text-align: right;
    content: counter(item) ".";
  }
`;

const Text = styled.p``;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: scroll;
`;

const Margin = styled.div`
  margin-top: 1.2em;
`;

const StyledGrid = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1em;
  border: 1px solid ${colors.lightGrey};
  border-radius: 4px;
  background: ${colors.white};
  margin: 1.2em;
`;

const AddListCollectionButton = styled(Button)`
  margin: 1.5rem 0rem;
  width: 18rem;
  padding: 1rem;
`;

const CollectionListsPage = ({
  onUpdateAnswer,
  onAddOption,
  onAddExclusive,
  onUpdateOption,
  onDeleteOption,
}) => {
  const { loading, error, data } = useQuery(COLLECTION_LISTS, {
    fetchPolicy: "cache-and-network",
  });

  const [addList] = useMutation(CREATE_COLLECTION_LIST);
  const [deleteList] = useMutation(DELETE_COLLECTION_LIST);
  const [updateList] = useMutation(UPDATE_COLLECTION_LIST);
  const [createAnswer] = useMutation(CREATE_COLLECTION_LIST_ANSWER);
  const [deleteAnswer] = useMutation(DELETE_COLLECTION_LIST_ANSWER);

  const handleAddList = () => {
    addList();
  };

  const handleDeleteList = (id) => () => {
    deleteList({
      variables: { input: { id: id } },
    });
  };

  const handleUpdateList = (id) => (listName) => {
    updateList({
      variables: { input: { id: id, listName: listName } },
    });
  };

  const handleCreateAnswer = (id) => (type) =>
    createAnswer({
      variables: { input: { listId: id, type: type } },
    });

  const handleDeleteAnswer = (answerId) => {
    deleteAnswer({
      variables: { input: { id: answerId } },
    });
  };

  if (loading) {
    return <Loading height="100%">Questionnaire lists loading…</Loading>;
  }
  let lists = [];

  if (data) {
    lists = data.collectionLists?.lists || [];
  }
  return (
    <Container>
      <Header title="Collection Lists" tabIndex="-1" className="keyNav" />
      <StyledGrid>
        <h2>List collectors and collection lists</h2>
        <Text>
          To use a list collector question pattern, it must be linked to a
          collection list.
        </Text>

        <Collapsible
          title="List collector question pattern: step-by-step"
          dataTestIdPrefix="list-collector-step-by-step"
        >
          <List>
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
              as the question to confirm list completion. If the list has not
              been completed, the respondent is taken to the question to add
              another list item.
            </ListItem>
            <ListItem>
              This process repeats until the list is complete.
            </ListItem>
          </List>
        </Collapsible>

        <h2>What is a collection list?</h2>
        <Text>
          A collection list stores list items added to linked list collector
          question patterns. These list items can be referenced in subsequent
          question titles and answer labels by piping the collection list.
          Multiple list collector questions can be linked to the same collection
          list.
        </Text>
        <Text>
          Each collection list requires a name and an answer template, which
          specifies the answer types to be used in the question for adding a
          list item. This answer template is applied across all linked list
          collector question patterns.
        </Text>

        <AddListCollectionButton
          variant="secondary"
          data-test="btn-add-list"
          onClick={handleAddList}
        >
          Create {!lists.length ? "a" : "another"} collection list
        </AddListCollectionButton>

        <Margin>
          {lists === null ||
          lists === undefined ||
          !lists.length ||
          error ||
          !data ? (
            <Error>Currently no lists</Error>
          ) : (
            lists.map((list) => (
              <CollectionListItem
                key={list.id}
                list={list}
                handleDeleteList={handleDeleteList(list.id)}
                handleUpdateList={handleUpdateList(list.id)}
                handleCreateAnswer={handleCreateAnswer(list.id)}
                handleDeleteAnswer={handleDeleteAnswer}
                handleUpdateAnswer={onUpdateAnswer}
                handleAddOption={onAddOption}
                handleAddExclusive={onAddExclusive}
                handleUpdateOption={onUpdateOption}
                handleDeleteOption={onDeleteOption}
              />
            ))
          )}
        </Margin>
      </StyledGrid>
    </Container>
  );
};

CollectionListsPage.propTypes = {
  onUpdateAnswer: PropTypes.func,
  onAddOption: PropTypes.func,
  onAddExclusive: PropTypes.func,
  onUpdateOption: PropTypes.func,
  onDeleteOption: PropTypes.func,
};
export default flowRight(
  withUpdateAnswer,
  withCreateExclusive,
  withCreateOption,
  withUpdateOption,
  withDeleteOption
)(CollectionListsPage);
