import { TypedPocketBase } from "$/shared/types.ts";

export type SeedFnParams<T = unknown> = T & {
  pb: TypedPocketBase;
};
