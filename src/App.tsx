import "./scss/App.css";
import circle from "./images/circle.png";
import cross from "./images/cross.png";
import { useRef, useState } from "react";

type States = "none" | "circle" | "cross";

type placeType = {
  id: string;
  isClicked: boolean;
  state: States;
};

function calcRowAndColumn(id: string) {
  let num = +id; // 8
  const rowAndColumn = [1, 0];

  while (true) {
    if (num > 3) {
      rowAndColumn[0]++;
      num = num - 3;
    } else {
      rowAndColumn[1] = num;
      return rowAndColumn;
    }
  }
}

function calcImage(state: "circle" | "cross") {
  switch (state) {
    case "circle": {
      return circle;
    }
    case "cross": {
      return cross;
    }
  }
}

const WIN_CONDITIONS = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [1, 5, 9],
  [7, 5, 3],
  [1, 4, 7],
  [2, 5, 8],
  [3, 6, 9],
];

enum TurnEnum {
  Cross = 0,
  Tick = 1,
}

function turnEnumToState(turn: TurnEnum): States {
  console.log(turn);
  return turn === TurnEnum.Cross ? "cross" : "circle";
}

function checkWin(field: placeType[][], turn: number) {
  for (const condition of WIN_CONDITIONS) {
    const [row1, column1] = calcRowAndColumn(condition[0].toString());
    const [row2, column2] = calcRowAndColumn(condition[1].toString());
    const [row3, column3] = calcRowAndColumn(condition[2].toString());
    if (
      field[row1 - 1][column1 - 1].state !== "none" &&
      field[row1 - 1][column1 - 1].state ===
        field[row2 - 1][column2 - 1].state &&
      field[row2 - 1][column2 - 1].state ===
        field[row3 - 1][column3 - 1].state &&
      field[row1 - 1][column1 - 1].state === field[row1 - 1][column1 - 1].state
    ) {
      return field[row1 - 1][column1 - 1].state;
    }
  }
  if (turn === 9) return "tie";
  return "none";
}

function App() {
  const DEFAULT_FIELD: placeType[][] = [
    [
      { id: "1", isClicked: false, state: "none" },
      { id: "2", isClicked: false, state: "none" },
      { id: "3", isClicked: false, state: "none" },
    ],
    [
      { id: "4", isClicked: false, state: "none" },
      { id: "5", isClicked: false, state: "none" },
      { id: "6", isClicked: false, state: "none" },
    ],
    [
      { id: "7", isClicked: false, state: "none" },
      { id: "8", isClicked: false, state: "none" },
      { id: "9", isClicked: false, state: "none" },
    ],
  ];
  const [field, setField] = useState(DEFAULT_FIELD);
  const [turn, setTurn] = useState<TurnEnum>(TurnEnum.Cross);
  const [winner, setWinner] = useState<States | "tie">("none");
  const numberOfTurns = useRef(0);

  let key = 0;

  function gamePlaceClickHandler(event: unknown) {
    const [row, column] = calcRowAndColumn(event.target.id);

    setField((prevState) => {
      const tempField = [...prevState];
      tempField[row - 1][column - 1].isClicked = true;
      if (tempField[row - 1][column - 1].state === "none") {
        tempField[row - 1][column - 1].state = turnEnumToState(turn);
        setTurn((prevState) => {
          return prevState === 1 ? 0 : 1;
        });
        numberOfTurns.current++;
      }
      return tempField;
    });

    setTimeout(() => {
      const winner = checkWin(field, numberOfTurns.current);
      console.log(winner);
      winner !== "none" && setWinner(winner);
    }, 50);
  }

  function resetGameHandler() {
    setTurn(TurnEnum.Cross);
    setWinner("none");
    setField(DEFAULT_FIELD);
    numberOfTurns.current = 0;
  }

  return (
    <div className="mainDiv">
      <h3>TICK TACK TOE GAME</h3>
      {winner === "tie" ? (
        <p>Tie! Both sides were good</p>
      ) : winner !== "none" ? (
        <p>{winner.toUpperCase()} WON! CONGRATULATIONS!</p>
      ) : (
        <p>Game in progress</p>
      )}
      {field.map((row) => {
        return (
          <div className="row" key={++key}>
            {row.map((place) => {
              return (
                <div
                  key={place.id}
                  id={place.id}
                  onClick={winner !== "none" ? () => {} : gamePlaceClickHandler}
                  className="place"
                >
                  {place.state !== "none" && (
                    <img
                      className="img"
                      id={place.id}
                      src={calcImage(place.state)}
                    />
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
      {winner !== "none" ? (
        <button className="resetButton" onClick={resetGameHandler}>
          Reset game
        </button>
      ) : (
        <button className="resetButton" disabled={true}>
          Game in progress
        </button>
      )}
    </div>
  );
}

export default App;
