import React, { Component } from "react";
import styled from "styled-components";
import { get, isNil } from "lodash";
import PropTypes from "prop-types";

import SidebarButton, { Title, Detail } from "components/buttons/SidebarButton";
import Button from "components/buttons/Button";
import ModalDialog from "components/modals/ModalDialog";
import ValidationError from "components/ValidationError";

import { CURRENCY, PERCENTAGE } from "constants/answer-types";
import { colors } from "constants/theme";
import {
  ERR_NO_VALUE,
  ERR_REFERENCE_MOVED,
  ERR_REFERENCE_DELETED,
} from "constants/validationMessages";

import TotalValidation from "./TotalValidation";

import IconTotal from "./icon-calculator.svg?inline";

export const TotalButton = styled(SidebarButton)`
  display: flex;
  align-items: center;
  padding-right: 2em;
  ${({ hasError }) =>
    hasError &&
    `
    border-color: ${colors.red};
    outline-color: ${colors.red};
    box-shadow: 0 0 0 2px ${colors.red};
    border-radius: 4px;
    margin-bottom: 0;
  `}
`;

const TotalIcon = styled(IconTotal)`
  flex: 0 0 auto;
`;

const Details = styled.div`
  margin-left: 0.1em;
  flex: 1 1 auto;
`;

export const GroupValidationModal = styled(ModalDialog)`
  .Modal {
    width: 50em;
    height: 23em;
  }
`;

const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const CONDITION = {
  GreaterThan: "more than",
  GreaterOrEqual: "more than or equal to",
  Equal: "equal to",
  LessOrEqual: "less than or equal to",
  LessThan: "less than",
};

const errorMessages = {
  ERR_NO_VALUE,
  ERR_REFERENCE_MOVED,
  ERR_REFERENCE_DELETED,
};

class GroupValidations extends Component {
  static propTypes = {
    totalValidation: PropTypes.shape({
      entityType: PropTypes.string.isRequired,
      custom: PropTypes.number,
      previousAnswer: PropTypes.shape({
        displayName: PropTypes.string.isRequired,
      }),
    }),
    validationError: PropTypes.shape({
      id: PropTypes.string,
      errors: PropTypes.arrayOf(
        PropTypes.shape({
          errorCode: PropTypes.string,
          field: PropTypes.string,
          id: PropTypes.string,
          type: PropTypes.string,
        })
      ),
      totalCount: PropTypes.number,
    }),
    type: PropTypes.string,
  };

  state = { isModalOpen: false };

  handleButtonClick = () => {
    this.setState({ isModalOpen: true });
  };
  handleModalClose = () => {
    this.setState({ isModalOpen: false });
  };

  renderContents() {
    const { totalValidation: total, type } = this.props;

    if (!total || !total.enabled) {
      return;
    }

    const isCustomValue = total.entityType === "Custom";
    const totalValue = isCustomValue
      ? total.custom
      : get(total, "previousAnswer.displayName");

    if (isNil(totalValue)) {
      return;
    }

    let formattedValue = totalValue;
    if (isCustomValue) {
      if (type === CURRENCY) {
        formattedValue = `£${totalValue}`;
      } else if (type === PERCENTAGE) {
        formattedValue = `${totalValue}%`;
      }
    }

    return (
      <>
        <Title>Total {CONDITION[total.condition]}</Title>
        <Detail>{formattedValue}</Detail>
      </>
    );
  }

  render() {
    const { totalValidation: total, validationError: errors } = this.props;

    const totalValidationErrors = errors.errors.filter(
      ({ field }) => field === "totalValidation"
    );
    const error = totalValidationErrors?.[0];

    return (
      <>
        <TotalButton
          onClick={this.handleButtonClick}
          data-test="sidebar-button-total-value"
          disabled={!total}
          hasError={Boolean(error)}
        >
          <TotalIcon />
          <Details>{this.renderContents() || <Title>Total</Title>}</Details>
        </TotalButton>
        {error && (
          <ValidationError>{errorMessages[error.errorCode]}</ValidationError>
        )}
        <GroupValidationModal
          isOpen={this.state.isModalOpen}
          onClose={this.handleModalClose}
        >
          <TotalValidation
            total={total}
            type={this.props.type}
            errors={totalValidationErrors}
          />
          <Buttons>
            <Button onClick={this.handleModalClose}>Done</Button>
          </Buttons>
        </GroupValidationModal>
      </>
    );
  }
}
export default GroupValidations;
