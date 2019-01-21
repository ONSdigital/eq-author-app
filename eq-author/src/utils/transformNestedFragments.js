// Because nested fragments are not supported in either graphql-tag or graphql-anywhere
// https://github.com/apollographql/graphql-tag/pull/227

import gql from "graphql-tag";

export default (queryOrFragment, fragments) => {
  let body = queryOrFragment;
  // Has it already been parsed by graphql-tag
  if (typeof queryOrFragment !== "string") {
    body = queryOrFragment.loc.source.body;
  }

  return gql([body, ...fragments.map(() => "")], ...fragments);
};
