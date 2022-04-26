import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import gql from "graphql-tag";
import Collapsible from "components/Collapsible";
import styled, { css } from "styled-components";
import { colors } from "constants/theme";
import { filter } from "graphql-anywhere";
import Loading from "components/Loading";
import { Field, Input, Label } from "components/Forms";
import RichTextEditor from "components/RichTextEditor";
import TotalValidationRuleFragment from "graphql/fragments/total-validation-rule.graphql";
import ValidationErrorInfoFragment from "graphql/fragments/validationErrorInfo.graphql";
import UPDATE_LIST_COLLECTOR_MUTATION from "graphql/updateListCollector.graphql";
import COLLECTION_LISTS from "graphql/lists/collectionLists.graphql";
import { buildCollectionListsPath } from "utils/UrlUtils";
import PageHeader from "../PageHeader";
import { useSetNavigationCallbacksForPage } from "components/NavigationCallbacks";
import { LIST_COLLECTOR_ERRORS } from "constants/validationMessages";
import { find, some } from "lodash";
import ValidationError from "components/ValidationError";
import Icon from "assets/icon-select.svg";
import CommentFragment from "graphql/fragments/comment.graphql";

const propTypes = {
  match: CustomPropTypes.match.isRequired,
  history: CustomPropTypes.history.isRequired,
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
    anotherPositiveDescription
    anotherNegativeDescription
    addItemTitle
    alias
  }
`;

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

const TitleInputContainer = styled.div`
  width: 50%;
`;

const Text = styled.p``;

const CollapsibleContent = styled.div`
  padding-bottom: 1em;
`;

const errorCSS = css`
  ${({ hasError }) =>
    hasError &&
    css`
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
const StyledInput = styled(Input)`
  ${errorCSS}
`;

const StyledRichTextEditor = styled(RichTextEditor)`
  ${errorCSS}
`;

const CustomSelect = styled.select`
  font-size: 1em;
  border: 2px solid #d6d8da;
  border-radius: 4px;
  appearance: none;
  background: white url("${Icon}") no-repeat right center;
  position: relative;
  transition: opacity 100ms ease-in-out;
  border-radius: 4px;
  padding: 0.3em;
  color: #222222;
  display: block;
  width: 30%;
  ${errorCSS}

  &:hover {
    outline: none;
  }
`;

const RadioContainer = styled.div`
  margin: 1em 0;
  border: thin solid #999999;
  border-radius: 4px;
  padding: 1em;
  display: block;
  width: 100%;
`;

const RadionIndicator = styled.div`
  background: ${colors.lightMediumGrey};
  background-size: cover;
  height: 1.4em;
  width: 1.4em;
  display: inline-block;
  margin: 2em 1em 0 0;
  border-radius: 100%;
  flex: 0 0 auto;
`;

const RadioAnswerWrapper = styled.div`
  display: inline-block;
  width: 95%;
`;

const renderErrors = (errors, field) => {
  const errorList = errors.filter((error) => error.field === field);
  return errorList.map((error, index) => (
    <ValidationError key={index}>
      {
        find(LIST_COLLECTOR_ERRORS, {
          errorCode: error.errorCode,
          field: error.field,
        }).message
      }
    </ValidationError>
  ));
};

const UnwrappedListCollectorPageEditor = (props) => {
  const {
    history,
    match: {
      params: { questionnaireId },
    },
    page,
  } = props;
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

  const CollectionListPageLink = buildCollectionListsPath({ questionnaireId });

  const handleOnChange = (event) => {
    const updatedEntity = { ...entity };
    updatedEntity[event.name] = event.value;
    setEntity(updatedEntity);
  };

  const handleOnUpdate = (event) => {
    const inputData = event.target || event;
    if (inputData.value === "newList") {
      history.push(CollectionListPageLink);
      return;
    }
    const updatedEntity = { ...entity };
    updatedEntity[inputData.name] = inputData.value;
    setEntity(updatedEntity);
    const data = filter(inputFilter, updatedEntity);
    updateListCollectorMutation({
      variables: { input: data },
    });
  };

  const { loading, data } = useQuery(COLLECTION_LISTS, {
    fetchPolicy: "cache-and-network",
  });

  if (loading) {
    return <Loading height="100%">Questionnaire lists loading…</Loading>;
  }
  let lists = [];

  if (data) {
    lists = data.collectionLists?.lists || [];
  }
  return (
    <div data-test="list-page-editor">
      <PageHeader
        {...props}
        page={entity}
        pageType="collectionListPage"
        onUpdate={handleOnUpdate}
        onChange={handleOnChange}
        alertText="All edits, properties and routing settings will also be removed."
      />

      <StyledGrid>
        <TitleInputContainer>
          <Field>
            <Label htmlFor="title">List name</Label>
            <StyledInput
              name={"title"}
              onChange={handleOnChange}
              onBlur={handleOnUpdate}
              value={entity.title}
              data-test="list-name-input"
              hasError={some(page.validationErrorInfo.errors, {
                field: "title",
              })}
            />
          </Field>
          {renderErrors(page.validationErrorInfo.errors, "title")}
        </TitleInputContainer>
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

      <Collapsible
        title="Collection List"
        defaultOpen
        className="default-value"
        variant="content"
        withoutHideThis
      >
        <CollapsibleContent>
          The collection list contains the answer types to the collection
          question the respondent will be asked. You can create a list on the{" "}
          <a href={CollectionListPageLink}>Collection list page</a>.
        </CollapsibleContent>

        <CollapsibleContent>
          <CustomSelect
            name="listId"
            data-test="list-select"
            onChange={handleOnUpdate}
            value={entity.listId}
            hasError={some(page.validationErrorInfo.errors, {
              field: "listId",
            })}
          >
            <option value="">Select list</option>
            {lists.map((list) => (
              <option key={list.id} value={list.id}>
                {list.displayName}
              </option>
            ))}
            <option value="newList">Create new list</option>
          </CustomSelect>
          {renderErrors(page.validationErrorInfo.errors, "listId")}
        </CollapsibleContent>
      </Collapsible>

      <Collapsible
        title="Repeating list collector question"
        defaultOpen
        className="default-value"
        variant="content"
        withoutHideThis
      >
        <CollapsibleContent>
          This question is to ask respondents if they have anything to add to
          the list, if they do the collection question will add it to the list
          and return them to this question until they have nothing more to add.
        </CollapsibleContent>

        <StyledRichTextEditor
          id={`update-anotherTitle-textbox`}
          name={"anotherTitle"}
          data-test={`another-title-input`}
          onUpdate={handleOnUpdate}
          value={entity.anotherTitle}
          label=""
          controls={{
            heading: true,
            piping: true,
            emphasis: true,
            list: true,
            bold: true,
          }}
          hasError={some(page.validationErrorInfo.errors, {
            field: "anotherTitle",
          })}
        />
        {renderErrors(page.validationErrorInfo.errors, "anotherTitle")}
        <CollapsibleContent>
          <hr />
          <b>Repeating radio answer</b>
          <br />
          The repeating question answer type is a radio option, the positive
          answer takes respondents to the Collection list question and then
          returns them to the repeating question until they choose the negative
          radio option.
          <RadioContainer>
            <Field>
              <RadionIndicator />
              <RadioAnswerWrapper>
                <Label htmlFor="anotherPositive">Positive answer label</Label>
                <StyledInput
                  name={"anotherPositive"}
                  data-test="another-positive-input"
                  onChange={handleOnChange}
                  onBlur={handleOnUpdate}
                  value={entity.anotherPositive}
                  hasError={some(page.validationErrorInfo.errors, {
                    field: "anotherPositive",
                  })}
                />
                {renderErrors(
                  page.validationErrorInfo.errors,
                  "anotherPositive"
                )}
              </RadioAnswerWrapper>
            </Field>
            <Field>
              <Label htmlFor="anotherPositiveDescription">
                Description (optional)
              </Label>
              <StyledInput
                name={"anotherPositiveDescription"}
                onChange={handleOnChange}
                onBlur={handleOnUpdate}
                value={entity.anotherPositiveDescription}
              />
            </Field>
          </RadioContainer>
          {/* Negative answer label in here */}
          <RadioContainer>
            <Field>
              <RadionIndicator />
              <RadioAnswerWrapper>
                <Label htmlFor="anotherNegative">Negative answer label</Label>
                <StyledInput
                  name={"anotherNegative"}
                  data-test="another-negative-input"
                  onChange={handleOnChange}
                  onBlur={handleOnUpdate}
                  value={entity.anotherNegative}
                  hasError={some(page.validationErrorInfo.errors, {
                    field: "anotherNegative",
                  })}
                />
                {renderErrors(
                  page.validationErrorInfo.errors,
                  "anotherNegative"
                )}
              </RadioAnswerWrapper>
            </Field>
            <Field>
              <Label htmlFor="anotherNegativeDescription">
                Description (optional)
              </Label>
              <StyledInput
                name={"anotherNegativeDescription"}
                onChange={handleOnChange}
                onBlur={handleOnUpdate}
                value={entity.anotherNegativeDescription}
              />
            </Field>
          </RadioContainer>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible
        title="Collection question"
        defaultOpen
        className="default-value"
        variant="content"
        withoutHideThis
      >
        <CollapsibleContent>
          This question will be displayed along with the answer types from the
          selected collection list.
        </CollapsibleContent>

        <StyledRichTextEditor
          id={`update-addItemTitle-textbox`}
          name={"addItemTitle"}
          data-test={`add-item-title-input`}
          onUpdate={handleOnUpdate}
          value={entity.addItemTitle}
          label=""
          controls={{
            heading: true,
            piping: true,
            emphasis: true,
            list: true,
            bold: true,
          }}
          hasError={some(page.validationErrorInfo.errors, {
            field: "addItemTitle",
          })}
        />
        {renderErrors(page.validationErrorInfo.errors, "addItemTitle")}
      </Collapsible>
    </div>
  );
};

UnwrappedListCollectorPageEditor.propTypes = propTypes;

UnwrappedListCollectorPageEditor.fragments = {
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
      anotherPositiveDescription
      anotherNegativeDescription
      addItemTitle
      alias
      comments {
        ...Comment
      }
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
    ${CommentFragment}
    ${ValidationErrorInfoFragment}
    ${TotalValidationRuleFragment}
  `,
};

export default UnwrappedListCollectorPageEditor;
