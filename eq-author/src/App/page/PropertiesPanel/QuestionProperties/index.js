import React from "react";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import styled from "styled-components";
import { flowRight } from "lodash";

import withUpdateQuestionPage from "App/page/Design/QuestionPageEditor/withUpdateQuestionPage";
import { Label } from "components/Forms";
import ContentCollapsible from "components/Collapsible/ContentCollapsible";

import AdditionalContentOptions from "./AdditionalContentOptions";

import Property from "./Property";

import { colors } from "constants/theme";

export const HelpButton = styled.button`
  --color-text: ${colors.primary};
  background: ${colors.white};
  margin: 0.5em 0;
  position: relative;
  left: -0.5em;
  padding: 0;
  font-size: 0.9em;
  font-weight: bold;
  border: none;
  cursor: pointer;
  &:focus {
    outline: 2px solid ${colors.tertiary};
  }
`;

const HorizontalSeparator = styled.hr`
  border: 0;
  border-top: 0.0625em solid ${colors.grey};
  margin: 1em 0;
  margin-left: 0.93em;
  width: 95%;
`;

const Caption = styled.p`
  margin-top: 0.2em;
  margin-bottom: 0.45em;
  margin-left: 1em;
  font-size: 0.85em;
`;
export class UnwrappedQuestionProperties extends React.Component {
  static propTypes = {
    page: CustomPropTypes.page,
    onUpdateQuestionPage: PropTypes.func.isRequired,
    onChange: PropTypes.func,
    onUpdate: PropTypes.func,
    fetchAnswers: PropTypes.func,
  };

  handleChange = ({ name, value }) => {
    const { page, onUpdateQuestionPage } = this.props;

    onUpdateQuestionPage({
      ...page,
      [name]: value,
    });
  };

  render() {
    const {
      page: {
        descriptionEnabled,
        definitionEnabled,
        guidanceEnabled,
        additionalInfoEnabled,
      },
    } = this.props;

    const defaultOpen = () => {
      if (
        descriptionEnabled ||
        definitionEnabled ||
        guidanceEnabled ||
        additionalInfoEnabled
      ) {
        return true;
      }
    };

    const { page, onChange, onUpdate, fetchAnswers } = this.props;

    return (
      <ContentCollapsible
        title="Additional content"
        className="additionalContentCollapsible"
        defaultOpen={defaultOpen()}
      >
        <Property
          id="descriptionEnabled"
          data-test="descriptionEnabled"
          checked={descriptionEnabled}
          onChange={this.handleChange}
        >
          <Label>Question description</Label>
        </Property>
        <Caption>
          The description is used to provide added context to the question.
        </Caption>

        <AdditionalContentOptions
          onChange={onChange}
          onUpdate={onUpdate}
          page={page}
          fetchAnswers={fetchAnswers}
          option={"description"}
        />

        <HorizontalSeparator />

        <Property
          id="definitionEnabled"
          data-test="definitionEnabled"
          checked={definitionEnabled}
          onChange={this.handleChange}
        >
          <Label>Question definition</Label>
        </Property>
        <Caption>
          Only to be used to define word(s) or acronym(s) within the question.
        </Caption>

        <AdditionalContentOptions
          onChange={onChange}
          onUpdate={onUpdate}
          page={page}
          fetchAnswers={fetchAnswers}
          option={"definition"}
        />

        <HorizontalSeparator />

        <Property
          id="guidanceEnabled"
          data-test="guidanceEnabled"
          checked={guidanceEnabled}
          onChange={this.handleChange}
        >
          <Label>Include/exclude</Label>
        </Property>
        <Caption>
          Only to be used to state what should be included or excluded from the
          answer.
        </Caption>

        <AdditionalContentOptions
          onChange={onChange}
          onUpdate={onUpdate}
          page={page}
          fetchAnswers={fetchAnswers}
          option={"guidance"}
        />

        <HorizontalSeparator />

        <Property
          id="additionalInfoEnabled"
          data-test="additionalInfoEnabled"
          checked={additionalInfoEnabled}
          onChange={this.handleChange}
        >
          <Label>Additional information</Label>
        </Property>
        <Caption>
          Information regarding why we are asking this question.
        </Caption>

        <AdditionalContentOptions
          onChange={onChange}
          onUpdate={onUpdate}
          page={page}
          fetchAnswers={fetchAnswers}
          option={"additionalInfo"}
        />
      </ContentCollapsible>
    );
  }
}

export default flowRight(withUpdateQuestionPage)(UnwrappedQuestionProperties);
