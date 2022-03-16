import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/react-hooks";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import gql from "graphql-tag";
import Collapsible from "components/Collapsible";
import styled from "styled-components";
import { colors } from "constants/theme";
import { filter } from "graphql-anywhere";

import focusOnEntity from "utils/focusOnEntity";
import TotalValidationRuleFragment from "graphql/fragments/total-validation-rule.graphql";
import ValidationErrorInfoFragment from "graphql/fragments/validationErrorInfo.graphql";
import UPDATE_LIST_COLLECTOR_MUTATION from "graphql/updateListCollector.graphql";

import PageHeader from "../PageHeader";

import {
  ERR_NO_VALUE,
  ERR_REFERENCE_MOVED,
  ERR_REFERENCE_DELETED,
} from "constants/validationMessages";

import { useSetNavigationCallbacksForPage } from "components/NavigationCallbacks";

const propTypes = {
  match: CustomPropTypes.match.isRequired,
  page: CustomPropTypes.page.isRequired,
  onChange: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  enableValidationMessage: PropTypes.bool,
  onUpdateListCollectorPage: PropTypes.func,
};

const inputFilter = gql`
  {
    id
    title
    listId
    anotherTitle
    anotherPositive
    anotherNegative
    addItemTitle
    alias
  }
`;

const UnwrappedListCollectorEditor = (props) => {
  const { page } = props;
  const [updateListCollectorMutation] = useMutation(
    UPDATE_LIST_COLLECTOR_MUTATION
  );

  useSetNavigationCallbacksForPage({
    page: page,
    folder: page?.folder,
    section: page?.section,
  });

  const [entity, setEntity] = useState(page);

  useEffect(() => {
    setEntity(entity);
  }, [entity]);

  const handleOnChange = (event) => {
    const updatedEntity = { ...entity };
    updatedEntity[event.name] = event.value;
    setEntity(updatedEntity);
  };

  const StyledGrid = styled.div`
    display: flex;
    flex-direction: column;
    padding: 1em;
    /* border: 1px solid ${colors.lightGrey}; */
    margin: 0.5em 1em;
  `;

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
  const handleOnUpdate = (temp) => {
    const data = filter(inputFilter, temp);
    updateListCollectorMutation({
      variables: { input: data },
    });
  };

  const totalValidationErrors = page.validationErrorInfo.errors.filter(
    ({ field }) => field === "totalValidation"
  );
  const error = totalValidationErrors?.[0];

  const errorMessages = {
    ERR_NO_VALUE,
    ERR_REFERENCE_MOVED,
    ERR_REFERENCE_DELETED,
  };

  return (
    <div data-test="question-page-editor">
      <PageHeader
        {...props}
        page={entity}
        onUpdate={() => handleOnUpdate(entity)}
        onChange={handleOnChange}
        alertText="All edits, properties and routing settings will also be removed."
      />
      <StyledGrid>
        <Text>
          <b>List collector</b>
          <br />
          The list collector is the way to recreate the List collector
          questionnaire design pattern. This is made up of two questions, a
          repeating list question and a collection question. These become
          available once you select a collection list to link them to.
        </Text>

        <Collapsible title="How to create the List Collector questionnaire design pattern in Author?">
          <Text>
            To create the list collector pattern in Author we do this in the
            following steps:
          </Text>
          <List>
            <ListItem>
              Go to the Collection Lists page on the left hand menu and create a
              Collection list.
            </ListItem>
            <ListItem>
              Add the answers you need to collect that will make up each item on
              the list, for example adding two text field answer types to
              collect the respondents first name and last name.
            </ListItem>
            <ListItem>
              In the questionnaire add a List collector page via the add/import
              menu.
            </ListItem>
            <ListItem>
              On the new List collector page there is Collection list area where
              you must select a list from the dropdown menu, this menu will show
              any lists that have been created in the Collection lists page.
            </ListItem>
            <ListItem>
              Once the list is selected two new containers appear on the page,
              these contain the two questions which will help compile the list.
              These are the Repeating list collector question and the Collection
              question.
            </ListItem>
            <ListItem>
              These two questions will repeat for the respondent until there is
              nothing else to add to the list and they select the negative radio
              option, for example (a) does anyone else live in the household? if
              yes then, (b) what is their name?
            </ListItem>
            <ListItem>
              Each time the respondent adds to the list this a summary of the
              list will be displayed on the Repeating list collector question.
            </ListItem>
          </List>
        </Collapsible>
      </StyledGrid>
    </div>
  );
};

UnwrappedListCollectorEditor.propTypes = propTypes;

UnwrappedListCollectorEditor.fragments = {
  ListCollectorPage: gql`
    fragment ListCollectorPage on ListCollectorPage {
      id
      title
      displayName
      pageType
      listId
      position
      anotherTitle
      anotherPositive
      anotherNegative
      addItemTitle
      alias
      folder {
        id
        position
      }
      section {
        id
        position
        questionnaire {
          id
          metadata {
            id
            displayName
            type
            key
          }
        }
      }
      totalValidation {
        ...TotalValidationRule
      }
      validationErrorInfo {
        ...ValidationErrorInfo
      }
    }
    ${ValidationErrorInfoFragment}
    ${TotalValidationRuleFragment}
  `,
};

export default UnwrappedListCollectorEditor;
