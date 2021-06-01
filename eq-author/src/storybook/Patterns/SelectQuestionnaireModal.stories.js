import React from "react";
import styled from "styled-components";
import { colors } from "constants/theme";

// import ScrollPane from "components/ScrollPane";
import Modal from "components/modals/Modal";
import SearchBar from 'components/SearchBar'
import ScrollPane from "components/ScrollPane";
import Button from "components/buttons/Button";
import ButtonGroup from "components/buttons/ButtonGroup";
import Panel from "components/Panel";
// import QuestionnaireTable from "components/QuestionnaireTable";

import * as Headings from "constants/table-headings";


export default {
    title: "Patterns/Select Questionnaire Modal",
    component: Modal,
    argTypes: {
      onConfirm: { action: "Confirmed" },
      onCancel: { action: "Cancelled" },
    },
  };

// export const Default = (args) => <Modal isOpen {...args} />

const ModalFooter = styled.div`
  padding: 1.5em;
  border-top: 1px solid ${colors.bordersLight};
`;

const StyledModal = styled(Modal)`
  .Modal {
    padding: 0;
    width: 45em;
  }
`;

const Container = styled.div`
  background: white;
`;

const ModalTitle = styled.div`
  font-weight: bold;
  font-size: 1.2em;
  color: ${colors.text};
  margin-bottom: 0.75em;
`;

const ModalSubtitle = styled.div`
  font-size: 1em;
  color: ${colors.text};
`;

const ModalHeader = styled.div`
  padding: 2em 1em 1.5em;
  border-bottom: 1px solid ${colors.bordersLight};
`;

const MenuContainer = styled.div`
  overflow: hidden;
  height: 25em;
`;



export const Default = (args) => 
// const Template = (args) => 

<StyledModal isOpen hasCloseButton>
      <Container>
        <>
          <ModalHeader>
            <ModalTitle>Select the source questionnaire</ModalTitle>
            <ModalSubtitle>
                  {/* //TODO needs onChange prop setup and passed here
                  // see example in App/QuestionnairesPage/QuestionnairesView/Header */}
                  <SearchBar size="large"/>
            </ModalSubtitle>
          </ModalHeader>
          <MenuContainer>
            <ScrollPane>
            <Panel>
            {/* <QuestionnaireTable
              // onSortClick={onSortQuestionnaires}
              // onReverseClick={onReverseSort}
              // sortOrder={sortOrder}
              // currentSortColumn={sortColumn}
              // tableHeadings={tableHeadings}
              // questionnaires={questionnaires}
              // autoFocusId={autoFocusId}
              // onDeleteQuestionnaire={onDeleteQuestionnaire}
              // onDuplicateQuestionnaire={onDuplicateQuestionnaire}
              // handleLock={handleLock}
              // enabledHeadings={enabledHeadings}
              // onRowClick={onQuestionnaireClick}
            /> */}
            </Panel>
            </ScrollPane>
          </MenuContainer>
        </>
      </Container>
      <ModalFooter>
        <ButtonGroup horizontal align="right">
          <Button variant="secondary" >
            Cancel
          </Button>
          <Button
            variant="primary"
            autoFocus
            // onClick={() => onSubmit(selectedAnswers)}
          >
            Select
          </Button>
        </ButtonGroup>
      </ModalFooter>
    </StyledModal>;

// export const enabledHeadings = Template.bind({});
// enabledHeadings.args = {
//   enabledHeadings: [
//     Headings.TITLE,
//     Headings.OWNER,
//     Headings.CREATED,
//     Headings.MODIFIED,
//     Headings.PERMISSIONS,
//     Headings.LOCKED,
//     Headings.STARRED,
//     Headings.ACTIONS,
//   ],
// };
