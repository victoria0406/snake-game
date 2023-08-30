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
  const [ori, setOri] = useState("Not Selected");
  const [des, setDes] = useState("Not Selected");

  const play = () => {
    setIsPlay(true);
    setSelectedCol(colSize);
    setSelectedRow(rowSize);
  }

  return (
    <main className='flex'>
      <div className='h-screen w-1/6 p-4 bg-slate-800 flex flex-col justify-between'>
        <div className='h-[47vh]'>
          <h1 className='text-xl font-bold'>Inputs</h1>
          <hr className='my-4'/>
          <div>Orientation: {ori}</div>
          <div>Destination: {des}</div>
        </div>
        <div className='h-[47vh]'>
          <h1 className='text-xl font-bold'>Output</h1>
          <hr className='my-4'/>
          <div>Path: {path}</div>
        </div>
        <button
          className='w-full border my-8 rounded disable:cursor-not-allowed h-[6vh]'
          onClick={play}
          disabled={isPlay}
        >
          Play
        </button>
      </div>
      <SnakeGameScreen
        col={selectedCol}
        row={selectedRow}
        isPlay={isPlay}
        setIsPlay={setIsPlay}
        setPath={setPath}
        map = {gameMap}
        setOri = {setOri}
        setDes = {setDes}
      />
    </main>
  )
}
