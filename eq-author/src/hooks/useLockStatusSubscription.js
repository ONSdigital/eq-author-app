import { useSubscription } from "@apollo/react-hooks";
import LOCK_SUBSCRIPTION from "graphql/lockStatusSubscription.graphql";

export default ({ id = null } = {}) =>
  useSubscription(LOCK_SUBSCRIPTION, { variables: { id } });
