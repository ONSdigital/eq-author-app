import React from "react";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import styled from "styled-components";
import { flowRight } from "lodash";

import withUpdateQuestionPage from "App/page/Design/QuestionPageEditor/withUpdateQuestionPage";
import { Label } from "components/Forms";
import Collapsible from "components/Collapsible";

import AdditionalContentOptions from "./AdditionalContentOptions";

import Property from "./Property";

import { colors } from "constants/theme";

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
    variant: PropTypes.string,
  };

  handleChange = ({ name, value }) => {
    const { page, onUpdateQuestionPage } = this.props;
    console.log("page :>> ", page);

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

    const defaultOpen = () =>
      descriptionEnabled ||
      definitionEnabled ||
      guidanceEnabled ||
      additionalInfoEnabled;

    const { page, onChange, onUpdate, fetchAnswers, variant } = this.props;

    return (
      <Collapsible
        title="Additional content"
        className="additionalContentCollapsible"
        defaultOpen={defaultOpen()}
        withoutHideThis
        variant={variant}
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
      </Collapsible>
    );
  }
}

export default flowRight(withUpdateQuestionPage)(UnwrappedQuestionProperties);
