/*
TODO:
[X] - None of the tests actually work
[X] - Write tests
[X] - Find out what design is needed
[X] - Find out why current picker is broken. SPOILER - it's because no scrollbars
[X] - Determine how fields are populated
[X] - Completely refactored Destination picker
[X] - Remove HOC and useQuery instead
[X] - Need to refactor this file
[ ] -
[ ] - Remove HOC and useQuery instead
[ ] -
[ ] - OPTIONAL: Tidy up propTypes?
*/

import React, { useState } from "react";
import PropTypes from "prop-types";
import { useQuery } from "@apollo/react-hooks";

import {
  ContentSelectButton,
  ContentSelected,
} from "components/ContentPickerSelect";
import ContentPicker from "components/ContentPickerv2";

import getAvailableRoutingDestinations from "./getAvailableRoutingDestinations.graphql";

import { destinationKey, EndOfQuestionnaire } from "constants/destinations";

const logicalDisplayName = logical =>
  destinationKey[logical] || destinationKey[EndOfQuestionnaire];

const absoluteDisplayName = selected =>
  (selected.section || selected.page).displayName;

const selectedDisplayName = selected => {
  const { page, section, logical } = selected;

  if (!page && !section && !logical) {
    return destinationKey.Default;
  }

  return logical ? logicalDisplayName(logical) : absoluteDisplayName(selected);
};

// have a problem with rendering speed right now
// conditionally rendering with the data is causing it to render slower
export const UnwrappedRoutingDestinationContentPicker = ({
  id,
  loading,
  data,
  selected,
  onSubmit,
  ...otherProps
}) => {
  const [isPickerOpen, setPickerOpen] = useState(false);
  // keep an eye on this
  // Have refactored it but i'm unsure it's good enough to catch null/undefined
  const { pages = [], logicalDestinations = [], sections = [] } =
    data?.page?.availableRoutingDestinations || [];

  const displayName = selectedDisplayName(selected, {
    pages,
    logicalDestinations,
    sections,
  });

  const handlePickerSubmit = selected => {
    setPickerOpen(false);
    onSubmit({ name: "routingDestination", value: selected });
  };

  const isElse =
    id === "else"
      ? { pages, logicalDestinations }
      : { pages, logicalDestinations, sections };

  return (
    <>
      <ContentSelectButton
        data-test="content-picker-select"
        onClick={() => setPickerOpen(true)}
        disabled={loading}
        {...otherProps}
      >
        <ContentSelected>{loading ? "" : displayName}</ContentSelected>
      </ContentSelectButton>
      <ContentPicker
        isOpen={isPickerOpen}
        data={isElse}
        onClose={() => setPickerOpen(false)}
        onSubmit={handlePickerSubmit}
        data-test="picker"
        singleItemSelect
        contentType={"Destination"}
      />
    </>
  );
};

// Prune the propTypes
UnwrappedRoutingDestinationContentPicker.propTypes = {
  id: PropTypes.string,
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
};

const RoutingDestinationContentPicker = ({ pageId, ...otherProps }) => {
  const { loading, data } = useQuery(getAvailableRoutingDestinations, {
    variables: { input: { pageId: pageId } },
    fetchPolicy: "cache-and-network",
  });

  return (
    <>
      {/* {data && ( */}
      <UnwrappedRoutingDestinationContentPicker
        data={data}
        loading={loading}
        {...otherProps}
      />
      {/* )} */}
    </>
  );
};

RoutingDestinationContentPicker.propTypes = {
  pageId: PropTypes.string.isRequired,
  id: PropTypes.string,
};

export default RoutingDestinationContentPicker;
