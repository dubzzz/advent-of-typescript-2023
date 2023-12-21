import { Expect, Equal } from "type-testing";

// Subject:
type TicTacToeChip = "❌" | "⭕";
type TicTacToeEndState = "❌ Won" | "⭕ Won" | "Draw";
type TicTacToeState = TicTacToeChip | TicTacToeEndState;
type TicTacToeEmptyCell = "  ";
type TicTacToeCell = TicTacToeChip | TicTacToeEmptyCell;
type TicTacToeYPositions = "top" | "middle" | "bottom";
type TicTacToeXPositions = "left" | "center" | "right";
type TicTacToePositions = `${TicTacToeYPositions}-${TicTacToeXPositions}`;
type TicTactToeBoard = TicTacToeCell[][];
type TicTacToeGame = {
  board: TicTactToeBoard;
  state: TicTacToeState;
};
type EmptyBoard = [["  ", "  ", "  "], ["  ", "  ", "  "], ["  ", "  ", "  "]];
type NewGame = {
  board: EmptyBoard;
  state: "❌";
};
// type TicTacToe = unknown;

// My solution:
type NextPlayer<TCurrentPlayer extends TicTacToeChip> = Exclude<
  TicTacToeChip,
  TCurrentPlayer
>;
type XToLocation<TPositionX extends TicTacToeXPositions> = {
  left: 0;
  center: 1;
  right: 2;
}[TPositionX];
type YToLocation<TPositionY extends TicTacToeYPositions> = {
  top: 0;
  middle: 1;
  bottom: 2;
}[TPositionY];
type Edit1D<
  TArray extends unknown[],
  TX,
  TValue extends unknown,
  TNewArray extends unknown[] = [],
> = TArray extends [infer TArrayLine, ...infer TArrayRest extends unknown[]]
  ? TNewArray["length"] extends TX
    ? [...TNewArray, TValue, ...TArrayRest]
    : Edit1D<TArrayRest, TX, TValue, [...TNewArray, TArrayLine]>
  : TNewArray;
type Edit2D<
  TGrid extends unknown[][],
  TY,
  TX,
  TValue extends unknown,
  TNewGrid extends unknown[][] = [],
> = TGrid extends [
  infer TGridLine extends unknown[],
  ...infer TGridRest extends unknown[][],
]
  ? TNewGrid["length"] extends TY
    ? [...TNewGrid, Edit1D<TGridLine, TX, TValue>, ...TGridRest]
    : Edit2D<TGridRest, TY, TX, TValue, [...TNewGrid, TGridLine]>
  : TNewGrid;
type NextBoard<
  TBoard extends TicTactToeBoard,
  TCurrentPlayer extends TicTacToeChip,
  TPositionX extends TicTacToeXPositions,
  TPositionY extends TicTacToeYPositions,
> = Edit2D<
  TBoard,
  YToLocation<TPositionY>,
  XToLocation<TPositionX>,
  TCurrentPlayer
>;
type CheckWinPlayer<
  TBoard extends TicTactToeBoard,
  TPlayer extends TicTacToeChip,
> = TBoard[0][number] extends TPlayer
  ? `${TPlayer} Won`
  : TBoard[1][number] extends TPlayer
    ? `${TPlayer} Won`
    : TBoard[2][number] extends TPlayer
      ? `${TPlayer} Won`
      : TBoard[number][0] extends TPlayer
        ? `${TPlayer} Won`
        : TBoard[number][1] extends TPlayer
          ? `${TPlayer} Won`
          : TBoard[number][2] extends TPlayer
            ? `${TPlayer} Won`
            : TBoard[0][0] | TBoard[1][1] | TBoard[2][2] extends TPlayer
              ? `${TPlayer} Won`
              : TBoard[2][0] | TBoard[1][1] | TBoard[0][2] extends TPlayer
                ? `${TPlayer} Won`
                : never;
type CheckWin<TBoard extends TicTactToeBoard> =
  | CheckWinPlayer<TBoard, "❌">
  | CheckWinPlayer<TBoard, "⭕">;
type CheckDrawIfNoWin<TBoard extends TicTactToeBoard> =
  TBoard[number][number] extends TicTacToeChip? "Draw":never;
type CheckState<TBoard extends TicTactToeBoard> =
  CheckWin<TBoard> extends never
    ? CheckDrawIfNoWin<TBoard>
    : CheckWin<TBoard>;
type AlterGameWithState<TGame extends TicTacToeGame> = CheckState<
  TGame["board"]
> extends never
  ? TGame
  : { board: TGame["board"]; state: CheckState<TGame["board"]> };
type TicTacToe<
  TGame extends TicTacToeGame,
  TPosition extends TicTacToePositions,
> = TPosition extends `${infer TPositionY extends
  TicTacToeYPositions}-${infer TPositionX extends TicTacToeXPositions}`
  ? TGame["state"] extends TicTacToeChip
    ? AlterGameWithState<{
        board: NextBoard<
          TGame["board"],
          TGame["state"],
          TPositionX,
          TPositionY
        >;
        state: NextPlayer<TGame["state"]>;
      }>
    : TGame
  : TGame;

// Tests:
type test_move1_actual = TicTacToe<NewGame, "top-center">;
//   ^?
type test_move1_expected = {
  board: [["  ", "❌", "  "], ["  ", "  ", "  "], ["  ", "  ", "  "]];
  state: "⭕";
};
type test_move1 = Expect<Equal<test_move1_actual, test_move1_expected>>;

type test_move2_actual = TicTacToe<test_move1_actual, "top-left">;
//   ^?
type test_move2_expected = {
  board: [["⭕", "❌", "  "], ["  ", "  ", "  "], ["  ", "  ", "  "]];
  state: "❌";
};
type test_move2 = Expect<Equal<test_move2_actual, test_move2_expected>>;

type test_move3_actual = TicTacToe<test_move2_actual, "middle-center">;
//   ^?
type test_move3_expected = {
  board: [["⭕", "❌", "  "], ["  ", "❌", "  "], ["  ", "  ", "  "]];
  state: "⭕";
};
type test_move3 = Expect<Equal<test_move3_actual, test_move3_expected>>;

type test_move4_actual = TicTacToe<test_move3_actual, "bottom-left">;
//   ^?
type test_move4_expected = {
  board: [["⭕", "❌", "  "], ["  ", "❌", "  "], ["⭕", "  ", "  "]];
  state: "❌";
};
type test_move4 = Expect<Equal<test_move4_actual, test_move4_expected>>;

type test_x_win_actual = TicTacToe<test_move4_actual, "bottom-center">;
//   ^?
type test_x_win_expected = {
  board: [["⭕", "❌", "  "], ["  ", "❌", "  "], ["⭕", "❌", "  "]];
  state: "❌ Won";
};
type PPP = test_x_win_actual["board"][number][number] extends " "
  ? true
  : false;
type PPP2 = CheckDrawIfNoWin<test_x_win_actual["board"]>;
type test_x_win = Expect<Equal<test_x_win_actual, test_x_win_expected>>;

type type_move5_actual = TicTacToe<test_move4_actual, "bottom-right">;
//   ^?
type type_move5_expected = {
  board: [["⭕", "❌", "  "], ["  ", "❌", "  "], ["⭕", "  ", "❌"]];
  state: "⭕";
};
type test_move5 = Expect<Equal<type_move5_actual, type_move5_expected>>;

type test_o_win_actual = TicTacToe<type_move5_actual, "middle-left">;
//   ^?
type test_o_win_expected = {
  board: [["⭕", "❌", "  "], ["⭕", "❌", "  "], ["⭕", "  ", "❌"]];
  state: "⭕ Won";
};

// invalid move don't change the board and state
type test_invalid_actual = TicTacToe<test_move1_actual, "top-center">;
//   ^?
type test_invalid_expected = {
  board: [["  ", "❌", "  "], ["  ", "  ", "  "], ["  ", "  ", "  "]];
  state: "⭕";
};
type test_invalid = Expect<Equal<test_invalid_actual, test_invalid_expected>>;

type test_before_draw = {
  board: [["⭕", "❌", "⭕"], ["⭕", "❌", "❌"], ["❌", "⭕", "  "]];
  state: "⭕";
};
type test_draw_actual = TicTacToe<test_before_draw, "bottom-right">;
//   ^?
type test_draw_expected = {
  board: [["⭕", "❌", "⭕"], ["⭕", "❌", "❌"], ["❌", "⭕", "⭕"]];
  state: "Draw";
};
type test_draw = Expect<Equal<test_draw_actual, test_draw_expected>>;
