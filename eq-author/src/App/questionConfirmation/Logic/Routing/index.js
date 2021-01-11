import React from "react";
import Logic from "App/shared/Logic";
import NoRouting, {
  Title,
  Paragraph,
} from "App/shared/Logic/Routing/NoRouting";
import GET_PAGE_QUERY from "./fragment.graphql";
import PropTypes from "prop-types";
import Panel from "components/Panel";

import { useQuery } from "@apollo/react-hooks";

const Routing = ({ match }) => {
  const { data } = useQuery(GET_PAGE_QUERY, {
    variables: {
      id: match.params.confirmationId,
    },
  });

  const page = data?.questionConfirmation;

  return (
    <Logic page={page}>
      <Panel>
        <NoRouting disabled>
          <Title>
            {" "}
            Routing logic not available for confirmation questions{" "}
          </Title>
          <Paragraph>
            The route will be based on the answer to the previous question.
          </Paragraph>
        </NoRouting>
      </Panel>
    </Logic>
  );
};

Routing.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      confirmationId: PropTypes.string.isRequired,
    }),
  }),
};

export default Routing;
