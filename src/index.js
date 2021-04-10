import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props)
{
  return (
    <button 
      className="square" 
      onClick={props.onClick}
      //{/*
      // why we don't need to call onClick function using arrow syntax 
      // and why we don't use parenthesis in onClick, here in function component
      // like we did in class compnent?
      // Why using multiline comment gives error here?
      //*/}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component
{
  renderSquare(i)
  {
    return (
      <Square 
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      //{/*why we need to call function using arrow syntax here*/}
      />
    );
  }

  render()
  {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component
{
  constructor(props)
  {
    super(props);//why we need to pass 'props' in super?
    this.state = {
      history: [
        {squares: Array(9).fill(null)}, //creates array of 9 elements, each is null
      ],
      xIsNext: true,
      stepNumber: 0,
    };
  }

  handleClick(i)
  {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length-1];
    const squares = current.squares.slice();
    //used slice to create a separate(deep copy) copy otherwise changes made to original one also.
    if(calculateWinner(squares) || squares[i])
    {//returns, if someone has won the game or if a Square is already filled(not null)
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    });
  }

  jumpTo(step)
  {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render()
  {
    const history = this.state.history;
    const current = history[this.state.stepNumber];

    const moves = history.map((squares, move) => {
      const desc = move ? "Go to move #" + move : "Go to game start";
      return(
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    const winner = calculateWinner(current.squares);
    let status;
    if(winner)
    {
      status = "Winner: " + winner;
    }
    else
    {
      status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares)//this is not a component(you can also see it by naming convention)
{// returns null or 'X', or 'O'
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for(let i = 0; i < lines.length; i++)
  {
    const [a, b, c] = lines[i];
    if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c])//if squares[a]=>null then it equates to false
    {
      return squares[a];
    }
  }
  return null;
}