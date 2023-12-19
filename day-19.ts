import { Expect, Equal } from "type-testing";

// Subject:
// type Rebuild = unknown;

// My solution:
type RebuildOne<
  TOrder,
  TEntity,
  TStack extends unknown[] = [],
> = TOrder extends TStack["length"]
  ? TStack
  : RebuildOne<TOrder, TEntity, [TEntity, ...TStack]>;
type Rebuild<TOrder extends unknown[]> = TOrder extends [
  infer T1,
  infer T2,
  infer T3,
  infer T4,
  infer T5,
  infer T6,
  infer T7,
]
  ? [
      ...RebuildOne<T1, "🛹">,
      ...RebuildOne<T2, "🚲">,
      ...RebuildOne<T3, "🛴">,
      ...RebuildOne<T4, "🏄">,
      ...RebuildOne<T5, "🛹">,
      ...RebuildOne<T6, "🚲">,
      ...RebuildOne<T7, "🛴">,
    ]
  : never;

// Tests:
type test_0_actual = Rebuild<[2, 1, 3, 3, 1, 1, 2]>;
//   ^?
type test_0_expected = [
  "🛹",
  "🛹",
  "🚲",
  "🛴",
  "🛴",
  "🛴",
  "🏄",
  "🏄",
  "🏄",
  "🛹",
  "🚲",
  "🛴",
  "🛴",
];
type test_0 = Expect<Equal<test_0_expected, test_0_actual>>;

type test_1_actual = Rebuild<[3, 3, 2, 1, 2, 1, 2]>;
//   ^?
type test_1_expected = [
  "🛹",
  "🛹",
  "🛹",
  "🚲",
  "🚲",
  "🚲",
  "🛴",
  "🛴",
  "🏄",
  "🛹",
  "🛹",
  "🚲",
  "🛴",
  "🛴",
];
type test_1 = Expect<Equal<test_1_expected, test_1_actual>>;

type test_2_actual = Rebuild<[2, 3, 3, 5, 1, 1, 2]>;
//   ^?
type test_2_expected = [
  "🛹",
  "🛹",
  "🚲",
  "🚲",
  "🚲",
  "🛴",
  "🛴",
  "🛴",
  "🏄",
  "🏄",
  "🏄",
  "🏄",
  "🏄",
  "🛹",
  "🚲",
  "🛴",
  "🛴",
];
type test_2 = Expect<Equal<test_2_expected, test_2_actual>>;
