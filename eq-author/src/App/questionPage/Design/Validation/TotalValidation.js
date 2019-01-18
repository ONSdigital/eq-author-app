import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";

import SidebarButton, {
  Title,
  Detail
} from "components/buttons/SidebarButton/index.js";

import ModalDialog from "components/modals/ModalDialog";
import MinValueValidation from "./TotalMinValue";

import ValidationContext from "./ValidationContext";
import { gotoTab } from "redux/tabs/actions";

import { get } from "lodash";
import Button from "components/buttons/Button";

import IconTotal from "./icon-calculator.svg?inline";

const ValidationModalDialog = styled(ModalDialog)`
  .Modal {
    width: 40em;
    height: 23em;
  }
`;

const SectionTitle = styled.h3`
  margin: 0 0 0.5em 0;
  padding: 0;
  font-size: 1em;
  color: #666666;
  position: relative;
  display: flex;
  align-items: center;
`;

const Container = styled.div`
  padding: 0.25em 0 0;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const TotalButton = styled(SidebarButton)`
  display: flex;
  align-items: center;
`;

const Details = styled.div`
  margin-left: 0.1em;
`;

const preview = ({ custom, previousAnswer }) =>
  custom ? custom : get(previousAnswer, "displayName");

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
            comparator: "Equals",
            custom: "",
            enabled: true,
            entityType: "Custom",
            id: "minValue",
            inclusive: true,
            previousAnswer: null
          }
        }
      }
    };
  }

  handleModalDialogClose = () => this.setState({ modalIsOpen: false });

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

  render() {
    const { answer } = this.state;
    const validation = get(this.state.answer.validation, "minValue");
    const { enabled } = validation;
    const value = enabled ? preview(validation) : "";
    const comparator = get(this.state.answer.validation.minValue, "comparator");

    return (
      <Container>
        <ValidationContext.Provider
          value={{
            answer,
            onUpdateAnswerValidation: this.handleUpdateAnswerValidation
          }}
        >
          <TotalButton
            onClick={() => {
              this.setState({ modalIsOpen: true });
            }}
          >
            <IconTotal />
            <Details>
              <Title>Total</Title>
              {enabled && value && (
                <Detail>
                  {comparator} {value.toLowerCase()}
                </Detail>
              )}
            </Details>
          </TotalButton>

          <ValidationModalDialog
            id={this.modalId}
            onClose={this.handleModalDialogClose}
            title={`Total validation`}
            isOpen={this.state.modalIsOpen}
          >
            <MinValueValidation
              answerId={answer.id}
              onUpdateAnswerValidation={this.handleUpdateAnswerValidation}
              onToggleValidationRule={this.handleToggleValidationRule}
            />

            <Buttons>
              <Button onClick={this.handleModalDialogClose} variant="primary">
                Done
              </Button>
            </Buttons>
          </ValidationModalDialog>
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
