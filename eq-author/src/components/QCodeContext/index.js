import { createContext, useContext } from "react";

export const QCodeContext = createContext();

export const useQCodeContext = () => useContext(QCodeContext);

export default QCodeContext;
