import React from "react";
import PropTypes from "prop-types";
import { get } from "lodash";
import { Query } from "react-apollo";

import ContentPickerSelect from "components/ContentPickerSelect";
import { DESTINATION } from "components/ContentPickerSelect/content-types";

import getAvailableRoutingDestinations from "./getAvailableRoutingDestinations.graphql";

const getLogicalDisplayName = (
  logical,
  loading,
  availableRoutingDestinations
) => {
  if (logical === "EndOfQuestionnaire") {
    return "End of questionnaire";
  }

  if (loading) {
    return "";
  }

  if (availableRoutingDestinations.pages.length) {
    return availableRoutingDestinations.pages[0].displayName;
  }
  if (availableRoutingDestinations.sections.length) {
    return availableRoutingDestinations.sections[0].displayName;
  }
  return "End of questionnaire";
};

const getAbsoluteDisplayName = selected => {
  const absolute = selected.section || selected.page;
  return absolute.displayName;
};

const getSelectedDisplayName = (
  selected,
  loading,
  availableRoutingDestinations
) => {
  if (selected.logical) {
    return getLogicalDisplayName(
      selected.logical,
      loading,
      availableRoutingDestinations
    );
  }
  return getAbsoluteDisplayName(selected);
};

export const UnwrappedRoutingDestinationContentPicker = ({
  data,
  loading,
  selected,
  ...otherProps
}) => {
  const destinationData = get(data, "page.availableRoutingDestinations");
  return (
    <ContentPickerSelect
      name="routingDestination"
      contentTypes={[DESTINATION]}
      destinationData={destinationData}
      selectedContentDisplayName={getSelectedDisplayName(
        selected,
        loading,
        destinationData
      )}
      selectedObj={selected || undefined}
      {...otherProps}
    />
  );
};

UnwrappedRoutingDestinationContentPicker.propTypes = {
  loading: PropTypes.bool.isRequired,
  data: PropTypes.shape({
    page: PropTypes.shape({
      availableRoutingDestinations: PropTypes.shape({
        logicalDestinations: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.string.isRequired,
            logicalDestination: PropTypes.string.isRequired,
          })
        ),
        questionPages: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.string.isRequired,
            displayName: PropTypes.string.isRequired,
          })
        ),
        sections: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.string.isRequired,
            displayName: PropTypes.string.isRequired,
          })
        ),
      }),
    }),
  }),
  selected: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

const RoutingDestinationContentPicker = props => (
  <Query
    query={getAvailableRoutingDestinations}
    variables={{ input: { pageId: props.pageId } }}
    fetchPolicy="cache-and-network"
  >
    {innerProps => (
      <UnwrappedRoutingDestinationContentPicker {...innerProps} {...props} />
    )}
  </Query>
);

RoutingDestinationContentPicker.propTypes = {
  pageId: PropTypes.string.isRequired,
};

export default RoutingDestinationContentPicker;
