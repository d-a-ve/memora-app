import { signInWithOAuth } from "@api/auth";

export const AUTHMETHODS = [
  {
    id: 1,
    name: "Google",
    icon: "./assets/google.svg",
    clickFunction: () => signInWithOAuth("google"),
  },
];

export const LOGIN_DEFAULT_VALUES = {
  email: "",
  password: "",
};

export const calenderMonths = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
