import { useParams } from "react-router-dom";

export const useCurrentPageId = () => useParams()?.pageId;
