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
  margin: 0 0 1.5em;
  padding: 0;
  counter-reset: item;
`;

const ListItem = styled.li`
  margin: 0;
  padding: 0 0 0.25em 2em;
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
  margin: 0.5em 1em;
`;

const AddListCollectionButton = styled(Button)`
  margin-top: 1rem;
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
        <Text>
          Collection Lists are an essential part of the List Collector
          questionnaire design pattern.
        </Text>
        <Text>
          A Collection List is used to store respondent answers to a specific
          question for example, the names of all the persons residing in a
          household.
        </Text>
        <Text>
          The structure of the Collection List is defined with answer type(s)
          that together make up a single entry on the list for example, first
          name, middle name, and last name.
        </Text>
        <Collapsible title="What is the List Collector questionnaire design pattern?">
          <Text>
            The List Collector design pattern provides an efficient EQ solution
            to the problem of data collection on a variable number of subjects.
            For example, collecting data on each person residing in a household.
          </Text>
          <Text>
            The first part of the pattern is to collect the list. Step one is
            when a respondent is asked if they have something to add, e.g
            another person in the household. If they have then they will then be
            taken to a looping question where they enter the answers which will
            be collected for the list. The respondent will again be asked if
            they have any more to add and a summary of the list will be shown,
            if they have more to add the question is repeated and answers
            collected and again added to the list. This loop continues until the
            respondent has nothing more to add. The list is then ready for use.
          </Text>
          <Text>
            Respondents can then be asked questions for each item on the list.
          </Text>
        </Collapsible>

        <Collapsible title="How to create the List Collector questionnaire design pattern in Author?">
          <Text>
            To create the list collector pattern in Author we do this in the
            following steps:
          </Text>
          <List>
            <ListItem>
              Go to the Collection Lists page on the left hand menu and create a
              collection list and give it a relevant name.
            </ListItem>
            <ListItem>
              Add the answers you need to collect that will make up each item on
              the list, for example adding two text field answer types to
              collect the respondent&apos;s first name and last name.
            </ListItem>
            <ListItem>
              In the questionnaire add a List collector page via the add/import
              menu.
            </ListItem>
            <ListItem>
              The List collector page is made up of two questions which repeat
              until there is nothing else to add to the list, for example does
              anyone else live in the household, if there is then what is their
              name. The first question is on the List collector page which has a
              radio option. Enter the question and answer labels.
            </ListItem>
            <ListItem>
              In the answers list area you must select a list from the dropdown
              menu, this menu will show any lists that have been created in the
              Collection lists page. Select the relevant list.
            </ListItem>
            <ListItem>
              Once the list is selected a list summary area appears along with
              another question field. The List summary will display answers for
              each label shown, you can remove these labels but must keep at
              least one.
            </ListItem>
            <ListItem>
              Enter a question in the Add to list question field, this is the
              second question that gets repeated, for example who do you need to
              add?
            </ListItem>
            <ListItem>
              When you view this page using the Preview tab, both of these
              repeating questions will be shown, the respondent will see one
              question at a time.
            </ListItem>
          </List>
        </Collapsible>
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
