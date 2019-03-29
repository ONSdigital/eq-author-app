import React from "react";
import { kebabCase, get, startCase } from "lodash";
import CustomPropTypes from "custom-prop-types";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { gotoTab } from "redux/tabs/actions";
import ModalWithNav from "components/modals/ModalWithNav";
import SidebarButton, { Title, Detail } from "components/buttons/SidebarButton";

import ValidationContext from "./ValidationContext";
import DurationValidation from "./DurationValidation";
import DateValidation from "./DateValidation";
import NumericValidation from "./NumericValidation";
import DatePreview from "./DatePreview";
import DurationPreview from "./DurationPreview";

import {
  EarliestDate,
  LatestDate,
  MinDuration,
  MaxDuration,
  MinValue,
  MaxValue,
} from "./";

import {
  CURRENCY,
  DATE,
  DATE_RANGE,
  NUMBER,
  PERCENTAGE,
} from "constants/answer-types";

const formatValue = (value, { type }) => {
  if (typeof value !== "number") {
    return null;
  }
  if (type === PERCENTAGE) {
    return `${value}%`;
  }
  if (type === CURRENCY) {
    return `£${value}`;
  }
  return value;
};

export const validationTypes = [
  {
    id: "minValue",
    title: "Min Value",
    render: () => (
      <MinValue>{props => <NumericValidation {...props} />}</MinValue>
    ),
    types: [CURRENCY, NUMBER, PERCENTAGE],
    preview: ({ custom, previousAnswer, entityType }, answer) =>
      entityType === "Custom"
        ? formatValue(custom, answer)
        : get(previousAnswer, "displayName"),
  },
  {
    id: "maxValue",
    title: "Max Value",
    render: () => (
      <MaxValue>{props => <NumericValidation {...props} />}</MaxValue>
    ),
    types: [CURRENCY, NUMBER, PERCENTAGE],
    preview: ({ custom, previousAnswer, entityType }, answer) =>
      entityType === "Custom"
        ? formatValue(custom, answer)
        : get(previousAnswer, "displayName"),
  },
  {
    id: "earliestDate",
    title: "Earliest Date",
    render: () => (
      <EarliestDate>{props => <DateValidation {...props} />}</EarliestDate>
    ),
    types: [DATE, DATE_RANGE],
    preview: DatePreview,
  },
  {
    id: "latestDate",
    title: "Latest Date",
    render: () => (
      <LatestDate>{props => <DateValidation {...props} />}</LatestDate>
    ),
    types: [DATE, DATE_RANGE],
    preview: DatePreview,
  },
  {
    id: "minDuration",
    title: "Min Duration",
    render: () => (
      <MinDuration>{props => <DurationValidation {...props} />}</MinDuration>
    ),
    types: [DATE_RANGE],
    preview: DurationPreview,
  },
  {
    id: "maxDuration",
    title: "Max Duration",
    render: () => (
      <MaxDuration>{props => <DurationValidation {...props} />}</MaxDuration>
    ),
    types: [DATE_RANGE],
    preview: DurationPreview,
  },
];

const getValidationsForType = type =>
  validationTypes.filter(({ types }) => types.includes(type));

const validations = [NUMBER, CURRENCY, PERCENTAGE, DATE, DATE_RANGE].reduce(
  (hash, type) => ({
    ...hash,
    [type]: getValidationsForType(type),
  }),
  {}
);

export class UnconnectedAnswerValidation extends React.Component {
  state = {
    modalIsOpen: false,
    answerId: null,
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
      <ValidationContext.Provider value={{ answer }}>
        {validValidationTypes.map(validationType => {
          const validation = get(answer, `validation.${validationType.id}`, {});
          const { enabled, previousAnswer, metadata } = validation;
          const value = enabled
            ? validationType.preview(validation, answer)
            : "";

          return this.renderButton({
            ...validationType,
            value,
            enabled,
            previousAnswer,
            metadata,
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
    );
  }
}

UnconnectedAnswerValidation.propTypes = {
  answer: CustomPropTypes.answer,
  gotoTab: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  tabsState: state.tabs,
});

export default connect(
  mapStateToProps,
  { gotoTab }
)(UnconnectedAnswerValidation);
