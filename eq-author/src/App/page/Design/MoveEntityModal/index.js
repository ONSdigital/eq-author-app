import React, { useMemo, useState } from "react";
import MoveModal from "components/MoveModal";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import PositionModal from "components/PositionModal";

import { useQuestionnaire } from "components/QuestionnaireContext";

export const buildPageList = (folders) => {
  const optionList = [];
  folders.forEach((folder) => {
    const { id, enabled, pages } = folder;
    if (enabled) {
      optionList.push({
        ...folder,
        parentEnabled: false,
      });
    }
    pages.forEach((page) => {
      optionList.push({
        ...page,
        parentId: enabled ? id : null,
        parentEnabled: enabled,
      });
    });
  });
  return optionList;
};

const propTypes = {
  sectionId: PropTypes.string.isRequired,
  page: CustomPropTypes.page,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onMove: PropTypes.func.isRequired,
  entity: PropTypes.string.isRequired,
};

const MoveEntityModal = ({
  sectionId,
  selected,
  isOpen,
  onClose,
  onMove,
  entity,
}) => {
  const { questionnaire } = useQuestionnaire();

  const [selectedSectionId, setSelectedSectionId] = useState(sectionId);

  const handleMove = ({ position, folderId }) =>
    onMove({
      from: {
        id: selected.id,
        sectionId,
        position: selected.position,
      },
      to: {
        id: selected.id,
        sectionId: selectedSectionId,
        folderId,
        position: position,
      },
    });

  const selectedSection =
    questionnaire &&
    questionnaire.sections.find(({ id }) => id === selectedSectionId);

  const options =
    entity === "Page"
      ? (folders) => buildPageList(folders)
      : (folders) =>
          folders.map((item) => (!item.enabled ? item.pages[0] : item));

  return useMemo(
    () =>
      !questionnaire ? null : (
        <MoveModal
          title={entity === "Page" ? "Move question" : "Move folder"}
          isOpen={isOpen}
          onClose={onClose}
        >
          <PositionModal
            data-test={"section-position-modal"}
            title={"Section"}
            options={questionnaire.sections}
            selected={selectedSection}
            onChange={({ value }) =>
              setSelectedSectionId(questionnaire.sections[value].id)
            }
          />
          <PositionModal
            data-test={`${entity.toLowerCase()}-position-modal`}
            title={entity}
            options={
              selectedSection?.folders.length &&
              options(selectedSection.folders)
            }
            onMove={handleMove}
            selected={selected}
          />
        </MoveModal>
      ),
    [selectedSection, questionnaire, selected, isOpen, entity]
  );
};

MoveEntityModal.propTypes = propTypes;

export default MoveEntityModal;
