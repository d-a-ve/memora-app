import type { User } from "./db/schema/index.js";

export type AppVariables = {
  user: User | null;
};

export type AppEnv = {
  Variables: AppVariables;
};
