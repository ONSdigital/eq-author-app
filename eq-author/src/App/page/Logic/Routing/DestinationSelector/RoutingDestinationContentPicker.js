import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { takeRightWhile } from "lodash";

import {
  ContentSelectButton,
  ContentSelected,
} from "components/ContentPickerSelect";
import ContentPicker from "components/ContentPickerv2";

import { useQuestionnaire, usePage } from "components/QuestionnaireContext";

import {
  logicalDestinations,
  EndOfQuestionnaire,
} from "constants/destinations";

import { destinationKey } from "constants/destinationKey";

const logicalDisplayName = (logical) =>
  destinationKey[logical] || destinationKey[EndOfQuestionnaire];

const absoluteDisplayName = (selected) =>
  (selected.section || selected.page).displayName;

const selectedDisplayName = (selected) => {
  const { page, section, logical } = selected;

  if (!page && !section && !logical) {
    return destinationKey.Default;
  }

  return logical ? logicalDisplayName(logical) : absoluteDisplayName(selected);
};

export const generateAvailableRoutingDestinations = (
  questionnaire,
  pageId,
  sectionId
) => {
  if (!questionnaire?.sections || !pageId || !sectionId) {
    return {
      pages: [],
      sections: [],
    };
  }

  const currentSection = questionnaire.sections.find(
    ({ id }) => id === sectionId
  );
  const routableSections = takeRightWhile(
    questionnaire.sections,
    ({ id }) => id !== sectionId
  );
  const currentSectionPages = currentSection.folders.flatMap(
    ({ pages }) => pages
  );
  const routablePages = takeRightWhile(
    currentSectionPages,
    ({ id }) => id !== pageId
  );
  routablePages.forEach((page) => (page.section = currentSection));

  return {
    pages: routablePages || [],
    sections: routableSections || [],
  };
};

export const RoutingDestinationContentPicker = ({
  id,
  selected,
  onSubmit,
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

  const { pages, sections } = availableRoutingDestinations;

  const displayName = selectedDisplayName(selected, {
    pages,
    logicalDestinations,
    sections,
  });

  const handlePickerSubmit = (selected) => {
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
  id: PropTypes.string,
  selected: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  onSubmit: PropTypes.func,
};

export default RoutingDestinationContentPicker;
