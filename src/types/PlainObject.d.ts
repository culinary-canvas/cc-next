// TODO: use Exclude instead of Partial to more precisely extract only value properties
export type PlainObject<T> = Partial<T>
