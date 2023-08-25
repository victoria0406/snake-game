import * as PIXI from 'pixi.js';

const Settings = {
    tileSize: 15,
    snakeColor: 0x6660e7,
    backgroundColor: 0x1099bb,
    timeInterval: 180,
  };

export default class App {
    app: PIXI.Application;
    board: PIXI.Container;
    constructor({col, row, ref}:{col:number, row:number, ref: HTMLElement|undefined}) {
      Settings.tileSize = Math.min(Math.floor(ref?.offsetHeight/(row+1)), Math.floor(ref?.offsetWidth/(col+1)));
        this.app = new PIXI.Application({ background: Settings.backgroundColor, resizeTo: ref });
        const board = new Board({col, row});
        this.app.stage.addChild(board);
        board.x = this.app.screen.width / 2;
        board.y = this.app.screen.height / 2;
        board.pivot.x = board.width / 2;
        board.pivot.y = board.height / 2;
        this.board = board;
    }
}

class Board extends PIXI.Container {
    isRunning: boolean;
    _boardSize: {col:number, row:number};
    matrix: Tile[][];
    _tileSize: number;
    oriIndex: number|undefined;
    desIndex: number|undefined;

    constructor({col, row}:{col: number, row: number}) {
        super();
        this.matrix = new Array(col);
        this._tileSize = Settings.tileSize;
        this.restart(col, row);
        this.isRunning = true;
    }


    restart = (col:number, row:number) => {
        this._boardSize = {col, row};
        this._generateField();
        // this._generateStartingPositions();
        this.isRunning = true;
    }
    
    resetColor = () => {
      this.children.forEach((tile)=>{
        tile.isSnake = false;
      })
    }

    play = () => {
      if (!this.oriIndex) {
        this.resetColor();
        this.oriIndex = Math.floor(Math.random()*this.children.length);
        this.children[this.oriIndex].color=0xffffff;
      }
      if (!this.desIndex) {
        this.desIndex = Math.floor(Math.random()*this.children.length);
        this.children[this.desIndex].color=0xffffff;
      }

      let {col:oriCol, row:oriRow} = this._indexToPosition(this.oriIndex);
      const {col:desCol, row:desRow} = this._indexToPosition(this.desIndex);

      let path = '';

      return new Promise((res) => {
        const interval = setInterval(()=>{
          const newIndex = this._positionToIndex(oriCol, oriRow);
          path+=String.fromCharCode(oriCol+65)+oriRow;
          this.children[newIndex].isSnake = true;
          if (oriCol == desCol) {
            if (oriRow == desRow) {
              this.oriIndex = undefined;
              this.desIndex = undefined;
              res(path);
              clearInterval(interval);
            }
            else oriRow += Math.sign(desRow-oriRow);
          } else {
            oriCol += Math.sign(desCol-oriCol);
          }
          path+='-';
        }, Settings.timeInterval);
      })
    }

    _indexToPosition(index:number):{col:number, row:number} {
      const col = Math.floor(index/this._boardSize.row);
      const row = index % this._boardSize.row;
      return {col, row};
    }
    
    _positionToIndex(col:number, row:number):number {
      return col*this._boardSize.row+row;
    }

    _generateField = () => {
      console.log('generate');
        let index = 0;
        for (let col = 0; col < this._boardSize.col; col++) {
          if (!this.matrix[col]) this.matrix[col] = [];
          for (let row = 0; row < this._boardSize.row; row++) {
            if (this.matrix[col][row]) {
              this.matrix[col][row].reset();
            } else {
              let tile = new Tile({size: this._tileSize, x: col, y: row, isSnake:false, parentIndex:index});
              tile.on('pointerdown', (event) => {
                const eventIndex = event.target?.parentIndex;
                if (!this.oriIndex) {
                  this.resetColor();
                  this.oriIndex = eventIndex;
                  tile.color = 0xffffff;
                }
                else if (!this.desIndex) {
                  this.desIndex = eventIndex;
                  tile.color = 0xffffff;
                }
              });
              this.matrix[col][row] = tile;
              this.addChild(tile);
            }
            index += 1;
          }
        }
      };
    

}

class Square extends PIXI.Graphics {
    _color:number;
    _size:number;
  
    set size(v:number) {
      this._size = v;
      this._redraw();
    }
  
    set color(v:number) {
      this._color = v;
      this._redraw();
    }
  
    _redraw = () => {
      this.clear();
      this.beginFill(this._color);
  
      this.lineStyle(1, 0x131313, 0.5, 0.5);
      this.drawRect(0, 0, this._size, this._size);
      this.endFill();
    };
  
    constructor({ color, size }:{color:number, size: number}) {
      super();
      this._size = size;
      this._color = color;
      this._redraw();
    }
  }

class Tile extends Square {
    _isSnake:boolean;
    parentIndex:number;

    reset() {
      this._isSnake = false;
      this._updateColor();
    }
  
    _updateColor = () => {
      if (this._isSnake) this.color = Settings.snakeColor;
      else this.color = Settings.backgroundColor;
    };
  
    get isSnake() {
      return this._isSnake;
    }
    set isSnake(v) {
      this._isSnake = v;
      this._updateColor();
    }
    constructor({size, x, y, isSnake, parentIndex}:{size:number, x:number, y:number, isSnake:boolean, parentIndex:number}) {
      super({ color: Settings.backgroundColor, size }); // size가 제대로 안 넘어가는 것 같다. 
      this.x = size * x;
      this.y = size * y;
  
      this._isSnake = isSnake;
      this.parentIndex = parentIndex;
      this.eventMode='static';
    }
}