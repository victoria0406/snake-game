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
    constructor({col, row, map, ref}:{col:number, row:number, map:String[][], ref: HTMLElement|undefined}) {
      Settings.tileSize = Math.min(Math.floor(ref?.offsetHeight/(row+1)), Math.floor(ref?.offsetWidth/(col+1)));
        this.app = new PIXI.Application({ background: Settings.backgroundColor, resizeTo: ref });
        const board = new Board({col, row, map});
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
    map: String[][];

    constructor({col, row, map}:{col: number, row: number, map:String[][]}) {
        super();
        this.matrix = new Array(col);
        this.map = map;
        this._tileSize = Settings.tileSize;
        this.restart(col, row);
        this.isRunning = false;
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
      /* 자동 세팅 기능은 없음 if (!this.oriIndex) {
        this.resetColor();
        this.oriIndex = Math.floor(Math.random()*this.children.length);
        this.children[this.oriIndex].color=0xffffff;
      }
      if (!this.desIndex) {
        this.desIndex = Math.floor(Math.random()*this.children.length);
        this.children[this.desIndex].color=0xffffff;
      }*/ 
      if (this.oriIndex===undefined) {
        return 'No Orientation';
      }
      if (this.desIndex===undefined) {
        return 'No Destination';
      }
      
      this.isRunning = true;
      let {col:oriCol, row:oriRow} = this._indexToPosition(this.oriIndex);
      const {col:desCol, row:desRow} = this._indexToPosition(this.desIndex);

      let path = '';

      /*미로찾기 알고리즘*/

      return new Promise((res) => {
        const interval = setInterval(()=>{
          const newIndex = this._positionToIndex(oriCol, oriRow);
          path+=String.fromCharCode(oriCol+65)+oriRow;
          this.children[newIndex].isSnake = true;
          if (oriCol == desCol) {
            if (oriRow == desRow) {
              this.oriIndex = undefined;
              this.desIndex = undefined;
              this.isRunning = false;
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
        let index = 0;
        for (let col = 0; col < this._boardSize.col; col++) {
          if (!this.matrix[col]) this.matrix[col] = [];
          for (let row = 0; row < this._boardSize.row; row++) {
            if (this.matrix[col][row]) {
              this.matrix[col][row].reset();
            } else {
              let tile = new Tile({size: this._tileSize, x: col, y: row, isSnake:false, parentIndex:index, field: this.map[col][row]});
              if (this.map[col][row] === 'road' && !this.isRunning) {
                tile.on('pointerdown', (event) => {
                const eventIndex = event.target?.parentIndex;
                if (this.oriIndex==undefined) {
                  console.log('ori', eventIndex);
                  this.resetColor();
                  this.oriIndex = eventIndex;
                  tile.color = 0xffffff;
                }
                else if (this.desIndex==undefined) {
                  console.log('des', eventIndex);
                  this.desIndex = eventIndex;
                  tile.color = 0xffffff;
                }
              });
              }

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

  const fieldColor:{
    [key : string] : number
  } = {
    road: 0x888888,
    field: 0x81c147,
  }

class Tile extends Square {
    _isSnake:boolean;
    parentIndex:number;
    field_color;

    reset() {
      this._isSnake = false;
      this._updateColor();
    }
  
    _updateColor = () => {
      if (this._isSnake) this.color = Settings.snakeColor;
      else this.color = this.field_color;
    };
  
    get isSnake() {
      return this._isSnake;
    }
    set isSnake(v) {
      this._isSnake = v;
      this._updateColor();
    }
    constructor({size, x, y, isSnake, parentIndex, field}:{size:number, x:number, y:number, isSnake:boolean, parentIndex:number, field:String}) {
      super({ color: fieldColor[field], size }); // size가 제대로 안 넘어가는 것 같다. 
      this.field_color = fieldColor[field];
      this.x = size * x;
      this.y = size * y;
  
      this._isSnake = isSnake;
      this.parentIndex = parentIndex;
      this.eventMode='static';
    }
}