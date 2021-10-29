export type ExtractGeneric<T> = T extends (infer U)[] ? U : T
