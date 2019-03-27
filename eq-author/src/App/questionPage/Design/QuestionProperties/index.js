import React from "react";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import styled from "styled-components";
import { flowRight } from "lodash";

import withUpdatePage from "App/questionPage/Design/withUpdatePage";
import HelpModal from "./HelpModal";
import IconText from "components/IconText";

import Property from "./Property";
import InfoIcon from "./icon-info.svg?inline";

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

  state = {
    showModal: false,
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

        <HelpButton onClick={() => this.setState({ showModal: true })}>
          <IconText icon={InfoIcon}>See how these fields are used</IconText>
        </HelpButton>

        <HelpModal
          isOpen={this.state.showModal}
          onClose={() => this.setState({ showModal: false })}
        />
      </>
    );
  }
}

export default flowRight(withUpdatePage)(UnwrappedQuestionProperties);
