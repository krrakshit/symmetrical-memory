import { atom } from "jotai";

export const loginAtom = atom({ email: "", password: "" }); // Default empty auth state

export const signupAtom = atom({
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
});
