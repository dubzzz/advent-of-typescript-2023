import { Expect, Equal } from "type-testing";

// Subject:
// type DayCounter = unknown;

// My solution:
type TupleN<N, R extends unknown[] = []> = N extends R["length"]
  ? R
  : TupleN<N, [unknown, ...R]>;
type DayCounterTuple<
  TFrom extends unknown[],
  TTo extends unknown[],
> = TTo["length"] extends TFrom["length"]
  ? TTo["length"]
  : TFrom["length"] | DayCounterTuple<[...TFrom, unknown], TTo>;
type DayCounter<TFrom, TTo> = DayCounterTuple<TupleN<TFrom>, TupleN<TTo>>;

// Tests:
type TwelveDaysOfChristmas = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
type test_0_actual = DayCounter<1, 12>;
//   ^?
type test_0_expected = TwelveDaysOfChristmas;
type test_0 = Expect<Equal<test_0_expected, test_0_actual>>;

type DaysUntilChristmas =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25;
type test_1_actual = DayCounter<1, 25>;
//   ^?
type test_1_expected = DaysUntilChristmas;
type test_1 = Expect<Equal<test_1_expected, test_1_actual>>;
