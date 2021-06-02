import MUTATION from "graphql/updateTheme.graphql";
import { useMutation } from "@apollo/react-hooks";

export default () => {
  const [updateTheme] = useMutation(MUTATION);
  return (input) => updateTheme({ variables: { input } });
};
