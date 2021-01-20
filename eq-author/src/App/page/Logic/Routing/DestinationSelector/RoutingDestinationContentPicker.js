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

export const RoutingDestinationContentPicker = ({
  id,
  pageId,
  selected,
  onSubmit,
  ...otherProps
}) => {
  const { loading, data } = useQuery(getAvailableRoutingDestinations, {
    variables: { input: { pageId: pageId } },
    fetchPolicy: "cache-and-network",
  });

  const [isPickerOpen, setPickerOpen] = useState(false);

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

  const contentData =
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
        <ContentSelected>{displayName}</ContentSelected>
      </ContentSelectButton>
      <ContentPicker
        isOpen={isPickerOpen}
        data={contentData}
        onClose={() => setPickerOpen(false)}
        onSubmit={handlePickerSubmit}
        data-test="picker"
        singleItemSelect
        contentType={"Destination"}
      />
    </>
  );
};

RoutingDestinationContentPicker.propTypes = {
  id: PropTypes.string,
  pageId: PropTypes.string.isRequired,
  selected: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  onSubmit: PropTypes.func,
};

export default RoutingDestinationContentPicker;
