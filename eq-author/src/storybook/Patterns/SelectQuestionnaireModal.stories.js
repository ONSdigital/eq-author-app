import React from "react";
import styled from "styled-components";
import { colors } from "constants/theme";

import Modal from "components/modals/Modal";
import SearchBar from 'components/SearchBar'
import ScrollPane from "components/ScrollPane";
import Button from "components/buttons/Button";
import ButtonGroup from "components/buttons/ButtonGroup";
import Panel from "components/Panel";
import QuestionnaireTable from "components/QuestionnaireTable";
import tableHeadings from "components/QuestionnaireTable/TableHeadings";
import AccessFilter from "../../components/QuestionnairesView/Header/AccessFilter";

import * as Headings from "constants/table-headings";
// import { useLockUnlockQuestionnaire } from "hooks/useSetQuestionnaireLocked";

export default {
    title: "Patterns/Select Questionnaire Modal",
    component: Modal,
    argTypes: {
      onConfirm: { action: "Confirmed" },
      onCancel: { action: "Cancelled" },
    },
  };

const ModalFooter = styled.div`
  padding: 1.5em;
  border-top: 1px solid ${colors.bordersLight};
`;

const StyledModal = styled(Modal)`
  .Modal {
    padding: 0;
    width: 55em;
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

const Wrapper = styled.div`
  margin: 1em 0;
  display: flex;
  z-index: 1;
  align-items: center;
  justify-content: space-between;
`;

const Template = (args) => 
<StyledModal isOpen hasCloseButton>
      <Container>
        <>
          <ModalHeader>
            <ModalTitle>Select the source questionnaire</ModalTitle>
            <ModalSubtitle>
            <Wrapper>
                  {/* //TODO needs onChange prop setup and passed here
                  // see example in App/QuestionnairesPage/QuestionnairesView/Header */}
                  <SearchBar/>
                  {/* <AccessFilter onToggleFilter={onToggleFilter} isFiltered={isFiltered} /> */}
                  <AccessFilter  />
                  </Wrapper>
            </ModalSubtitle>
          </ModalHeader>
          <MenuContainer>
            <ScrollPane>
            <Panel>
            <QuestionnaireTable {...args}
              // onSortClick={onSortQuestionnaires}
              // onReverseClick={onReverseSort}
              // sortOrder={sortOrder}
              // currentSortColumn={sortColumn}
              tableHeadings={tableHeadings}
              // questionnaires={questionnaires}
              // autoFocusId={autoFocusId}
              // onDeleteQuestionnaire={onDeleteQuestionnaire}
              // onDuplicateQuestionnaire={onDuplicateQuestionnaire}
              // handleLock={handleLock}
              // enabledHeadings={enabledHeadings}
              // onRowClick={onQuestionnaireClick}
            />
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

const user = {
  id: "3",
  name: "Foo",
  email: "foo@bar.com",
  displayName: "Foo",
};

const buildQuestionnaire = (index) => ({
  id: `questionnaire${index}`,
  displayName: `Questionnaire ${index}`,
  title: `Questionnaire ${index} Title`,
  shortTitle: "",
  createdAt: `2019-05-${30 - index}T12:36:50.984Z`,
  updatedAt: `2019-05-${30 - index}T12:36:50.984Z`,
  createdBy: user,
  permission: "Write",
      publishStatus: "Unpublished",
  starred: false,
  locked: false,
});

let questionArray; 
(questionArray=[ ...Array(11).keys() ]).shift()

const questionnaires = questionArray.map((index) => 
  buildQuestionnaire(index),
);



export const MainModal = Template.bind({});
MainModal.args = {
  questionnaires: questionnaires,
  enabledHeadings: [
    Headings.TITLE,
    Headings.OWNER,
    Headings.CREATED,
    Headings.MODIFIED,
  ],
  // apolloClient: {
  //   mocks: [
  //   jest.mock("hooks/useSetQuestionnaireLocked", () => ({
  //     useLockUnlockQuestionnaire: jest.fn(() => [jest.fn(), jest.fn()]),
  //   }))],
  // },
};
