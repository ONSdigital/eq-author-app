import { graphql } from "react-apollo";
import updateCalculatedSummaryPageMutation from "./updateCalculatedSummaryPageMutation.graphql";
import { filter } from "graphql-anywhere";
import gql from "graphql-tag";

const pageFragment = gql`
  fragment CalSumPage on CalculatedSummaryPage {
    id
    alias
    title
    totalTitle
    type
  }
`;

export const mapMutateToProps = ({ mutate }) => ({
  onUpdateCalculatedSummaryPage: (page) => {
    const ids = page.summaryAnswers.map((o) => o.id);
    const data = filter(pageFragment, page);
    return mutate({
      variables: { input: { ...data, summaryAnswers: ids } },
    });
  },
});

export default graphql(updateCalculatedSummaryPageMutation, {
  props: mapMutateToProps,
});
