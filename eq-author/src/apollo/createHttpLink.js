import { HttpLink } from "apollo-link-http";

export default uri =>
  new HttpLink({
    uri
  });
