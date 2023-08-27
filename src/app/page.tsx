'use client'

import SnakeGameScreen from '@/components/snakeGameScreen';
import Image from 'next/image';
import { useState } from 'react';


const gameMap = [...Array(26).keys()].map((e, i)=>{
    if (i%5) {
      return [...Array(21).keys()].map((e, index)=>{
        return (index%5) ? 'field' : 'road';
      })
    } else {
      return [...Array(21)].map(() => ('road'));
    }
});

export default function Home() {
  const [colSize, setColSize] = useState(26);
  const [rowSize, setRowSize] = useState(21);
  const [selectedCol, setSelectedCol] = useState(26);
  const [selectedRow, setSelectedRow] = useState(21);
  const [isPlay, setIsPlay] = useState(false);
  const [path, setPath] = useState('No Path');

  const play = () => {
    setIsPlay(true);
    setSelectedCol(colSize);
    setSelectedRow(rowSize);
  }

  return (
    <main className='flex'>
      <div className='h-screen w-1/6 p-4 bg-slate-800 flex flex-col justify-between'>
        <div>
          <h1 className='text-xl font-bold'>Inputs</h1>
          <hr className='my-4'/>
          {/*
          <label
            for="width-range"
            className="block my-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Column Size: {colSize}
          </label>
          <input
            id="width-range"
            type="range"
            min={10}
            max={50}
            value={colSize}
            onChange={({target:{value}})=>{setColSize(Number(value))}}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
          <label
            for="height-range"
            className="block my-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Row Size: {rowSize}
          </label>
          <input
            id="height-range"
            type="range"
            min={10}
            max={50}
            value={rowSize}
            onChange={({target:{value}})=>{setRowSize(Number(value))}}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
  */}
        </div>
        <div>
          <h1 className='text-xl font-bold'>Output</h1>
          <hr className='my-4'/>
          <div>Path: {path}</div>
        </div>
        <button
          className='w-full border my-8 rounded disable:cursor-not-allowed'
          onClick={play}
          disabled={isPlay}
        >
          Play
        </button>
      </div>
      <SnakeGameScreen col={selectedCol} row={selectedRow} isPlay={isPlay} setIsPlay={setIsPlay} setPath={setPath} map = {gameMap}/>
    </main>
  )
}
