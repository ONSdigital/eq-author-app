import React from "react";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import styled from "styled-components";
import { flowRight } from "lodash";

import withUpdatePage from "App/questionPage/Design/withUpdatePage";

import Property from "./Property";

import { colors } from "constants/theme";

const PropertiesPanelTitle = styled.h2`
  text-transform: uppercase;
  font-size: 0.8em;
  letter-spacing: 0.05em;
  vertical-align: middle;
  color: ${colors.darkGrey};
  text-align: center;
`;

const Properties = styled.div`
  padding: 0.5em 1em;
  border-bottom: 8px solid ${colors.lighterGrey};
`;

const PropertyDescription = styled.p`
  display: none;
  font-weight: normal;
  margin: 0 0 0.5em;
  font-size: 0.9em;
  ${colors.darkGrey}
`;

export class UnwrappedQuestionProperties extends React.Component {
  static propTypes = {
    page: CustomPropTypes.page,
    onUpdatePage: PropTypes.func.isRequired,
  };

  handleChange = ({ name, value }) => {
    const { page, onUpdatePage } = this.props;

    onUpdatePage({
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
      <Properties>
        <PropertiesPanelTitle>Optional fields</PropertiesPanelTitle>
        <Property
          id="descriptionEnabled"
          data-test="descriptionEnabled"
          checked={descriptionEnabled}
          onChange={this.handleChange}
        >
          Question description
        </Property>

        <PropertyDescription>
          To provide added context to the question.
        </PropertyDescription>

        <Property
          id="definitionEnabled"
          data-test="definitionEnabled"
          checked={definitionEnabled}
          onChange={this.handleChange}
        >
          Question definition
        </Property>

        <PropertyDescription>
          Only to be used to define word(s) or acronym(s) within the question.
        </PropertyDescription>

        <Property
          id="guidanceEnabled"
          data-test="guidanceEnabled"
          checked={guidanceEnabled}
          onChange={this.handleChange}
        >
          Include/exclude
        </Property>

        <PropertyDescription>
          Only to be used to state what should be included or excluded from the
          answer.
        </PropertyDescription>

        <Property
          id="additionalInfoEnabled"
          data-test="additionalInfoEnabled"
          checked={additionalInfoEnabled}
          onChange={this.handleChange}
        >
          Additional information
        </Property>

        <PropertyDescription>
          Information regarding why we are asking this question.
        </PropertyDescription>
      </Properties>
    );
  }
}

export default flowRight(withUpdatePage)(UnwrappedQuestionProperties);
