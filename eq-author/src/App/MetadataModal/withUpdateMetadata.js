import { graphql } from "react-apollo";
import gql from "graphql-tag";

import metadataFragment from "graphql/fragments/metadata.graphql";

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
  onUpdateMetadata: metadata =>
    mutate({
      variables: { input: metadata }
    })
});

export default graphql(updateMetadataMutation, {
  props: mapMutateToProps
});
