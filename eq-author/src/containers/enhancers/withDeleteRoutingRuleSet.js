import { graphql } from "react-apollo";
import deleteRoutingRuleSet from "graphql/deleteRoutingRuleSet.graphql";
import gql from "graphql-tag";

const fragment = gql`
  fragment PageWithRouting on Page {
    routingRuleSet {
      id
    }
  }
`;

export const createUpdater = (routingRuleSetId, pageId) => proxy => {
  const id = `QuestionPage${pageId}`;
  const page = proxy.readFragment({
    id,
    fragment
  });

  page.routingRuleSet = null;

  proxy.writeFragment({
    id,
    fragment,
    data: page
  });
};

export const mapMutateToProps = ({ mutate }) => ({
  onDeleteRoutingRuleSet(routingRuleSetId, pageId) {
    const input = { id: routingRuleSetId };
    const update = createUpdater(routingRuleSetId, pageId);

    return mutate({
      variables: { input },
      update
    }).then(res => res.data.deleteRoutingRuleSet);
  }
});

export default graphql(deleteRoutingRuleSet, {
  props: mapMutateToProps
});
