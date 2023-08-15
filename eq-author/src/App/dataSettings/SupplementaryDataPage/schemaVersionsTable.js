import React from "react";
import { useQuery } from "@apollo/react-hooks";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors } from "constants/theme";
import Loading from "components/Loading";
import Button from "components-themed/buttons";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableColumn,
  TableHeadColumn,
} from "components/datatable/Elements";
import moment from "moment";

import GET_PREPOP_SCHEMA_VERSIONS_QUERY from "graphql/getPrepopSchemaVersions.graphql";

const Title = styled.h2`
  font-size: 1.2em;
  font-weight: bold;
  color: ${colors.text};
  margin: 1.5em 0 1em 0;
`;

const StyledTableHeadColumn = styled(TableHeadColumn)`
  border: 1px solid ${colors.bordersDark};
  :not(:last-of-type) {
    border-right: 1px solid ${colors.bordersDark};
  }
`;

const StyledTableBody = styled(TableBody)`
  background-color: ${colors.white};
`;

const SpacedTableColumn = styled(TableColumn)`
  padding: 0.5em 0.5em 0.2em;
  color: ${colors.text};
  word-break: break-word;
  border: 1px solid ${colors.bordersDark};
  padding-left: 1.2em;
  :not(:last-of-type) {
    border-right: 1px solid ${colors.bordersDark};
  }
`;

const StyledButton = styled(Button)`
  flex: 1;
  margin: 0 0 0.5em 0;
  left: 30%;
`;

const formatDate = (date) => moment(date).locale("en-gb").format("DD/MM/YYYY");

const SchemaVersionTable = ({ surveyId, linkPrepopSchema }) => {
  const { loading, data } = useQuery(GET_PREPOP_SCHEMA_VERSIONS_QUERY, {
    variables: {
      id: surveyId,
    },
    fetchPolicy: "network-only",
  });

  if (loading) {
    return <Loading height="100%">Getting schema versions...</Loading>;
  }

  return (
    <>
      <Title>Datasets for survey ID {surveyId}</Title>
      <Table data-test="datasets-table">
        <TableHead>
          <TableRow>
            <StyledTableHeadColumn width="40%">Version</StyledTableHeadColumn>
            <StyledTableHeadColumn width="40%">
              Date created
            </StyledTableHeadColumn>
            <StyledTableHeadColumn width="20%">
              Link dataset
            </StyledTableHeadColumn>
          </TableRow>
        </TableHead>
        {data?.prepopSchemaVersions && (
          <StyledTableBody>
            {data?.prepopSchemaVersions?.versions?.map((version) => {
              return (
                <TableRow key={version.guid} data-test={`dataset-row`}>
                  <SpacedTableColumn bold>
                    {version.sds_schema_version}
                  </SpacedTableColumn>
                  <SpacedTableColumn bold>
                    {formatDate(version.sds_published_at)}
                  </SpacedTableColumn>
                  <SpacedTableColumn bold>
                    <StyledButton
                      onClick={() =>
                        linkPrepopSchema({
                          variables: {
                            input: {
                              id: version.guid,
                              surveyId: surveyId,
                              version: version.sds_schema_version,
                              dateCreated: version.sds_published_at,
                            },
                          },
                        })
                      }
                      type="button"
                      variant="secondary"
                      data-test="btn-link"
                    >
                      Link
                    </StyledButton>
                  </SpacedTableColumn>
                </TableRow>
              );
            })}
          </StyledTableBody>
        )}
      </Table>
    </>
  );
};

SchemaVersionTable.propTypes = {
  surveyId: PropTypes.string.isRequired,
  linkPrepopSchema: PropTypes.func.isRequired,
};

export default SchemaVersionTable;
