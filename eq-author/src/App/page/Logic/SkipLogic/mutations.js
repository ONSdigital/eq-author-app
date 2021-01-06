import { useMutation } from "@apollo/react-hooks";
import CREATE_SKIP_MUTATION from "./SkipLogicPage/createSkipCondition.graphql";

const useCreateSkipCondition = ({ parentId }) => {
  const [createSkipCondition] = useMutation(CREATE_SKIP_MUTATION, {
    variables: {
      input: {
        parentId,
      },
    },
  });

  return createSkipCondition;
};

export { useCreateSkipCondition };
