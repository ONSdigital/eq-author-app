import React from "react";
import styled from "styled-components";
import GroupedSelect from "./GroupedSelect";
import { Grid, Column } from "components/Grid";
import PropTypes from "prop-types";

import AbsoluteDestination from "graphql/fragments/absolute-destination.graphql";
import LogicalDestination from "graphql/fragments/logical-destination.graphql";
import QuestionPageDestination from "graphql/fragments/question-page-destination.graphql";
import SectionDestination from "graphql/fragments/section-destination.graphql";

const RoutingRuleResult = styled.div`
  padding: 1em 1em 1em 0.7em;
`;

const Label = styled.label`
  width: 100%;
  display: block;
  font-size: 0.9em;
  font-weight: bold;
  &[disabled] {
    opacity: 0.5;
  }
`;

const Goto = styled.span`
  float: right;
  margin-right: 1em;
`;

const toAbsoluteDestination = entity => ({
  absoluteDestination: {
    destinationType: entity.__typename,
    destinationId: entity.id
  }
});

const toLogicalDestination = destinationType => ({
  logicalDestination: {
    destinationType
  }
});

const toOption = () => entity => ({
  label: entity.displayName,
  value: toAbsoluteDestination(entity)
});

class RoutingRuleDestinationSelector extends React.Component {
  groupDestinations({ questionPages, sections }) {
    const pagesGroup = {
      label: "Questions in this section",
      id: "questions",
      options: questionPages.map(toOption("Page Title"))
    };

    const sectionGroup = {
      label: "Sections in this questionnaire",
      id: "sections",
      options: sections.map(toOption("Section Title"))
    };

    const logicalGroup = {
      label: "End of Questionnaire",
      id: "endOfQuestionnaire",
      options: [
        {
          label: "End of Questionnaire",
          value: toLogicalDestination("EndOfQuestionnaire")
        }
      ]
    };

    return [pagesGroup, sectionGroup, logicalGroup].filter(
      group => group.options.length
    );
  }

  convertValueToDestination(value) {
    if (!value) {
      return null;
    }

    const { absoluteDestination, logicalDestination } = value;
    return absoluteDestination
      ? toAbsoluteDestination(absoluteDestination)
      : toLogicalDestination(logicalDestination);
  }

  handleChange = ({ value }) => {
    this.props.onChange(JSON.parse(value));
  };

  render() {
    const { destinations, label, id, value, disabled } = this.props;

    const convertedValue = this.convertValueToDestination(value);
    const groups = this.groupDestinations(destinations);
    groups.forEach(group =>
      group.options.forEach(option => {
        option.value = JSON.stringify(option.value);
      })
    );

    return (
      <RoutingRuleResult key={id}>
        <Grid align="center">
          <Column gutters={false} cols={5}>
            <Label htmlFor={id} disabled={disabled}>
              {label} <Goto>Go to: </Goto>
            </Label>
          </Column>
          <Column gutters={false} cols={7}>
            <GroupedSelect
              id={id}
              value={convertedValue ? JSON.stringify(convertedValue) : null}
              groups={groups}
              onChange={this.handleChange}
              disabled={disabled}
              data-test="result-selector"
            />
          </Column>
        </Grid>
      </RoutingRuleResult>
    );
  }
}

RoutingRuleDestinationSelector.propTypes = {
  onChange: PropTypes.func.isRequired,
  destinations: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  value: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  disabled: PropTypes.bool.isRequired
};

RoutingRuleDestinationSelector.defaultProps = {
  disabled: false,
  loading: false
};

RoutingRuleDestinationSelector.fragments = {
  LogicalDestination,
  AbsoluteDestination,
  QuestionPageDestination,
  SectionDestination
};

export default RoutingRuleDestinationSelector;
