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

export const UnwrappedRoutingDestinationContentPicker = ({
  id,
  loading,
  data,
  selected,
  onSubmit,
  ...otherProps
}) => {
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

const destinationProps = PropTypes.arrayOf(
  PropTypes.shape({
    id: PropTypes.string.isRequired,
    logicalDestination: PropTypes.string.isRequired,
  })
);

UnwrappedRoutingDestinationContentPicker.propTypes = {
  id: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  data: PropTypes.shape({
    page: PropTypes.shape({
      availableRoutingDestinations: PropTypes.shape({
        logicalDestinations: destinationProps,
        questionPages: destinationProps,
        sections: destinationProps,
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
      <UnwrappedRoutingDestinationContentPicker
        data={data}
        loading={loading}
        {...otherProps}
      />
    </>
  );
};

RoutingDestinationContentPicker.propTypes = {
  pageId: PropTypes.string.isRequired,
  id: PropTypes.string,
};

export default RoutingDestinationContentPicker;
