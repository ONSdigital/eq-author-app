import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";

import SidebarButton, {
  Title,
  Detail
} from "components/buttons/SidebarButton/index.js";

import ModalWithNav from "components/modals/ModalWithNav";

import MinValueValidation from "./TotalMinValue";
import MaxValueValidation from "./TotalMaxValue";

import ValidationContext from "./ValidationContext";
import { gotoTab } from "redux/tabs/actions";
import { CURRENCY, NUMBER } from "constants/answer-types";
import { get } from "lodash";

const SectionTitle = styled.h3`
  margin: 0 0 0.5em 0;
  padding: 0;
  font-size: 1em;
  color: #666666;
  position: relative;
`;

const Container = styled.div`
  padding: 0.25em 0 0;
`;

const validationTypes = [
  {
    id: "minValue",
    title: "Equals",
    render: props => <MinValueValidation {...props} />,
    types: [CURRENCY, NUMBER],
    preview: ({ custom, previousAnswer }) =>
      custom ? custom : get(previousAnswer, "displayName")
  },
  {
    id: "maxValue",
    title: "Max Value",
    render: props => <MaxValueValidation {...props} />,
    types: [CURRENCY, NUMBER],
    preview: ({ custom, previousAnswer }) =>
      custom ? custom : get(previousAnswer, "displayName")
  }
];

class TotalValidation extends React.Component {
  constructor(props) {
    super(props);
    this.modalId = `modal-validation-total`;

    this.state = {
      modalIsOpen: false,
      answer: {
        id: this.props.answers[0].id,
        validation: {
          minValue: {
            custom: "",
            enabled: true,
            entityType: "Custom",
            id: "minValue",
            inclusive: true,
            previousAnswer: null
          },
          maxValue: {
            custom: "",
            enabled: true,
            entityType: "Custom",
            id: "maxValue",
            inclusive: true,
            previousAnswer: null
          }
        }
      }
    };
  }

  handleModalClose = () => this.setState({ modalIsOpen: false });

  renderButton = ({ id, title, value, enabled }) => (
    <SidebarButton
      key={id}
      onClick={() => {
        this.props.gotoTab(this.modalId, id);
        this.setState({ modalIsOpen: true });
      }}
    >
      <Title>{title}</Title>
      {enabled && value && <Detail>{value}</Detail>}
    </SidebarButton>
  );

  handleUpdateAnswerValidation = ({ id, validation }) => {
    this.setState({
      answer: {
        ...this.state.answer,
        validation: {
          ...this.state.answer.validation,
          [id]: {
            ...this.state.answer.validation[id],
            ...validation
          }
        }
      }
    });
  };

  handleToggleValidationRule = ({ id, enabled }) => {
    this.setState({
      answer: {
        ...this.state.answer,
        validation: {
          ...this.state.answer.validation,
          [id]: {
            ...this.state.answer.validation[id],
            enabled: enabled
          }
        }
      }
    });
  };

  render() {
    const { answer } = this.state;
    return (
      <Container>
        <SectionTitle>Total</SectionTitle>
        <ValidationContext.Provider
          value={{
            answer,
            onUpdateAnswerValidation: this.handleUpdateAnswerValidation,
            onToggleValidationRule: this.handleToggleValidationRule
          }}
        >
          {validationTypes.map(validationType => {
            const validation = get(
              this.state.answer.validation,
              validationType.id
            );
            const { enabled } = validation;
            const value = enabled ? validationType.preview(validation) : "";

            return this.renderButton({
              ...validationType,
              value,
              enabled
            });
          })}
          <ModalWithNav
            id={this.modalId}
            onClose={this.handleModalClose}
            navItems={validationTypes}
            title={`Total validation`}
            isOpen={this.state.modalIsOpen}
          />
        </ValidationContext.Provider>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  tabsState: state.tabs
});

export default connect(
  mapStateToProps,
  { gotoTab }
)(TotalValidation);
