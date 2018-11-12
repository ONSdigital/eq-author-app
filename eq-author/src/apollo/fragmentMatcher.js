import { IntrospectionFragmentMatcher } from "apollo-cache-inmemory";
import fragmentTypes from "eq-author-graphql-schema/fragmentTypes.json";

export default new IntrospectionFragmentMatcher({
  introspectionQueryResultData: fragmentTypes
});
