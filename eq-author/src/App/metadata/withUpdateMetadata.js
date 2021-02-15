import { graphql } from "react-apollo";
import gql from "graphql-tag";
import { filter } from "graphql-anywhere";

import metadataFragment from "graphql/fragments/metadata.graphql";

const fragment = gql`
  {
    id
    key
    fallbackKey
    alias
    type
    dateValue
    regionValue
    languageValue
    textValue
  }
`;

const updateMetadataMutation = gql`
  mutation UpdateMetadata($input: UpdateMetadataInput!) {
    updateMetadata(input: $input) {
      ...Metadata
      displayName
    }
  }

  ${metadataFragment}
`;

export const mapMutateToProps = ({ mutate }) => ({
  onUpdateMetadata: (metadata) =>
    mutate({
      variables: {
        input: filter(fragment, metadata),
      },
      refetchQueries: ["GetQuestionnaireWithMetadata"],
    }),
});

export default graphql(updateMetadataMutation, {
  props: mapMutateToProps,
});
