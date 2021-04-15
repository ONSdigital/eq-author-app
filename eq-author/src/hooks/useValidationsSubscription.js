import { useSubscription } from "@apollo/react-hooks";
import VALIDATIONS_SUBSCRIPTION from "graphql/validationsSubscription.graphql";

export default ({ id }) =>
  useSubscription(VALIDATIONS_SUBSCRIPTION, { variables: { id } });
