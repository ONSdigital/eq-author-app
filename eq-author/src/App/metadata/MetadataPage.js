import React from "react";
import PropTypes from "prop-types";
import { flowRight } from "lodash";
import styled from "styled-components";

import { useParams } from "react-router-dom";

import CustomPropTypes from "custom-prop-types";

import Error from "components/Error";
import Loading from "components/Loading";

import ScrollPane from "components/ScrollPane";
import Header from "components/EditorLayout/Header";
import { Grid, Column } from "components/Grid";
import { colors } from "constants/theme";
import MainCanvas from "components/MainCanvas";

import MetadataTable from "./MetadataTable";
import NoMetadata from "./NoMetadata";

import withCreateMetadata from "./withCreateMetadata";
import withDeleteMetadata from "./withDeleteMetadata";
import withUpdateMetadata from "./withUpdateMetadata";
import GetMetadataQuery from "./GetMetadataQuery";

import Panel from "components-themed/panels";

import VerticalTabs from "components/VerticalTabs";
import * as Common from "../data/DataCommon";

const StyledGrid = styled(Grid)`
  overflow: hidden;
  &:focus-visible {
    border: 3px solid ${colors.focus};
    margin: 0;
    outline: none;
  }
`;

const StyledMainCanvas = styled(MainCanvas)`
  padding: 0;
`;

export const UnwrappedMetadataPageContent = ({
  loading,
  error,
  data,
  onAddMetadata,
  onDeleteMetadata,
  onUpdateMetadata,
}) => {
  const params = useParams();

  if (loading && !data) {
    return <Loading height="100%">Questionnaire metadata loading…</Loading>;
  }

  if (error) {
    return <Error>Oops! Something went wrong</Error>;
  }

  const { questionnaire } = data;
  if (!questionnaire) {
    return <Error>Oops! Questionnaire could not be found</Error>;
  }

  const hasMetadata = questionnaire.metadata.length > 0;

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
                    <Common.TabTitle>Sample file data</Common.TabTitle>

                    <Common.TabContent>
                      Sample file data can be piped into question and section
                      pages using the toolbar.
                    </Common.TabContent>

                    <Common.TabContent>
                      An alias will be used as a temporary placeholder. When the
                      page is previewed in eQ, the value associated with this
                      alias will replace it.
                    </Common.TabContent>

                    <Common.TabContent>
                      In a live survey, the user will see sample file data
                      instead of a value or alias.
                    </Common.TabContent>

                    <Common.TabContent>
                      If sample file data is used in routing logic, the order of
                      the questions will be based on the value assigned to that
                      data.
                    </Common.TabContent>

                    <Panel variant="warning">
                      The key must match the title of the relevant column in the
                      sample file
                    </Panel>

                    {hasMetadata ? (
                      <StyledGrid tabIndex="-1" className="keyNav">
                        <ScrollPane data-test="metadata-modal-content">
                          <StyledMainCanvas>
                            <MetadataTable
                              metadata={questionnaire.metadata}
                              questionnaireId={questionnaire.id}
                              onAdd={onAddMetadata}
                              onDelete={onDeleteMetadata}
                              onUpdate={onUpdateMetadata}
                            />
                          </StyledMainCanvas>
                        </ScrollPane>
                      </StyledGrid>
                    ) : (
                      <NoMetadata
                        onAddMetadata={() => onAddMetadata(questionnaire.id)}
                      />
                    )}
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

UnwrappedMetadataPageContent.propTypes = {
  loading: PropTypes.bool.isRequired,
  error: PropTypes.object, // eslint-disable-line
  data: PropTypes.shape({
    questionnaire: CustomPropTypes.questionnaire,
  }),
  onAddMetadata: PropTypes.func.isRequired,
  onDeleteMetadata: PropTypes.func.isRequired,
  onUpdateMetadata: PropTypes.func.isRequired,
};

const MetadataPageContent = flowRight(
  withCreateMetadata,
  withDeleteMetadata,
  withUpdateMetadata
)(UnwrappedMetadataPageContent);

const MetadataPage = ({
  match: {
    params: { questionnaireId },
  },
}) => (
  <GetMetadataQuery questionnaireId={questionnaireId}>
    {(props) => <MetadataPageContent {...props} />}
  </GetMetadataQuery>
);

MetadataPage.propTypes = {
  match: CustomPropTypes.match.isRequired,
};

export default MetadataPage;
