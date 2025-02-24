import { atom } from "jotai";

export const loginAtom = atom({}); // Default empty auth state

export const signupAtom = atom({
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
});
