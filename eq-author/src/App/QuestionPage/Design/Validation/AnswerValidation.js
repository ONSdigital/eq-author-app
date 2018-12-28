import React from "react";
import { kebabCase, get, startCase } from "lodash";
import styled from "styled-components";
import CustomPropTypes from "custom-prop-types";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { gotoTab } from "redux/tabs/actions";

import SidebarButton, { Title, Detail } from "components/Buttons/SidebarButton";
import ModalWithNav from "components/Modals/ModalWithNav";

import MinValueValidation from "App/QuestionPage/Design/Validation/MinValue";
import MaxValueValidation from "App/QuestionPage/Design/Validation/MaxValue";
import {
  EarliestDate,
  LatestDate,
  MinDuration,
  MaxDuration
} from "App/QuestionPage/Design/Validation/Date";

import ValidationContext from "App/QuestionPage/Design/Validation/ValidationContext";
import DatePreview from "App/QuestionPage/Design/Validation/Date/DatePreview";
import DurationPreview from "App/QuestionPage/Design/Validation/Date/DurationPreview";

import { CURRENCY, DATE, DATE_RANGE, NUMBER } from "constants/answer-types";
import { colors } from "constants/theme";

const Container = styled.div`
  margin-top: 1em;
  border-top: 1px solid ${colors.lightGrey};
  padding: 1em 0;
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
    types: [DATE, DATE_RANGE],
    preview: DatePreview
  },
  {
    id: "latestDate",
    title: "Latest Date",
    render: () => <LatestDate />,
    types: [DATE, DATE_RANGE],
    preview: DatePreview
  },
  {
    id: "minDuration",
    title: "Min Duration",
    render: () => <MinDuration />,
    types: [DATE_RANGE],
    preview: DurationPreview
  },
  {
    id: "maxDuration",
    title: "Max Duration",
    render: () => <MaxDuration />,
    types: [DATE_RANGE],
    preview: DurationPreview
  }
];

const getValidationsForType = type =>
  validationTypes.filter(({ types }) => types.includes(type));

const validations = [NUMBER, CURRENCY, DATE, DATE_RANGE].reduce(
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

  renderButton = ({ id, title, value, enabled }) => (
    <SidebarButton
      key={id}
      data-test={`sidebar-button-${kebabCase(title)}`}
      onClick={() => {
        this.props.gotoTab(this.modalId, id);
        this.setState({ modalIsOpen: true });
      }}
    >
      <Title>{title}</Title>
      {enabled && value && <Detail>{value}</Detail>}
    </SidebarButton>
  );

  render() {
    const { answer } = this.props;
    const validValidationTypes = validations[answer.type] || [];
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
              enabled,
              previousAnswer,
              metadata
            });
          })}
          <ModalWithNav
            id={this.modalId}
            onClose={this.handleModalClose}
            navItems={validValidationTypes}
            title={`${startCase(answer.type)} validation`}
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

const mapStateToProps = state => ({
  tabsState: state.tabs
});

export default connect(
  mapStateToProps,
  { gotoTab }
)(UnconnectedAnswerValidation);
