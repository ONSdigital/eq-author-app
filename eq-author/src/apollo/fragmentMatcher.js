import { IntrospectionFragmentMatcher } from "apollo-cache-inmemory";
import fragmentTypes from "./fragmentTypes.json";

export default new IntrospectionFragmentMatcher({
  introspectionQueryResultData: fragmentTypes
});
