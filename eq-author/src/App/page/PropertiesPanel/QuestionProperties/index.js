import React from "react";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import styled from "styled-components";
import { flowRight } from "lodash";

import withUpdateQuestionPage from "App/page/Design/QuestionPageEditor/withUpdateQuestionPage";
import { Label } from "components/Forms";

import Property from "./Property";

import { colors } from "constants/theme";

const PropertyDescription = styled.p`
  display: none;
  font-weight: normal;
  margin: 0 0 0.5em;
  font-size: 0.9em;
  ${colors.darkGrey}
`;

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
  border-top: 0.0625em solid ${colors.lightMediumGrey};
  margin: 1em 0;
  width: 99%;
`;

const Caption = styled.p`
  margin-top: 0.2em;
  margin-bottom: 0.6em;
  margin-left: 1em;
  font-size: 0.85em;
`;

export class UnwrappedQuestionProperties extends React.Component {
  static propTypes = {
    page: CustomPropTypes.page,
    onUpdateQuestionPage: PropTypes.func.isRequired,
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

    return (
      <>
        <Property
          id="descriptionEnabled"
          data-test="descriptionEnabled"
          checked={descriptionEnabled}
          onChange={this.handleChange}
        >
          <Label>Question description</Label>
        </Property>
        <Caption>To provide added context to the question.</Caption>

        <PropertyDescription>
          To provide added context to the question.
        </PropertyDescription>

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

        <PropertyDescription>
          Only to be used to define word(s) or acronym(s) within the question.
        </PropertyDescription>

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

        <PropertyDescription>
          Only to be used to state what should be included or excluded from the
          answer.
        </PropertyDescription>

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

        <PropertyDescription>
          Information regarding why we are asking this question.
        </PropertyDescription>
      </>
    );
  }
}

export default flowRight(withUpdateQuestionPage)(UnwrappedQuestionProperties);
