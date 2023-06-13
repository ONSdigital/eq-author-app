import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { withRouter, useParams } from "react-router-dom";

import GET_PREPOP_SCHEMA_VERSIONS_QUERY from "graphql/getPrepopSchemaVersions.graphql";
import UPDATE_PREPOP_SCHEMA from "graphql/updatePrepopSchema.graphql";
import GET_PREPOP_SCHEMA from "graphql/getPrepopSchema.graphql";
import UNLINK_PREPOP_SCHEMA from "graphql/unlinkPrepopSchema.graphql";

import VerticalTabs from "components/VerticalTabs";
import * as Common from "../common";

import { Grid, Column } from "components/Grid";
import Header from "components/EditorLayout/Header";
import ScrollPane from "components/ScrollPane";
import Button from "components-themed/buttons";

import Theme from "contexts/themeContext";
import { SURVEY_IDS } from "constants/surveyIDs";
import { colors, radius } from "constants/theme";
import Icon from "assets/icon-select.svg";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableColumn,
  TableHeadColumn,
} from "components/datatable/Elements";

import Modal from "components-themed/Modal";
import UnlinkButton from "components/buttons/UnlinkButton";
import moment from "moment";

const StyledTitle = styled.h2`
  font-size: 1.1em;
  font-weight: bold;
  color: ${colors.text};
  margin: 0 0 0.5em 0;
`;
const Title = styled.h2`
  font-size: 1.2em;
  font-weight: bold;
  color: ${colors.text};
`;

const Option = styled.option``;

const CustomSelect = styled.select`
  font-size: 1em;
  border: 2px solid #d6d8da;
  appearance: none;
  background: ${colors.white} url("${Icon}") no-repeat right center;
  position: relative;
  transition: opacity 100ms ease-in-out;
  border-radius: ${radius};
  padding: 0.3em 1.5em 0.3em 0.3em;
  color: #222222;
  display: block;
  min-width: 25%;

  &:hover {
    outline: none;
  }
`;

const StyledTableBody = styled(TableBody)`
  background-color: ${colors.white};
`;

const SpacedTableColumn = styled(TableColumn)`
  padding: 0.5em 0.5em 0.2em;

  font-weight: bold;
  color: ${colors.textLight};
  word-break: break-word;
  border: 1px solid ${colors.bordersDark};
  :not(:last-of-type) {
    border-right: 1px solid ${colors.bordersDark};
    padding-left: 1em;
  }
`;

const StyledTableHeadColumn = styled(TableHeadColumn)`
  border: 1px solid ${colors.bordersDark};
  :not(:last-of-type) {
    border-right: 1px solid ${colors.bordersDark};
  }
`;

const StyledButton = styled(Button)`
  flex: 1;
  margin: 0 0 0.5em 0;
  left: 30%;
`;

const TitleContainer = styled.div`
  display: grid;
  grid-template-columns: 80% 20%;
`;

const formatDate = (date) => moment(date).locale("en-gb").format("DD/MM/YYYY");

const ONSDatasetPage = () => {
  const params = useParams();
  const questionnaireID = params.questionnaireID;

  const [surveyID, setSurveyID] = useState("surveyID");
  const [showDataset, setShowDataset] = useState(false);
  const [showUnlinkModal, setShowUnlinkModal] = useState(false);

  useEffect(() => {
    setSurveyID(surveyID);
  }, [surveyID]);

  const handleChange = ({ target }) => {
    if (target.value === "surveyID") {
      setSurveyID(undefined);
      setShowDataset(false);
    } else {
      setSurveyID(target.value);
      setShowDataset(true);
    }
  };

  const { data: surveyData } = useQuery(GET_PREPOP_SCHEMA_VERSIONS_QUERY, {
    variables: {
      id: surveyID || "surveyID",
    },
  });

  const [linkPrepopSchema] = useMutation(UPDATE_PREPOP_SCHEMA, {
    refetchQueries: ["GetPrepopSchema"],
  });

  const [unlinkPrepopSchema] = useMutation(UNLINK_PREPOP_SCHEMA, {
    refetchQueries: ["GetPrepopSchema"],
  });

  const { data: prepopSchema } = useQuery(GET_PREPOP_SCHEMA, {
    variables: { input: questionnaireID },
    fetchPolicy: "network-only",
  });

  const buildData = () => {
    const schemaData = prepopSchema
      ? prepopSchema.prepopSchema
        ? prepopSchema.prepopSchema.schema
        : null
      : null;

    if (schemaData) {
      schemaData.surveyId = prepopSchema.prepopSchema?.surveyId;
    }
    return schemaData;
  };

  const tableData = buildData();

  const handleUnlinkClick = () => {
    setShowUnlinkModal(true);
  };

  const UnlinkDataset = () => {
    unlinkPrepopSchema();
    setSurveyID(undefined);
    setShowDataset(false);
    setShowUnlinkModal(false);
  };

  return (
    <>
      <Modal
        title="Unlink dataset"
        positiveButtonText="Unlink"
        warningMessage="The dataset will be unlinked from the questionnaire. You will not be able to pipe data fields from this dataset. Any piped answers or example values will be deleted."
        isOpen={showUnlinkModal}
        onConfirm={() => UnlinkDataset()}
        onClose={() => setShowUnlinkModal(false)}
      />
      <Theme themeName="onsLegacyFont">
        <Common.Container>
          <ScrollPane>
            <Header title={Common.headerTitle} />
            <Common.PageContainer tabIndex="-1" className="keyNav">
              <Common.PageMainCanvas>
                <Grid>
                  <VerticalTabs
                    title={Common.navHeading}
                    cols={2.5}
                    tabItems={Common.tabItems({
                      params,
                    })}
                  />
                  <Column gutters={false} cols={9.5}>
                    <Common.SampleFileDataContainer>
                      <Common.StyledPanel>
                        {!tableData && (
                          <>
                            <Common.TabTitle>
                              Select an ONS dataset to link to
                            </Common.TabTitle>
                            <Common.TabContent>
                              Linking to an ONS dataset will allow you to pipe
                              data that respondents have provided in previous
                              questionnaires into question titles or percentage
                              answer type labels.
                            </Common.TabContent>
                            <Common.TabContent>
                              Only one dataset can be linked per questionnaire.
                            </Common.TabContent>
                            <StyledTitle>Select a survey ID</StyledTitle>
                            <CustomSelect
                              name="listId"
                              data-test="list-select"
                              onChange={handleChange}
                              value={surveyID}
                            >
                              <Option
                                value="surveyID"
                                data-test="default-option"
                              >
                                Survey ID
                              </Option>
                              {SURVEY_IDS.map((surveyID) => (
                                <Option key={surveyID} value={surveyID}>
                                  {surveyID}
                                </Option>
                              ))}
                            </CustomSelect>
                            {showDataset && (
                              <>
                                <Title>Datasets for survey ID {surveyID}</Title>
                                <Table data-test="datasets-table">
                                  <TableHead>
                                    <TableRow>
                                      <StyledTableHeadColumn width="40%">
                                        Version
                                      </StyledTableHeadColumn>
                                      <StyledTableHeadColumn width="40%">
                                        Date created
                                      </StyledTableHeadColumn>
                                      <StyledTableHeadColumn width="20%">
                                        Link dataset
                                      </StyledTableHeadColumn>
                                    </TableRow>
                                  </TableHead>
                                  {surveyData.prepopSchemaVersions && (
                                    <StyledTableBody>
                                      {surveyData.prepopSchemaVersions.versions.map(
                                        (version) => {
                                          return (
                                            <TableRow
                                              key={version.id}
                                              data-test={`dataset-row`}
                                            >
                                              <SpacedTableColumn>
                                                {version.version}
                                              </SpacedTableColumn>
                                              <SpacedTableColumn>
                                                {formatDate(
                                                  version.dateCreated
                                                )}
                                              </SpacedTableColumn>
                                              <SpacedTableColumn>
                                                <StyledButton
                                                  onClick={() =>
                                                    linkPrepopSchema({
                                                      variables: {
                                                        input: {
                                                          id: version.id,
                                                          surveyId: surveyID,
                                                        },
                                                      },
                                                    })
                                                  }
                                                  type="button"
                                                  variant="secondary"
                                                >
                                                  Link
                                                </StyledButton>
                                              </SpacedTableColumn>
                                            </TableRow>
                                          );
                                        }
                                      )}
                                    </StyledTableBody>
                                  )}
                                </Table>
                              </>
                            )}
                          </>
                        )}
                        {tableData && (
                          <>
                            <TitleContainer>
                              <Title>
                                Dataset for survey ID {tableData.surveyId}
                              </Title>
                              <UnlinkButton
                                data-test="btn-unlink-dataset"
                                onClick={handleUnlinkClick}
                              >
                                Unlink dataset
                              </UnlinkButton>
                            </TitleContainer>
                            <Table data-test="tableData-table">
                              <TableHead>
                                <TableRow>
                                  <StyledTableHeadColumn width="40%">
                                    Field
                                  </StyledTableHeadColumn>
                                </TableRow>
                              </TableHead>
                              <StyledTableBody>
                                <TableRow data-test={`tableData-row-id`}>
                                  <SpacedTableColumn>ID</SpacedTableColumn>
                                  <SpacedTableColumn>
                                    {tableData.id}
                                  </SpacedTableColumn>
                                </TableRow>
                                <TableRow data-test={`tableData-row-version`}>
                                  <SpacedTableColumn>Version</SpacedTableColumn>
                                  <SpacedTableColumn>
                                    {tableData.version}
                                  </SpacedTableColumn>
                                </TableRow>
                                <TableRow
                                  data-test={`tableData-row-dateCreated`}
                                >
                                  <SpacedTableColumn>
                                    Date created
                                  </SpacedTableColumn>
                                  <SpacedTableColumn>
                                    {formatDate(tableData.dateCreated)}
                                  </SpacedTableColumn>
                                </TableRow>
                              </StyledTableBody>
                            </Table>
                          </>
                        )}
                      </Common.StyledPanel>
                    </Common.SampleFileDataContainer>
                  </Column>
                </Grid>
              </Common.PageMainCanvas>
            </Common.PageContainer>
          </ScrollPane>
        </Common.Container>
      </Theme>
    </>
  );
};

// ONSDataSetPage.propTypes = {
//   data: PropTypes.shape({
//     questionnaire: CustomPropTypes.questionnaire,
//   }),
// };

export default withRouter(ONSDatasetPage);
