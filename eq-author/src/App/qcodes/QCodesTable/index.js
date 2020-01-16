import React from "react";
import styled from "styled-components";
import { useQuery } from "@apollo/react-hooks";

import GET_ALL_ANSWERS from "./GetAllAnswers.graphql";

import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableColumn,
  TableHeadColumn,
} from "components/datatable/Elements";

const SpacedTableColumn = styled(TableColumn)`
  padding: 0.5em;
`;

const buildOptionRow = (option, questionType) => {
  const { id, label, qCode } = option;
  return (
    <Row
      collapsed
      id={id}
      type={`${questionType} option`}
      label={label}
      qCode={qCode}
    />
  );
};

const buildQuestionRows = page => {
  const rowBuilder = [];
  const { id, alias, title, answers } = page;
  const { type, label, qCode, options } = answers[0];
  rowBuilder.push(
    <Row
      id={id}
      alias={alias}
      title={title}
      type={type}
      label={label}
      qCode={qCode}
    />
  );

  if (options) {
    for (const option of options) {
      const optionRow = buildOptionRow(option, type);
      rowBuilder.push(optionRow);
    }
  }

  return rowBuilder;
};

const buildContent = sections => {
  const content = [];

  for (const section of sections) {
    const pages = section.pages;

    const rows = pages.map(page => {
      const rowBuilder = [];
      const numOfAnswersOnPage = page.answers.length;

      rowBuilder.push(buildQuestionRows(page));

      if (numOfAnswersOnPage > 1) {
        for (let i = 1; i < numOfAnswersOnPage; i++) {
          const { id, answers } = page;
          const { type, label, qCode, options } = answers[i];
          rowBuilder.push(
            <Row collapsed id={id} type={type} label={label} qCode={qCode} />
          );

          if (options) {
            for (const option of options) {
              const optionRow = buildOptionRow(option, type);
              rowBuilder.push(optionRow);
            }
          }
        }
      }

      return rowBuilder;
    });

    content.push(rows);
  }

  return content;
};

const Row = ({ id, alias, title, type, label, qCode, collapsed }) => {
  const renderGlobalColumns = () => (
    <>
      <SpacedTableColumn>{type}</SpacedTableColumn>
      <SpacedTableColumn>{label}</SpacedTableColumn>
      <SpacedTableColumn>{qCode}</SpacedTableColumn>
    </>
  );

  if (collapsed) {
    return (
      <TableRow key={id}>
        <SpacedTableColumn colSpan={2} />
        {renderGlobalColumns()}
      </TableRow>
    );
  }

  return (
    <TableRow key={id}>
      <SpacedTableColumn>{alias}</SpacedTableColumn>
      <SpacedTableColumn>
        {title.replace(/(<([^>]+)>)/gi, "")}
      </SpacedTableColumn>
      {renderGlobalColumns()}
    </TableRow>
  );
};

const QCodesTable = ({ questionnaireId }) => {
  const { loading, error, data } = useQuery(GET_ALL_ANSWERS, {
    variables: {
      input: {
        questionnaireId,
      },
    },
  });

  if (loading) {
    return <p>Loading ...</p>;
  }

  if (error) {
    return <p>Error</p>;
  }

  const { sections } = data.questionnaire;

  return (
    <Table data-test="qcodes-table">
      <TableHead>
        <TableRow>
          <TableHeadColumn width="20%">Short code</TableHeadColumn>
          <TableHeadColumn width="20%">Question</TableHeadColumn>
          <TableHeadColumn width="20%">Type</TableHeadColumn>
          <TableHeadColumn width="20%">Answer label</TableHeadColumn>
          <TableHeadColumn width="20%">Qcode</TableHeadColumn>
        </TableRow>
      </TableHead>
      <TableBody>{buildContent(sections)}</TableBody>
    </Table>
  );
};

export default QCodesTable;
