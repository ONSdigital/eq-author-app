import { useMutation } from "@apollo/react-hooks";
import CREATE_SKIP_CONDITION from "./createSkipCondition.graphql";
import DELETE_SKIP_CONDITION from "./deleteSkipCondition.graphql";
import DELETE_SKIP_CONDITIONS from "./deleteSkipConditions.graphql";

const createMutationHook = (mutationQuery, input) => {
  const [mutationFn] = useMutation(mutationQuery, {
    variables: {
      input,
    },
  });

  return mutationFn;
};

export const useCreateSkipCondition = ({ parentId }) =>
  createMutationHook(CREATE_SKIP_CONDITION, { parentId });

export const useDeleteSkipConditions = ({ parentId }) =>
  createMutationHook(DELETE_SKIP_CONDITIONS, { parentId });

export const useDeleteSkipCondition = ({ id }) =>
  createMutationHook(DELETE_SKIP_CONDITION, { id });
