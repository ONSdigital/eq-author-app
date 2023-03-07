import React from "react";
import styled from "styled-components";
import { withRouter, useParams } from "react-router-dom";

import VerticalTabs from "components/VerticalTabs";
import * as Common from "../common";

import { Grid, Column } from "components/Grid";
import Header from "components/EditorLayout/Header";
import ScrollPane from "components/ScrollPane";

import { colors } from "constants/theme";
import Icon from "assets/icon-select.svg";

const StyledTitle = styled.h2`
  font-size: 1.1em;
  font-weight: bold;
  color: ${colors.text};
  margin: 0;
`;

const CustomSelect = styled.select`
  font-size: 1em;
  border: 2px solid #d6d8da;
  border-radius: 4px;
  appearance: none;
  background: white url("${Icon}") no-repeat right center;
  position: relative;
  transition: opacity 100ms ease-in-out;
  border-radius: 4px;
  padding: 0.3em 1.5em 0.3em 0.3em;
  color: #222222;
  display: block;
  min-width: 30%;

  &:hover {
    outline: none;
  }
`;

const lists = [
  { id: 121, displayName: "121" },
  { id: 122, displayName: "122" },
  { id: 123, displayName: "123" },
];

const ONSDatasetPage = () => {
  const params = useParams();

  return (
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
                      Linking to an ONS dataset will allow you to pipe data that
                      respondents have provided in previous questionnaires into
                      question titles or percentage answer type labels.
                    </Common.TabContent>

                    <Common.TabContent>
                      Only one dataset can be linked per questionnaire.
                    </Common.TabContent>
                    <StyledTitle>Select a survey ID</StyledTitle>
                    <CustomSelect
                      name="listId"
                      data-test="list-select"
                      onChange={() => {}}
                      value={"Test"}
                    >
                      <option value="">Survey ID</option>
                      {lists.map((list) => (
                        <option key={list.id} value={list.id}>
                          {list.displayName}
                        </option>
                      ))}
                    </CustomSelect>
                  </Common.StyledPanel>
                </Common.SampleFileDataContainer>
              </Column>
            </Grid>
          </Common.PageMainCanvas>
        </Common.PageContainer>
      </ScrollPane>
    </Common.Container>
  );
};

export default withRouter(ONSDatasetPage);
