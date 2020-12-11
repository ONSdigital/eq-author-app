import React, { useState } from "react";
import PropTypes from "prop-types";
import { get } from "lodash";
import { Query } from "react-apollo";

import {
  ContentSelectButton,
  ContentSelected,
} from "components/ContentPickerSelect";
import ContentPicker from "components/ContentPickerv2";

import getAvailableRoutingDestinations from "./getAvailableRoutingDestinations.graphql";

const getLogicalDisplayName = (
  logical,
  loading,
  availableRoutingDestinations
) => {
  if (logical === "EndOfQuestionnaire") {
    return "End of questionnaire";
  }

  if (logical === "NextPage") {
    return "Next page";
  }

  if (logical === "Default") {
    return "Select a destination";
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
  if (!selected.page && !selected.section && !selected.logical) {
    return "Select a destination";
  }

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
  onSubmit,
  id,
  ...otherProps
}) => {
  const [isPickerOpen, setPickerOpen] = useState(false);
  const destinationData = get(data, "page.availableRoutingDestinations");
  const selectedDisplayName = getSelectedDisplayName(
    selected,
    loading,
    destinationData
  );

  const handlePickerSubmit = selected => {
    setPickerOpen(false);
    onSubmit({ name: "routingDestination", value: selected });
  };

  const contentPickerData = () => {
    if (!destinationData) {
      return [];
    }
    const sections = [];

    const pageData = destinationData.pages[0];
    if (pageData) {
      const currentSectionDetails = destinationData.pages[0].section;
      const currentSection = {
        id: currentSectionDetails.id,
        displayName: currentSectionDetails.displayName,
        pages: [...destinationData.pages],
      };
      sections.push(currentSection);
    }

    if (id !== "else") {
      const routingSections = destinationData.sections;
      routingSections.forEach((section, index) => {
        routingSections[index].pages = [
          {
            ...section.folders[0].pages[0],
            id: section.id,
            __typename: "Section",
          },
        ];
      });

      sections.push(...routingSections);
    }

    return sections;
  };

  return (
    <>
      <ContentSelectButton
        data-test="content-picker-select"
        onClick={() => setPickerOpen(true)}
        disabled={loading}
        {...otherProps}
      >
        <ContentSelected>{selectedDisplayName}</ContentSelected>
      </ContentSelectButton>
      <ContentPicker
        isOpen={isPickerOpen}
        data={contentPickerData()}
        onClose={() => setPickerOpen(false)}
        onSubmit={handlePickerSubmit}
        data-test="picker"
        singleItemSelect
        contentType={"Destination"}
      />
    </>
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
  onSubmit: PropTypes.func,
  id: PropTypes.string,
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
  id: PropTypes.string,
};

export default RoutingDestinationContentPicker;
