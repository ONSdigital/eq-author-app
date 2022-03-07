import { useEffect } from "react";
import UPDATE_COMMENTS_AS_READ from "../graphql/updateCommentsAsRead.graphql";
import { useMutation } from "@apollo/react-hooks";

// Function begins with capital letter - allows useEffect to be used here
const HandleSetCommentsAsRead = (pageId, userId, history) => {
  const [updateCommentsAsRead] = useMutation(UPDATE_COMMENTS_AS_READ);

  // https://stackoverflow.com/questions/66404382/how-to-detect-route-changes-using-react-router-in-react
  useEffect(() => {
    const unlisten = history.listen(() => {
      updateCommentsAsRead({
        variables: {
          input: {
            pageId,
            userId,
          },
        },
      });
    });
    return function cleanup() {
      unlisten();
    };
  });
};

export default HandleSetCommentsAsRead;
