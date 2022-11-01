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
import ToggleSwitch from "components/buttons/ToggleSwitch";

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
    drivingQuestion
    additionalGuidancePanel
    additionalGuidancePanelSwitch
    drivingPositive
    drivingNegative
    drivingPositiveDescription
    drivingNegativeDescription
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

const QuestionRender = styled.div``;

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
  padding: 0.3em 1.5em 0.3em 0.3em;
  color: #222222;
  display: block;
  min-width: 30%;
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

const InlineField = styled(Field)`
  display: flex;
  align-items: center;
  margin-bottom: ${(props) => (props.open ? "0.4em" : "2em")};
  > * {
    margin-bottom: 0;
  }
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
          The list collector is made up of three questions, a driving question,
          a repeating question and a collection question. These become available
          once you select a collection list to link them to.
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
              Inside a questionnaire in Author, select the Collection lists page
              from the main menu.
            </ListItem>
            <ListItem>Select the Create a collection list.</ListItem>
            <ListItem>
              Enter a collection list name that appears, call it Householders
              list.
            </ListItem>
            <ListItem>
              Select the Add an answer option and choose a Text answer type from
              the menu.These are the answers that will be collected for the
              list.
            </ListItem>
            <ListItem>
              nter the label First name in the answer container.
            </ListItem>
            <ListItem>
              Select the Add another answer option and again choose a Text
              answer type from the menu.
            </ListItem>
            <ListItem>
              Enter the label Last name in the answer container.
            </ListItem>
            <ListItem>
              Go to the content menu of the questionnaire where you want to add
              the List Collector. Select List Collector from the Add/Import
              content menu.
            </ListItem>
            <ListItem>
              Name the List Collector page Household question. Naming the page
              is optional, if left blank it appears as the default Unnamed list
              collector.
            </ListItem>
            <ListItem>
              In the Collection list container, Select Householders list from
              the dropdown menu.
            </ListItem>
            <ListItem>
              Once the list is selected, new containers appear titled driving
              question, collection question and repeating question.
            </ListItem>
            <ListItem>
              In the driving question container enter the question Does anyone
              live in the household? In the positive answer label enter Yes,
              someone lives there and in the negative answer label enter No,
              nobody lives there.
            </ListItem>
            <ListItem>
              The driving and repeating question radio answers have logic
              already built in, so if the respondent selects the positive answer
              option they will return to the collection question. If they select
              the negative answer option they will leave the list collector
              page.
            </ListItem>
            <ListItem>
              In the collection question container enter the question Who do you
              need to add to the household? The answer types that go with this
              question come from the collection list itself. In this case two
              text answers labeled First name and Last name.
            </ListItem>
            <ListItem>
              The repeating question is basically a variation of the driving
              question and will repeat for every subsequent person to add to the
              list. In the repeating question container enter the question Does
              anyone else live in the household? In the positive answer label
              enter Yes, someone else lives there and in the negative answer
              label enter No, nobody else lives there.
            </ListItem>
            <ListItem>
              The list collector is now complete and ready for use.
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
      {/* Contiotonal render this START */}
      {entity.listId ? (
        <QuestionRender>
          <Collapsible
            title="Driving question"
            defaultOpen
            className="default-value"
            variant="content"
            withoutHideThis
          >
            <CollapsibleContent>
              The initial driving question is asking the respondent if they have
              anything that will be added to the list. If they do they go to the
              collection question and then onto the repeating question until
              they have nothing more to add to the list.
            </CollapsibleContent>

            <StyledRichTextEditor
              id={`update-drivingQuestion-textbox`}
              name={"drivingQuestion"}
              data-test={`driving-question-input`}
              onUpdate={handleOnUpdate}
              value={entity.drivingQuestion}
              label=""
              controls={{
                heading: true,
                piping: true,
                emphasis: true,
                list: true,
                bold: true,
              }}
              hasError={some(page.validationErrorInfo.errors, {
                field: "drivingQuestion",
              })}
            />
            {renderErrors(page.validationErrorInfo.errors, "drivingQuestion")}
            <InlineField open={entity.additionalGuidancePanelSwitch}>
              <Label htmlFor="toggle-additional-guidance-panel">
                Additional guidance panel
              </Label>

              <ToggleSwitch
                id="toggle-additional-guidance-panel"
                name="toggle-additional-guidance-panel"
                hideLabels={false}
                  onChange={() =>
                      updateListCollectorMutation({
                        variables: {
                          input: {
                            id: entity.id,
                            drivingQuestion: entity.drivingQuestion,
                            drivingPositive: entity.drivingPositive,
                            drivingPositiveDescription: entity.drivingPositiveDescription,
                            drivingNegative: entity.drivingNegative,
                            drivingNegativeDescription: entity.drivingNegativeDescription,
                            anotherTitle: entity.anotherTitle,
                            anotherPositive: entity.anotherPositive,
                            anotherPositiveDescription: entity.anotherPositiveDescription,
                            anotherNegative: entity.anotherNegative,
                            anotherNegativeDescription: entity.anotherNegativeDescription,
                            additionalGuidancePanelSwitch: !entity.additionalGuidancePanelSwitch,
                            additionalGuidancePanel: entity.additionalGuidancePanel,
                      } },
                      })
                }
                checked={entity.additionalGuidancePanelSwitch}
              />
            </InlineField>
            {entity.additionalGuidancePanelSwitch ? (
              <RichTextEditor
                id={`details-additionalGuidancePanel-${entity.id}`}
                name="additionalGuidancePanel"
                value={entity.additionalGuidancePanel}
                label=""
                  onUpdate={({ value }) =>
                      updateListCollectorMutation({
                        variables: { input: {
                          id: entity.id,
                          drivingQuestion: entity.drivingQuestion,
                          drivingPositive: entity.drivingPositive,
                          drivingPositiveDescription: entity.drivingPositiveDescription,
                          drivingNegative: entity.drivingNegative,
                          drivingNegativeDescription: entity.drivingNegativeDescription,
                          anotherTitle: entity.anotherTitle,
                          anotherPositive: entity.anotherPositive,
                          anotherPositiveDescription: entity.anotherPositiveDescription,
                          anotherNegative: entity.anotherNegative,
                          anotherNegativeDescription: entity.anotherNegativeDescription,
                          additionalGuidancePanelSwitch: entity.additionalGuidancePanelSwitch,
                          additionalGuidancePanel: value,
                      } },
                      })
                }
                multiline
                controls={{
                  heading: true,
                  list: true,
                  bold: true,
                  link: true,
                }}
                testSelector="txt-collapsible-additionalGuidancePanel"
              />
            ) : null}
            <RadioContainer>
              <Field>
                <RadionIndicator />
                <RadioAnswerWrapper>
                  <Label htmlFor="drivingPositive">Positive answer label</Label>
                  <StyledInput
                    name={"drivingPositive"}
                    data-test="driving-positive-input"
                    onChange={handleOnChange}
                    onBlur={handleOnUpdate}
                    value={entity.drivingPositive}
                    hasError={some(page.validationErrorInfo.errors, {
                      field: "drivingPositive",
                    })}
                  />
                  {renderErrors(
                    page.validationErrorInfo.errors,
                    "drivingPositive"
                  )}
                </RadioAnswerWrapper>
              </Field>
              <Field>
                <Label htmlFor="drivingPositiveDescription">
                  Description (optional)
                </Label>
                <StyledInput
                  name={"drivingPositiveDescription"}
                  onChange={handleOnChange}
                  onBlur={handleOnUpdate}
                  value={entity.drivingPositiveDescription}
                />
              </Field>
            </RadioContainer>
            {/* Negative answer label in here */}
            <RadioContainer>
              <Field>
                <RadionIndicator />
                <RadioAnswerWrapper>
                  <Label htmlFor="drivingNegative">Negative answer label</Label>
                  <StyledInput
                    name={"drivingNegative"}
                    data-test="driving-negative-input"
                    onChange={handleOnChange}
                    onBlur={handleOnUpdate}
                    value={entity.drivingNegative}
                    hasError={some(page.validationErrorInfo.errors, {
                      field: "drivingNegative",
                    })}
                  />
                  {renderErrors(
                    page.validationErrorInfo.errors,
                    "drivingNegative"
                  )}
                </RadioAnswerWrapper>
              </Field>
              <Field>
                <Label htmlFor="drivingNegativeDescription">
                  Description (optional)
                </Label>
                <StyledInput
                  name={"drivingNegativeDescription"}
                  onChange={handleOnChange}
                  onBlur={handleOnUpdate}
                  value={entity.drivingNegativeDescription}
                />
              </Field>
            </RadioContainer>
          </Collapsible>

          <Collapsible
            title="Collection question"
            defaultOpen
            className="default-value"
            variant="content"
            withoutHideThis
          >
            <CollapsibleContent>
              This question will be displayed along with the answer types from
              the selected collection list.
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

          <Collapsible
            title="Repeating question"
            defaultOpen
            className="default-value"
            variant="content"
            withoutHideThis
          >
            <CollapsibleContent>
              This question is to ask respondents if they have anything to add
              to the list, if they do the collection question will add it to the
              list and return them to this question until they have nothing more
              to add.
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
              returns them to the repeating question until they choose the
              negative radio option.
              <RadioContainer>
                <Field>
                  <RadionIndicator />
                  <RadioAnswerWrapper>
                    <Label htmlFor="anotherPositive">
                      Positive answer label
                    </Label>
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
                    <Label htmlFor="anotherNegative">
                      Negative answer label
                    </Label>
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
        </QuestionRender>
      ) : (
        <QuestionRender />
      )}
      {/* Contiotonal render this END */}
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
      drivingQuestion
      additionalGuidancePanel
      additionalGuidancePanelSwitch
      drivingPositive
      drivingNegative
      drivingPositiveDescription
      drivingNegativeDescription
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
