import { graphql } from "react-apollo";
import createRoutingRuleSet from "graphql/createRoutingRuleSet.graphql";

import gql from "graphql-tag";

const fragment = gql`
  fragment PageWithRouting on Page {
    routingRuleSet {
      id
    }
  }
`;

export const createUpdater = pageId => (proxy, result) => {
  const id = `QuestionPage${pageId}`;

  const questionPage = proxy.readFragment({
    id,
    fragment
  });

  questionPage.routingRuleSet = result.data.createRoutingRuleSet;

  proxy.writeFragment({
    id,
    fragment,
    data: questionPage
  });
};

export const mapMutateToProps = ({ mutate, ownProps }) => ({
  onAddRoutingRuleSet() {
    const { pageId } = ownProps.match.params;
    const input = {
      questionPageId: pageId
    };

    const update = createUpdater(pageId);

    return mutate({
      variables: { input },
      update
    });
  }
});

export default graphql(createRoutingRuleSet, {
  props: mapMutateToProps
});
