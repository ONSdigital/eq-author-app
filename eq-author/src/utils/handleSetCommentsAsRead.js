import { useEffect } from "react";
import UPDATE_COMMENTS_AS_READ from "../graphql/updateCommentsAsRead.graphql";
import { useMutation } from "@apollo/react-hooks";

// Function begins with capital letter - allows useEffect to be used here
const HandleSetCommentsAsRead = (pageId, userId) => {
  const [updateCommentsAsRead] = useMutation(UPDATE_COMMENTS_AS_READ);

  // https://stackoverflow.com/questions/66404382/how-to-detect-route-changes-using-react-router-in-react
  useEffect(() => {
    return function cleanup() {
      updateCommentsAsRead({
        variables: {
          input: {
            pageId,
            userId,
          },
        },
      });
    };
  }, [updateCommentsAsRead, pageId, userId]);
};

export default HandleSetCommentsAsRead;
