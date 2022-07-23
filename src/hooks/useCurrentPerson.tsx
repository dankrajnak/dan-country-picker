import { createContext, PropsWithChildren, useContext } from "react";
import { useRecoilValue } from "recoil";
import CURRENT_USER_ATOM, { CurrentUser } from "../atoms/currentUser.atom";

const useCurrentPerson = (): CurrentUser | null => {
  return useRecoilValue(CURRENT_USER_ATOM);
};

export default useCurrentPerson;
