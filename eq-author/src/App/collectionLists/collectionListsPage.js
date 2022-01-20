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
import IconText from "components/IconText";
import AddIcon from "./icon-add.svg?inline";

import questionnaireCollectionListsQuery from "./questionnaireCollectionLists.graphql";
import deleteCollectionListMutation from "./deleteCollectionListMutation.graphql";

const Text = styled.p``;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Twistie = styled(Collapsible)`
  .collapsible-title,
  .collapsible-title > * {
    font-weight: normal;
    padding: 0;
  }

  .collapsible-header {
    margin-bottom: 0.5em;
  }

  .collapsible-body {
    margin-top: 0;
    margin-left: 3px;
    border-left: 3px solid ${colors.lightGrey};
  }

  ul {
    padding: 0;

    li {
      display: block;
    }
  }
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
  width: 25%;
  padding: 0.5em;
`;

const CollectionListsPage = ({ myval, onAddList, match }) => {
  const { loading, error, data } = useQuery(questionnaireCollectionListsQuery, {
    fetchPolicy: "network-only",
  });

  const [DeleteList] = useMutation(deleteCollectionListMutation, {
    update(cache, { data: { deleteCollectionListMutation } }) {
      console.log("mutation");
      cache.writeQuery({
        query: questionnaireCollectionListsQuery,
        variables: {
          input: { id },
        },
        data: { lists: deleteCollectionListMutation },
      });
    },
  });

  if (loading) {
    return <Loading height="100%">Questionnaire lists loading…</Loading>;
  }
  let lists = [];

  if (data) {
    lists = data.lists;
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
          The Collection Lists is used to store respondent answers to a specific
          question for example, the names of all the persons residing in a
          household. The structure of the Collection Lists is defined with the
          answer types that together make up a single entry on the list for
          example, first name, middle name, and last name.
        </Text>
        <Twistie title="What is the List Collector questionnaire design pattern?">
          <Text>
            Collection Lists are the first essential element of the List
            Collector questionnaire design pattern. This design pattern provides
            and efficient EQ solution to the problem of data collection on a
            variables number of subjects. For example, collecting the name, age
            and nationality of each person residing in the household.
          </Text>
          <Text>
            The second essential element of the design pattern is the List
            Collector which captures a list of all persons in the household from
            the respondnet.
          </Text>
          <Text>
            The third essential element of the design pattern is the Repeating
            Question which then collects, in turn, the age and nationality of
            each of the persons on the Collection Lists.
          </Text>
        </Twistie>
        <AddListCollectionButton
          variant="secondary"
          data-test="btn-add-answer"
          onClick={onAddList}
        >
          <IconText icon={AddIcon}>
            Add {myval ? "a" : "another"} list collection
          </IconText>
        </AddListCollectionButton>

        <Margin>
          {lists === null ||
          lists === undefined ||
          !lists.length ||
          error ||
          !data ? (
            <Error>Currently no lists</Error>
          ) : (
            lists.map(({ id, displayName, deleteList }) => (
              <CollectionListItem
                key={id}
                itemId={id}
                displayName={displayName}
                handleDeleteList={(id) =>
                  deleteList({
                    variables: {
                      input: {
                        id: id,
                      },
                    },
                  })
                }
              />
            ))
          )}
        </Margin>
      </StyledGrid>
    </Container>
  );
};

CollectionListsPage.propTypes = {
  onAddList: PropTypes.func,
  myval: PropTypes.bool,
};
export default CollectionListsPage;
