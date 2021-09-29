import React from "react";
import gql from "graphql-tag";
import styled from "styled-components";
import { colors } from "constants/theme";

import SelectedAnswer from "./SelectedAnswer";
import TextButton from "components/buttons/TextButton";
import Button from "components/buttons/Button";

const Container = styled.div`
  border: 1px solid ${colors.grey};
  border-radius: 3px;
  padding: 1em;
  margin-bottom: 2em;
`;

const Title = styled.h3`
  font-weight: bold;
  font-size: 0.9em;
  color: ${colors.darkGrey};
  margin: 0;
`;

const RemoveAllBtn = styled(TextButton)`
  letter-spacing: 0.05rem;
  font-weight: bold;
  font-size: 0.8rem;
  margin: 0 0 0 auto;
`;

const SelectButton = styled(Button)`
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  margin-bottom: 1em;
`;

const Body = styled.div`
  margin-bottom: 1em;
`;

const Footer = styled.div``;

const AnswerSelector = ({ page, onUpdateCalculatedSummaryPage }) => {
  const sectionTitle = page.section.displayName;
  const answerType = page.summaryAnswers[0].type;
  const selectedAnswers = page.summaryAnswers;

  const handleRemoveAll = () =>
    onUpdateCalculatedSummaryPage({
      id: page.id,
      summaryAnswers: [],
    });

  return (
    <Container>
      <Header>
        <Title>
          {answerType} answers in {sectionTitle}
        </Title>
        <RemoveAllBtn>Remove all</RemoveAllBtn>
      </Header>
      <Body>
        {selectedAnswers.map((answer) => (
          <SelectedAnswer key={answer.id} {...answer} />
        ))}
      </Body>
      <Footer>
        <SelectButton variant="secondary">
          Select another {answerType.toLowerCase() || ""} answer
        </SelectButton>
      </Footer>
    </Container>
  );
};

AnswerSelector.fragments = {
  AnswerSelector: gql`
    fragment AnswerSelector on CalculatedSummaryPage {
      id
      section {
        id
        displayName
      }
      summaryAnswers {
        id
        displayName
        type
        properties
      }
    }
  `,
};

export default AnswerSelector;
