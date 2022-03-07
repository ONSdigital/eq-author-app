import { useEffect } from "react";
import UPDATE_COMMENTS_AS_READ from "../graphql/updateCommentsAsRead.graphql";
import { useMutation } from "@apollo/react-hooks";

const HandleSetCommentsAsRead = (/*pageId, userId*/) => {
  // const [updateCommentsAsRead] = useMutation(UPDATE_COMMENTS_AS_READ);

  console.log('"test"', "test");

  // updateCommentsAsRead({
  //   variables: {
  //     input: {
  //       pageId,
  //       userId,
  //     },
  //   },
  // });
};

export default HandleSetCommentsAsRead;
