import { Expect, Equal } from "type-testing";

// Subject:
// type SantasFavoriteCookies = unknown;

// My solution:
type SantasFavoriteCookies = "ginger-bread" | "chocolate-chip";

// Tests:
type test_0_actual = SantasFavoriteCookies;
//   ^?
type test_0_expected = "ginger-bread" | "chocolate-chip";
type test_0 = Expect<Equal<test_0_actual, test_0_expected>>;
