import { atom } from "recoil";

export type CurrentUser = {
  name: string;
};

const CURRENT_USER_ATOM = atom<CurrentUser | null>({
  key: "currentUser",
  default: null,
});

export default CURRENT_USER_ATOM;
