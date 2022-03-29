import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import TableHead from "./tableHead";
import TableBody from "./tableBody";
import Panel from "components/Panel";
import { colors } from "constants/theme";
import MainCanvas from "components/MainCanvas";

const Border = styled(Panel)`
  border: 1px solid ${colors.black};
`;
const TableWrapper = styled.table`
  width: 100%;
  font-size: 1em;
  border-collapse: collapse;
  table-layout: fixed;
  text-align: left;
  border-radius: 1em;
  border-top-left-radius: 1em;
`;

const Canvas = styled(MainCanvas)`
  padding: 0;
  margin: 0;
  max-width: none;
`;

const QuestionnaireTable = ({
  onSortClick,
  onReverseClick,
  sortOrder,
  currentSortColumn,
  questionnaires,
  selectedQuestionnaire,
  autoFocusId,
  onDeleteQuestionnaire,
  onDuplicateQuestionnaire,
  handleLock,
  enabledHeadings,
  clickable,
  onRowClick,
  questionnaireModal,
  variant,
}) => {
  return (
    <Canvas>
      <Border>
        <TableWrapper variant={variant}>
          <TableHead
            onSortClick={onSortClick}
            onReverseClick={onReverseClick}
            sortOrder={sortOrder}
            currentSortColumn={currentSortColumn}
            enabledHeadings={enabledHeadings}
            sticky={variant === "selectModal"}
          />
          <TableBody
            questionnaires={questionnaires}
            selectedQuestionnaire={selectedQuestionnaire}
            autoFocusId={autoFocusId}
            onDeleteQuestionnaire={onDeleteQuestionnaire}
            onDuplicateQuestionnaire={onDuplicateQuestionnaire}
            handleLock={handleLock}
            clickable={clickable}
            enabledHeadings={enabledHeadings}
            onRowClick={onRowClick}
            questionnaireModal={questionnaireModal}
          />
        </TableWrapper>
      </Border>
    </Canvas>
  );
};

QuestionnaireTable.propTypes = {
  onSortClick: PropTypes.func,
  onReverseClick: PropTypes.func,
  sortOrder: PropTypes.string,
  currentSortColumn: PropTypes.string,
  tableHeadings: PropTypes.array.isRequired, // eslint-disable-line
  questionnaires: PropTypes.array, // eslint-disable-line
  autoFocusId: PropTypes.string,
  onDeleteQuestionnaire: PropTypes.func,
  onDuplicateQuestionnaire: PropTypes.func,
  handleLock: PropTypes.func,
  enabledHeadings: PropTypes.array, // eslint-disable-line
  clickable: PropTypes.bool,
  onRowClick: PropTypes.func.isRequired,
  questionnaireModal: PropTypes.bool,
  selectedQuestionnaire: PropTypes.object, // eslint-disable-line
  variant: PropTypes.string,
};

QuestionnaireTable.defaultProps = {
  clickable: true,
};

export default QuestionnaireTable;
