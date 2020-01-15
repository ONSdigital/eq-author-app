import React from "react";
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

const renderDataRows = sections => {
  const tableRows = [];

  for (const section of sections) {
    const pages = section.pages;
    const rows = pages.map(page => {
      if (page.answers.length == 1) {
        const rowBuilder = [];
        rowBuilder.push(
          <TableRow key={page.id}>
            <TableColumn>{page.alias}</TableColumn>
            <TableColumn>{page.title}</TableColumn>
            <TableColumn>{page.answers[0].type}</TableColumn>
            <TableColumn>{page.answers[0].label}</TableColumn>
            <TableColumn>{page.answers[0].qCode}</TableColumn>
          </TableRow>
        );
        if (page.answers[0].options) {
          for (const option of page.answers[0].options) {
            rowBuilder.push(
              <TableRow key={option.id}>
                <TableColumn />
                <TableColumn />
                <TableColumn>{`${page.answers[0].type} option`}</TableColumn>
                <TableColumn>{option.label}</TableColumn>
                <TableColumn>{option.qCode}</TableColumn>
              </TableRow>
            );
          }
        }
        return rowBuilder;
      }
    });
    tableRows.push(rows);
  }

  return tableRows;
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
      <TableBody>{renderDataRows(data.questionnaire.sections)}</TableBody>
    </Table>
  );
};

export default QCodesTable;
