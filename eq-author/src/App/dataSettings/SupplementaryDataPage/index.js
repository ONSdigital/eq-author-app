import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { withRouter, useParams } from "react-router-dom";

import UPDATE_SUPPLEMENTARY_DATA from "graphql/updateSupplementaryData.graphql";
import GET_SUPPLEMENTARY_DATA from "graphql/getSupplementaryData.graphql";
import UNLINK_SUPPLEMENTARY_DATA from "graphql/unlinkSupplementaryData.graphql";

import SchemaVersionTable from "./schemaVersionsTable";

import VerticalTabs from "components/VerticalTabs";
import * as Common from "../common";

import { Grid, Column } from "components/Grid";
import Header from "components/EditorLayout/Header";
import ScrollPane from "components/ScrollPane";
import Loading from "components/Loading";
import Error from "components/Error";

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

const StyledTableHeadColumn = styled(TableHeadColumn)`
  border: 1px solid ${colors.bordersDark};
  :not(:last-of-type) {
    border-right: 1px solid ${colors.bordersDark};
  }
`;

const StyledUl = styled.ul`
  margin: 0;
  padding: 0 0 0 1.5em;
`;
const StyledLi = styled.li``;

const formatDate = (date) => moment(date).locale("en-gb").format("DD/MM/YYYY");

const CustomGrid = styled(Grid)`
  margin-top: 0.5em;
`;

const CustomColumn = styled(Column)`
  font-weight: bold;
`;

const UnlinkButtonWrapper = styled.div`
  text-align: right;
`;

const DataFieldsWrapper = styled.div`
  margin-top: 1em;
`;

const SupplementaryDataPage = () => {
  const params = useParams();
  const questionnaireID = params.questionnaireID;

  const [surveyID, setSurveyID] = useState("surveyID");
  const [showVersionsTable, setShowVersionsTable] = useState(false);
  const [showUnlinkModal, setShowUnlinkModal] = useState(false);

  useEffect(() => {
    setSurveyID(surveyID);
  }, [surveyID]);

  const handleChange = ({ target }) => {
    if (target.value === "surveyID") {
      setSurveyID(undefined);
      setShowVersionsTable(false);
    } else {
      setSurveyID(target.value);
      setShowVersionsTable(true);
    }
  };

  const [linkSupplementaryData] = useMutation(UPDATE_SUPPLEMENTARY_DATA, {
    refetchQueries: ["GetSupplementaryData", "GetQuestionnaire"],
  });

  const [unlinkSupplementaryData] = useMutation(UNLINK_SUPPLEMENTARY_DATA, {
    refetchQueries: ["GetSupplementaryData", "GetQuestionnaire"],
  });

  const {
    data: supplementaryData,
    loading: surveyLoading,
    error: surveyError,
  } = useQuery(GET_SUPPLEMENTARY_DATA, {
    variables: { input: questionnaireID },
    fetchPolicy: "cache-and-network",
  });

  const buildData = () => {
    let schemaData;
    if (supplementaryData?.supplementaryData?.data) {
      schemaData = supplementaryData
        ? supplementaryData.supplementaryData
        : null;
    }
    if (schemaData) {
      schemaData.surveyId = supplementaryData.supplementaryData?.surveyId;
    }
    return schemaData;
  };

  const tableData = buildData();

  const schemaData = tableData?.data;

  const handleUnlinkClick = () => {
    setShowUnlinkModal(true);
  };

  const unlinkDataset = () => {
    unlinkSupplementaryData();
    setSurveyID(undefined);
    setShowVersionsTable(false);
    setShowUnlinkModal(false);
  };

  if (surveyLoading) {
    return <Loading height="100%">Dataset page is loading...</Loading>;
  }

  if (surveyError) {
    return <Error>Dataset page error</Error>;
  }

  return (
    <>
      <Modal
        title="Unlink dataset"
        positiveButtonText="Unlink"
        warningMessage="The dataset will be unlinked from the questionnaire. You will not be able to pipe data fields from this dataset. Any piped answers or example values will be deleted."
        isOpen={showUnlinkModal}
        onConfirm={() => unlinkDataset()}
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
                              Select a supplementary dataset to link to
                            </Common.TabTitle>
                            <Common.TabContent>
                              Linking to a supplementary dataset will allow you
                              to pipe data that respondents have provided in
                              previous questionnaires into question titles or
                              percentage answer type labels.
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
                            {showVersionsTable && (
                              <SchemaVersionTable
                                surveyId={surveyID}
                                linkSupplementaryData={linkSupplementaryData}
                              />
                            )}
                          </>
                        )}
                        {tableData && (
                          <>
                            <Grid>
                              <Column gutters={false} cols={8}>
                                <Common.TabTitle>
                                  Dataset for survey ID {tableData.surveyId}
                                </Common.TabTitle>
                              </Column>
                              <Column gutters={false} cols={4}>
                                <UnlinkButtonWrapper>
                                  <UnlinkButton
                                    data-test="btn-unlink-dataset"
                                    onClick={handleUnlinkClick}
                                  >
                                    Unlink dataset
                                  </UnlinkButton>
                                </UnlinkButtonWrapper>
                              </Column>
                            </Grid>
                            <CustomGrid>
                              <Column gutters={false} cols={2}>
                                ID:
                              </Column>
                              <CustomColumn gutters={false} cols={5}>
                                {tableData.sdsGuid}
                              </CustomColumn>
                            </CustomGrid>
                            <CustomGrid>
                              <Column gutters={false} cols={2}>
                                Version:
                              </Column>
                              <CustomColumn gutters={false} cols={2}>
                                {tableData.sdsVersion}
                              </CustomColumn>
                            </CustomGrid>
                            <CustomGrid>
                              <Column gutters={false} cols={2}>
                                Date created:
                              </Column>
                              <CustomColumn gutters={false} cols={2}>
                                {formatDate(tableData.sdsDateCreated)}
                              </CustomColumn>
                            </CustomGrid>
                            <DataFieldsWrapper>
                              <StyledTitle>
                                Data fields available for piping
                              </StyledTitle>
                              <Common.TabContent>
                                A respondent&apos;s answers to previous
                                questions are stored in supplementary datasets
                                as data fields. Data fields can be piped into
                                question and section pages using the toolbar.
                              </Common.TabContent>
                              <Common.TabContent>
                                Data fields are defined as either:
                              </Common.TabContent>
                              <StyledUl>
                                <StyledLi>
                                  single data fields, which have one entry with
                                  no restrictions on piping
                                </StyledLi>
                                <StyledLi>
                                  multivalued data fields, which have one or
                                  more entries and are only available for piping
                                  in repeating sections
                                </StyledLi>
                              </StyledUl>
                              <Common.TabContent>
                                The data field name will be used as a temporary
                                placeholder when piping into question and
                                section pages.
                              </Common.TabContent>
                              <Common.TabContent>
                                The value assigned to the piped data field will
                                replace the relevant placeholder when previewing
                                the questionnaire in eQ. The value will then be
                                replaced by relevant sample file data when the
                                respondent views the live questionnaire.
                              </Common.TabContent>
                              <Table data-test="data-fields-table">
                                <TableHead>
                                  <TableRow>
                                    <StyledTableHeadColumn width="20%">
                                      Data field name
                                    </StyledTableHeadColumn>
                                    <StyledTableHeadColumn width="20%">
                                      List source
                                    </StyledTableHeadColumn>
                                    <StyledTableHeadColumn width="30%">
                                      Description
                                    </StyledTableHeadColumn>
                                    <StyledTableHeadColumn width="30%">
                                      Example
                                    </StyledTableHeadColumn>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {schemaData.map((list) => {
                                    return list.schemaFields.map((field) => {
                                      return (
                                        <TableRow
                                          key={field.id}
                                          data-test={`data-field-row`}
                                        >
                                          <SpacedTableColumn>
                                            {field.displayName}
                                          </SpacedTableColumn>
                                          <SpacedTableColumn>
                                            {list.listName}
                                          </SpacedTableColumn>
                                          <SpacedTableColumn>
                                            {field.description}
                                          </SpacedTableColumn>
                                          <SpacedTableColumn>
                                            {field.type === "array"
                                              ? field.exampleArray.join(", ")
                                              : field.example}
                                          </SpacedTableColumn>
                                        </TableRow>
                                      );
                                    });
                                  })}
                                </TableBody>
                              </Table>
                            </DataFieldsWrapper>
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

export default withRouter(SupplementaryDataPage);
