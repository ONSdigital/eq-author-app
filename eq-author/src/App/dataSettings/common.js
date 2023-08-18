import { buildDataPath } from "utils/UrlUtils";

import { enableOn } from "utils/featureFlags";

import styled from "styled-components";
import { colors } from "constants/theme";

export const tabItems = ({ params }) => [
  {
    title: `Sample file data`,
    url: `${buildDataPath(params)}/sample-file-data`,
    enabled: true,
  },
  {
    title: `Supplementary data`,
    url: `${buildDataPath(params)}/supplementary-data`,
    enabled: Boolean(enableOn(["dataset"])),
  },
];

export const navHeading = "Data sources";

export const headerTitle = "Data";

export const StyledPanel = styled.div`
  max-width: 97.5%;
  padding: 1.3em;
`;

export const TabTitle = styled.h2`
  font-size: 1.4em;
  font-weight: bold;
  color: ${colors.text};
  margin: 0;
`;

export const TabContent = styled.p`
  font-weight: 400;
  color: ${colors.text};
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

export const SampleFileDataContainer = styled.div`
  padding: 0.8em;
  border-left: 1px solid ${colors.lightGrey};
`;

export const PageMainCanvas = styled.div`
  display: flex;
  border: 1px solid ${colors.lightGrey};
  border-radius: 4px;
  background: ${colors.white};
`;

export const PageContainer = styled.div`
  padding: 0.8em;
  border-left: 1px solid ${colors.lightGrey};
  &:focus {
    border: 3px solid #fdbd56;
    margin: 0;
    outline: none;
  }
  &:focus:not(:focus-visible) {
    border: none;
    margin: 0;
    outline: none;
  }
`;

export default tabItems;
