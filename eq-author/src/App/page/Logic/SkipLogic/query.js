import gql from "graphql-tag";
import SkipLogicPage from "./SkipLogicPage";
import transformNestedFragments from "utils/transformNestedFragments";

export default transformNestedFragments(
  gql`
    query GetSkipLogic($input: QueryInput!) {
      page(input: $input) {
        ...SkipLogicPage
      }
    }
  `,
  SkipLogicPage.fragments
);
