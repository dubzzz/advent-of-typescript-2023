import { Expect, Equal } from "type-testing";

// Subject:
// type BoxToys = unknown;

// My solution:
type BoxToys<T, N, R extends T[] = []> = N extends R["length"]
  ? R
  : BoxToys<T, N, [T, ...R]>;

// Tests:
type test_doll_actual = BoxToys<"doll", 1>;
//   ^?
type test_doll_expected = ["doll"];
type test_doll = Expect<Equal<test_doll_expected, test_doll_actual>>;

type test_nutcracker_actual = BoxToys<"nutcracker", 3 | 4>;
//   ^?
type test_nutcracker_expected =
  | ["nutcracker", "nutcracker", "nutcracker"]
  | ["nutcracker", "nutcracker", "nutcracker", "nutcracker"];
type test_nutcracker = Expect<
  Equal<test_nutcracker_expected, test_nutcracker_actual>
>;
