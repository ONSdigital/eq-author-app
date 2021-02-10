import React, { Component } from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import { propType } from "graphql-anywhere";
import { find } from "lodash";
import gql from "graphql-tag";

import { colors } from "constants/theme";
import { MenuItemType } from "components/ContentPickerv2/Menu";
import CalSumContentPicker from "./CalSumContentPicker";
import shapeTree from "components/ContentPicker/shapeTree";
import Button from "components/buttons/Button";
import TextButton from "components/buttons/TextButton";
import withValidationError from "enhancers/withValidationError";
import ErrorInline from "components/ErrorInline";
import {
  CALCSUM_ANSWER_NOT_SELECTED,
  CALCSUM_SUMMARY_ANSWERS_THE_SAME,
  buildLabelError,
} from "constants/validationMessages";

import AnswerChip from "./AnswerChip";
import iconInfo from "./icon-info.svg";

const Box = styled.div`
  border: 1px solid ${colors.borders};
  border-radius: 3px;
  margin-bottom: 2em;
  overflow: hidden;
`;

const RemoveAllButton = styled(TextButton)`
  letter-spacing: 0.05rem;
  font-weight: bold;
  font-size: 0.8rem;
  margin: 0 0 0 auto;
`;

const Answers = styled.div`
  padding: 1em;
`;

const SectionList = styled.ul`
  list-style: none;
  margin: 0 0 0.5em;
  padding: 0;
`;

const SectionListItem = styled.li`
  margin: 0;
`;

const SectionHeader = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 0.7em;
`;

const SectionTitle = styled.div`
  font-weight: bold;
  font-size: 0.9em;
  color: #807d77;
`;

const AnswerList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-flow: row wrap;
`;

const AnswerListItem = styled.li`
  margin: 0 0 0.5em;
  width: 100%;

  &:last-of-type {
    margin-bottom: 0;
  }
`;

const SelectButton = styled(Button)`
  width: 100%;
`;

const Empty = styled.div`
  color: #7a7a7a;
  text-align: center;
  padding: 1em 2em 2em;

  &::before {
    display: block;
    content: url(${iconInfo});
  }
`;

const EmptyTitle = styled.h3`
  font-size: 1em;
  margin: 0 0 0.5em;
`;

const EmptyButton = styled(Button)`
  padding: 0.5em 1em;
`;

const EmptyText = styled.div`
  font-size: 0.9em;
  margin-bottom: 1em;
`;

const ErrorContainer = styled.div`
  border: 1px solid red;
  padding: 10px;
  position: relative;
`;

const TypeChip = styled(MenuItemType)`
  color: ${colors.text};
  float: right;
`;

const ChipText = styled.div`
  max-width: 30em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  float: left;
`;

export const ErrorContext = styled.div`
  position: relative;

  ${props =>
    props.isInvalid &&
    css`
      margin-bottom: 2.5em;
      border: 1px solid ${colors.red};
      padding: 1em;
    `}
`;

export class UnwrappedAnswerSelector extends Component {
  state = {
    showPicker: false,
  };

  handleRemoveAnswers(answers) {
    const {
      onUpdateCalculatedSummaryPage,
      page,
      page: { summaryAnswers },
    } = this.props;
    const newSelectedValues = summaryAnswers.filter(
      selectedSummaryAnswer =>
        !find(answers, answer => answer.id === selectedSummaryAnswer.id)
    );
    onUpdateCalculatedSummaryPage({
      id: page.id,
      summaryAnswers: newSelectedValues,
    });
  }

  handlePickerOpen = () => {
    this.setState({ showPicker: true });
  };

  handlePickerClose = () => {
    this.setState({ showPicker: false });
  };

  handlePickerSubmit = answers => {
    const { onUpdateCalculatedSummaryPage, page } = this.props;

    this.setState({ showPicker: false });
    onUpdateCalculatedSummaryPage({
      id: page.id,
      summaryAnswers: answers,
    });
  };

  renderAnswers(answers, answerType) {
    const unitInconsistencyError = this.props.getValidationError({
      field: "summaryAnswers",
      message: CALCSUM_SUMMARY_ANSWERS_THE_SAME,
    });

    const minOfTwoAnswersError = this.props.getValidationError({
      field: "summaryAnswers",
      message: CALCSUM_ANSWER_NOT_SELECTED,
    });

    const { section } = this.props.page;
    const unit = answers[0].properties.unit;

    let errorMsg;

    if (unit !== undefined) {
      errorMsg = buildLabelError(
        CALCSUM_ANSWER_NOT_SELECTED,
        `${unit.toLowerCase()}`,
        20,
        19
      );
    } else {
      errorMsg = buildLabelError(
        CALCSUM_ANSWER_NOT_SELECTED,
        `${answers[0].type.toLowerCase()}`,
        20,
        19
      );
    }

    const isInvalid = unitInconsistencyError || minOfTwoAnswersError;

    return (
      <div>
        <SectionList>
          <SectionListItem key={section.id}>
            <SectionHeader>
              <SectionTitle>
                {answerType} answers in {section.displayName}
              </SectionTitle>
              <RemoveAllButton
                data-test="remove-all"
                onClick={() => {
                  this.handleRemoveAnswers(answers);
                }}
              >
                Remove all
              </RemoveAllButton>
            </SectionHeader>
            <ErrorContext isInvalid={isInvalid}>
              <AnswerList>
                {answers.map(answer => (
                  <AnswerListItem key={answer.id}>
                    <AnswerChip
                      onRemove={() => this.handleRemoveAnswers([answer])}
                    >
                      <ChipText>{answer.displayName}</ChipText>
                      {answer.properties.unit && (
                        <TypeChip key={answer.properties.unit}>
                          {answer.properties.unit}
                        </TypeChip>
                      )}
                      <TypeChip key={answer.type}>{answer.type}</TypeChip>
                    </AnswerChip>
                  </AnswerListItem>
                ))}
              </AnswerList>
              {minOfTwoAnswersError && <ErrorInline>{errorMsg}</ErrorInline>}
            </ErrorContext>
          </SectionListItem>
        </SectionList>
        <SelectButton
          variant="secondary"
          onClick={this.handlePickerOpen}
          data-test="answer-selector"
        >
          Select another {(answerType || "answer").toLowerCase()} answer
        </SelectButton>
      </div>
    );
  }

  renderEmptyState(availableSummaryAnswers) {
    const { getValidationError } = this.props;
    const isAvailableAnswers = availableSummaryAnswers.length > 0;

    const errorValidationMsg = getValidationError({
      field: "summaryAnswers",
      message: CALCSUM_ANSWER_NOT_SELECTED,
    });

    const title = isAvailableAnswers
      ? "No answers selected"
      : "No answers available";
    const text = isAvailableAnswers
      ? "Select an answer using the button below."
      : "There are no answers to provide a calculated summary.";
    return (
      <div>
        <Empty>
          <EmptyTitle>{title}</EmptyTitle>
          <EmptyText>{text}</EmptyText>
          <ErrorContainer>
            <EmptyButton
              small
              onClick={this.handlePickerOpen}
              data-test="answer-selector-empty"
              disabled={!isAvailableAnswers}
            >
              Select an answer
            </EmptyButton>
            <ErrorInline>{errorValidationMsg}</ErrorInline>
          </ErrorContainer>
        </Empty>
      </div>
    );
  }

  render() {
    const {
      page: { summaryAnswers, availableSummaryAnswers },
    } = this.props;

    let answerType;
    if (summaryAnswers.length > 0) {
      answerType = summaryAnswers[0].type;
    }

    return (
      <div>
        <Box>
          <Answers>
            {summaryAnswers.length > 0
              ? this.renderAnswers(summaryAnswers, answerType)
              : this.renderEmptyState(availableSummaryAnswers)}
            <CalSumContentPicker
              isOpen={this.state.showPicker}
              onClose={this.handlePickerClose}
              onSubmit={this.handlePickerSubmit}
              startingSelectedAnswers={summaryAnswers}
              data={shapeTree(availableSummaryAnswers)}
            />
          </Answers>
        </Box>
      </div>
    );
  }
}

UnwrappedAnswerSelector.fragments = {
  AnswerSelector: gql`
    fragment AnswerSelector on CalculatedSummaryPage {
      id
      section {
        id
        displayName
        questionnaire {
          id
          metadata {
            id
            displayName
          }
        }
      }
      summaryAnswers {
        id
        displayName
        type
        properties
      }
      availableSummaryAnswers {
        id
        displayName
        type
        properties
        page {
          id
          displayName
          section {
            id
            displayName
          }
        }
      }
    }
  `,
};

UnwrappedAnswerSelector.propTypes = {
  onUpdateCalculatedSummaryPage: PropTypes.func.isRequired,
  page: propType(UnwrappedAnswerSelector.fragments.AnswerSelector),
  getValidationError: PropTypes.func.isRequired,
};

export default withValidationError("page")(UnwrappedAnswerSelector);
