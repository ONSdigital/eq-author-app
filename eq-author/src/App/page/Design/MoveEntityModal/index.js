import React, { useMemo, useState, useCallback } from "react";
import MoveModal from "components/MoveModal";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import PositionModal from "components/PositionModal";

import { useQuestionnaire } from "components/QuestionnaireContext";

export const buildPageList = (folders) => {
  const optionList = [];
  const basicFolders = folders.filter((folder) => folder.listId === undefined);
  basicFolders.forEach((folder) => {
    const { id, pages } = folder;
    optionList.push({
      ...folder,
      parentEnabled: false,
    });
    pages.forEach((page) => {
      optionList.push({
        ...page,
        parentId: id,
        parentEnabled: true,
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

  const handleMove = useCallback(
    ({ position, folderId }) =>
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
      }),
    [onMove, sectionId, selected.id, selected.position, selectedSectionId]
  );

  const selectedSection =
    questionnaire &&
    questionnaire.sections.find(({ id }) => id === selectedSectionId);

  const options = useMemo(
    () =>
      entity === "Page"
        ? (folders) => buildPageList(folders)
        : (folders) => folders.map((item) => item),
    [entity]
  );

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
    [
      selectedSection,
      questionnaire,
      selected,
      isOpen,
      entity,
      handleMove,
      onClose,
      options,
    ]
  );
};

MoveEntityModal.propTypes = propTypes;

export default MoveEntityModal;
