import App from "@/lib/snakeGame";
import { useEffect, useRef, useState } from "react";

export default function SnakeGameScreen({col, row, isPlay, setIsPlay, setPath}:{col: number, row:number,isPlay:boolean, setIsPlay:Function, setPath:Function}) {
    const [app, setApp] = useState();
    const appRef = useRef<HTMLElement>(null);
    useEffect(()=>{
        const initApp = new App({col, row, ref:appRef.current});
        appRef?.current?.appendChild(initApp.app.view);
        initApp.app.start();
        setApp(initApp);
    }, []);
    useEffect(()=>{
        if (app) {
            app.board.restart(col, row);
        }
    },[col, row]);
    useEffect(()=>{
        const play = async () => {
            setPath('Playing...')
            const text = await app.board.play();
            setPath(text);
            setIsPlay(false);
        }
        if (isPlay && app) {
            play();
        }
        isPlay = false;
    }, [isPlay])
    return (
        <div
            className="h-screen w-5/6" 
            ref={appRef}></div>
    )
}