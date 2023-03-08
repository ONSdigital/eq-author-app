import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { withRouter, useParams } from "react-router-dom";

import VerticalTabs from "components/VerticalTabs";
import * as Common from "../common";

import { Grid, Column } from "components/Grid";
import Header from "components/EditorLayout/Header";
import ScrollPane from "components/ScrollPane";
import Button from "components-themed/buttons";

import Theme from "contexts/themeContext";
import { colors } from "constants/theme";
import Icon from "assets/icon-select.svg";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableColumn,
  TableHeadColumn,
} from "components/datatable/Elements";

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
  margin: 1.5em 0 1em 0;
`;

const Option = styled.option``;

const CustomSelect = styled.select`
  font-size: 1em;
  border: 3px solid #d6d8da;
  border-radius: 4px;
  appearance: none;
  background: white url("${Icon}") no-repeat right center;
  position: relative;
  transition: opacity 100ms ease-in-out;
  border-radius: 4px;
  padding: 0.3em 1.5em 0.3em 0.3em;
  color: #222222;
  display: block;
  min-width: 25%;

  &:hover {
    outline: none;
  }
`;

const StyledTableBody = styled(TableBody)`
  background-color: white;
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

const surveys = [
  {
    id: 121,
    displayName: "121",
    datasets: [
      { version: 4, dateCreated: "28/02/2023" },
      { version: 3, dateCreated: "25/02/2023" },
      { version: 2, dateCreated: "20/02/2023" },
      { version: 1, dateCreated: "5/02/2023" },
    ],
  },
  {
    id: 122,
    displayName: "122",
    datasets: [
      { version: 14, dateCreated: "28/02/2023" },
      { version: 13, dateCreated: "25/02/2023" },
      { version: 12, dateCreated: "20/02/2023" },
      { version: 11, dateCreated: "5/02/2023" },
    ],
  },
  {
    id: 123,
    displayName: "123",
    datasets: [
      { version: 24, dateCreated: "28/02/2023" },
      { version: 23, dateCreated: "25/02/2023" },
      { version: 22, dateCreated: "20/02/2023" },
      { version: 21, dateCreated: "5/02/2023" },
    ],
  },
];

const ONSDatasetPage = () => {
  const params = useParams();

  const [surveyID, setSurveyID] = useState(undefined);
  const [showDataset, setShowDataset] = useState(false);

  useEffect(() => {
    setSurveyID(surveyID);
  }, [surveyID]);

  const handleChange = ({ target }) => {
    if (target.value === "surveyID") {
      setSurveyID(undefined);
    } else {
      setSurveyID(target.value);
      setShowDataset(true);
    }
  };

  const handleClick = () => {
    setShowDataset(!showDataset);
  };

  return (
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
                      <Common.TabTitle>
                        Select an ONS dataset to link to
                      </Common.TabTitle>
                      <Common.TabContent>
                        Linking to an ONS dataset will allow you to pipe data
                        that respondents have provided in previous
                        questionnaires into question titles or percentage answer
                        type labels.
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
                        <Option value="surveyID">Survey ID</Option>
                        {surveys.map((list) => (
                          <Option key={list.id} value={list.id}>
                            {list.displayName}
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
                            <StyledTableBody>
                              {surveys[0].datasets.map((dataset) => {
                                return (
                                  <TableRow
                                    key={dataset.version}
                                    data-test={`dataset-row`}
                                  >
                                    <SpacedTableColumn>
                                      {dataset.version}
                                    </SpacedTableColumn>
                                    <SpacedTableColumn>
                                      {dataset.dateCreated}
                                    </SpacedTableColumn>
                                    <SpacedTableColumn>
                                      <StyledButton
                                        onClick={handleClick}
                                        type="button"
                                        variant="secondary"
                                      >
                                        Link
                                      </StyledButton>
                                    </SpacedTableColumn>
                                  </TableRow>
                                );
                              })}
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
  );
};

export default withRouter(ONSDatasetPage);
