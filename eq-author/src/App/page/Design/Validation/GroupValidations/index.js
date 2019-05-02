import React, { Component } from "react";
import styled from "styled-components";
import { get, isNil } from "lodash";
import PropTypes from "prop-types";

import SidebarButton, { Title, Detail } from "components/buttons/SidebarButton";
import Button from "components/buttons/Button";
import ModalDialog from "components/modals/ModalDialog";

import { CURRENCY, PERCENTAGE } from "constants/answer-types";

import TotalValidation from "./TotalValidation";

import IconTotal from "./icon-calculator.svg?inline";

export const TotalButton = styled(SidebarButton)`
  display: flex;
  align-items: center;
  padding-right: 2em;
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
    width: 40em;
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

class GroupValidations extends Component {
  static propTypes = {
    totalValidation: PropTypes.shape({
      entityType: PropTypes.string.isRequired,
      custom: PropTypes.number,
      previousAnswer: PropTypes.shape({
        displayName: PropTypes.string.isRequired,
      }),
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
    const total = this.props.totalValidation;
    return (
      <>
        <TotalButton
          onClick={this.handleButtonClick}
          data-test="sidebar-button-total-value"
          disabled={!total}
        >
          <TotalIcon />
          <Details>{this.renderContents() || <Title>Total</Title>}</Details>
        </TotalButton>
        <GroupValidationModal
          isOpen={this.state.isModalOpen}
          onClose={this.handleModalClose}
        >
          <TotalValidation total={total} type={this.props.type} />
          <Buttons>
            <Button onClick={this.handleModalClose}>Done</Button>
          </Buttons>
        </GroupValidationModal>
      </>
    );
  }
}
export default GroupValidations;
