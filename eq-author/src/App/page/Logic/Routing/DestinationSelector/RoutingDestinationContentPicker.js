import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { takeRightWhile, reject } from "lodash";

import {
  ContentSelectButton,
  ContentSelected,
} from "components/ContentPickerSelectv3";
import ContentPicker from "components/ContentPickerv3";

import { useQuestionnaire, usePage } from "components/QuestionnaireContext";

import { logicalDestinations } from "constants/destinations";

const selectedDisplayName = (selected, logicalDest) => {
  const { page, section, logical } = selected;

  if (!page && !section && !logical) {
    return "Select a destination";
  }
  if (logical) {
    return logicalDest[logical].displayName;
  }

  return (selected.section || selected.page).displayName;
};

export const generateAvailableRoutingDestinations = (
  questionnaire,
  pageId,
  sectionId
) => {
  if (!questionnaire?.sections || !pageId || !sectionId) {
    return {
      pages: [],
    };
  }

  const currentSection = questionnaire.sections.find(
    ({ id }) => id === sectionId
  );
  const currentSectionPages = currentSection.folders.flatMap(
    ({ pages }) => pages
  );
  let routablePages = takeRightWhile(
    currentSectionPages,
    ({ id }) => id !== pageId
  );
  routablePages.forEach((page) => (page.section = currentSection));

  routablePages = reject(routablePages, {
    pageType: "ListCollectorAddItemPage",
  });
  routablePages = reject(routablePages, {
    pageType: "ListCollectorConfirmationPage",
  });

  return {
    pages: routablePages || [],
  };
};

export const RoutingDestinationContentPicker = ({
  selected,
  onSubmit,
  sectionSummaryEnabled,
  ...otherProps
}) => {
  const [isPickerOpen, setPickerOpen] = useState(false);
  const { questionnaire } = useQuestionnaire();
  const page = usePage();
  const pageId = page?.id;
  const sectionId = page?.section?.id;

  const availableRoutingDestinations = useMemo(
    () =>
      generateAvailableRoutingDestinations(questionnaire, pageId, sectionId),
    [questionnaire, pageId, sectionId]
  );

  const { pages } = availableRoutingDestinations;
  const logicalDest = logicalDestinations(sectionSummaryEnabled);
  const displayName = selectedDisplayName(selected, logicalDest);

  const handlePickerSubmit = (selected) => {
    setPickerOpen(false);
    onSubmit({ name: "routingDestination", value: selected });
  };

  const contentData = { pages, logicalDestinations: logicalDest };

  return (
    <>
      <ContentSelectButton
        data-test="content-picker-select"
        onClick={() => setPickerOpen(true)}
        disabled={!questionnaire}
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
  selected: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  onSubmit: PropTypes.func,
  sectionSummaryEnabled: PropTypes.bool,
};

export default RoutingDestinationContentPicker;
