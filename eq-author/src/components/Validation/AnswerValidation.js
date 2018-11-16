import React from "react";
import { kebabCase, get, merge } from "lodash";
import styled from "styled-components";
import CustomPropTypes from "custom-prop-types";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { getUnit } from "redux/answer/reducer";
import { gotoTab } from "redux/tabs/actions";

import SidebarButton, { Title, Detail } from "components/SidebarButton";
import ModalWithNav from "components/ModalWithNav";

import MinValueValidation from "components/Validation/MinValue";
import MaxValueValidation from "components/Validation/MaxValue";
import { EarliestDate, LatestDate } from "components/Validation/Date";
import ValidationContext from "components/Validation/ValidationContext";
import DatePreview from "components/Validation/Date/DatePreview";

import { CURRENCY, DATE, NUMBER } from "constants/answer-types";
import { colors } from "constants/theme";

const Container = styled.div`
  margin-top: 1em;
  border-top: 1px solid ${colors.lightGrey};
  padding: 1em 0;
`;

const Unit = styled.span`
  margin-left: 0.1em;
`;

const validationTypes = [
  {
    id: "minValue",
    title: "Min Value",
    render: () => <MinValueValidation />,
    types: [CURRENCY, NUMBER],
    preview: ({ custom }) => custom
  },
  {
    id: "maxValue",
    title: "Max Value",
    render: () => <MaxValueValidation />,
    types: [CURRENCY, NUMBER],
    preview: ({ custom, previousAnswer }) =>
      custom ? custom : get(previousAnswer, "displayName")
  },
  {
    id: "earliestDate",
    title: "Earliest Date",
    render: () => <EarliestDate />,
    types: [DATE],
    preview: DatePreview
  },
  {
    id: "latestDate",
    title: "Latest Date",
    render: () => <LatestDate />,
    types: [DATE],
    preview: DatePreview
  }
];

const getValidationsForType = type =>
  validationTypes.filter(({ types }) => types.includes(type));

const validations = [NUMBER, CURRENCY, DATE].reduce(
  (hash, type) => ({
    ...hash,
    [type]: getValidationsForType(type)
  }),
  {}
);

export class UnconnectedAnswerValidation extends React.Component {
  state = {
    modalIsOpen: false,
    answerId: null
  };

  constructor(props) {
    super(props);
    this.modalId = `modal-validation-${props.answer.id}`;
  }

  handleModalClose = () => this.setState({ modalIsOpen: false });

  /*  eslint-disable react/no-danger */
  renderButton = ({ id, title, value, enabled, unit }) => {
    return (
      <SidebarButton
        key={id}
        data-test={`sidebar-button-${kebabCase(title)}`}
        onClick={() => {
          this.props.gotoTab(this.modalId, id);
          this.setState({ modalIsOpen: true });
        }}
      >
        <Title>{title}</Title>
        {enabled &&
          value && (
            <Detail>
              {value}
              {unit && <Unit dangerouslySetInnerHTML={{ __html: unit.char }} />}
            </Detail>
          )}
      </SidebarButton>
    );
  };

  render() {
    const { answer } = this.props;
    const validValidationTypes = validations[answer.type] || [];
    const { unit } = answer.properties;

    if (validValidationTypes.length === 0) {
      return null;
    }

    return (
      <Container>
        <ValidationContext.Provider value={{ answer }}>
          {validValidationTypes.map(validationType => {
            const validation = get(
              answer,
              `validation.${validationType.id}`,
              {}
            );
            const { enabled, previousAnswer, metadata } = validation;
            const value = enabled ? validationType.preview(validation) : "";

            return this.renderButton({
              ...validationType,
              value,
              unit,
              enabled,
              previousAnswer,
              metadata
            });
          })}
          <ModalWithNav
            id={this.modalId}
            onClose={this.handleModalClose}
            navItems={validValidationTypes}
            title={`${answer.type} validation`}
            isOpen={this.state.modalIsOpen}
          />
        </ValidationContext.Provider>
      </Container>
    );
  }
}

UnconnectedAnswerValidation.propTypes = {
  answer: CustomPropTypes.answer,
  gotoTab: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  answer: merge({}, ownProps.answer, {
    properties: getUnit(state, ownProps.answer.id, ownProps.answer.type)
  }),
  tabsState: state.tabs
});

export default connect(
  mapStateToProps,
  { gotoTab }
)(UnconnectedAnswerValidation);
