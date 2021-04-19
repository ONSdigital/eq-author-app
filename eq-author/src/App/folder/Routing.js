import React from "react";
import Logic from "App/shared/Logic";
import NoRouting, {
  Title,
  Paragraph,
} from "App/shared/Logic/Routing/NoRouting";
import GET_FOLDER_QUERY from "App/folder/graphql/fragment.graphql";
import PropTypes from "prop-types";
import Panel from "components/Panel";

import { useQuery } from "@apollo/react-hooks";

export const NO_ROUTING_TITLE = "Routing logic not available for folders";
export const NO_ROUTING_PARAGRAPH =
  "The route will be based on the answer to the previous question.";

const Routing = ({ match }) => {
  const { data } = useQuery(GET_FOLDER_QUERY, {
    variables: {
      input: {
        folderId: match.params.folderId,
      },
    },
  });

  const page = data?.folder;

  return (
    <Logic page={page}>
      <Panel>
        <NoRouting disabled>
          <Title>{NO_ROUTING_TITLE}</Title>
          <Paragraph>{NO_ROUTING_PARAGRAPH}</Paragraph>
        </NoRouting>
      </Panel>
    </Logic>
  );
};

Routing.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      folderId: PropTypes.string.isRequired,
    }),
  }),
};

export default Routing;
