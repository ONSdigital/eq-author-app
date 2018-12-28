import React from "react";
import PropTypes from "prop-types";
import { isEmpty, get } from "lodash";

import ContentPickerSelect from "App/components/ContentPickerSelect";
import { DESTINATION } from "App/components/ContentPickerSelect/content-types";

import AvailableRoutingDestinationsQuery from "App/QuestionPage/Routing/AvailableRoutingDestinationsQuery";

const getDisplayName = (selected, data) => {
  if (selected.hasOwnProperty("absoluteDestination")) {
    return selected.absoluteDestination.displayName;
  } else {
    if (selected.logicalDestination === "EndOfQuestionnaire") {
      return "End of questionnaire";
    }

    if (isEmpty(data)) {
      return;
    }

    if (data.questionPages.length) {
      return data.questionPages[0].displayName;
    } else if (data.sections.length) {
      return data.sections[0].displayName;
    }
  }
};

export const UnwrappedRoutingDestinationContentPicker = ({
  data,
  path,
  selected,
  ...otherProps
}) => {
  const destinationData = get(data, path);
  return (
    <ContentPickerSelect
      name="routingDestination"
      contentTypes={[DESTINATION]}
      destinationData={destinationData}
      selectedContentDisplayName={getDisplayName(selected, destinationData)}
      {...otherProps}
    />
  );
};

UnwrappedRoutingDestinationContentPicker.propTypes = {
  data: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  path: PropTypes.string.isRequired,
  selected: PropTypes.object // eslint-disable-line react/forbid-prop-types
};

export default props => (
  <AvailableRoutingDestinationsQuery pageId={props.pageId}>
    {innerProps => (
      <UnwrappedRoutingDestinationContentPicker {...innerProps} {...props} />
    )}
  </AvailableRoutingDestinationsQuery>
);
