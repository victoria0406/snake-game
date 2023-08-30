import App from "@/lib/snakeGame";
import { useEffect, useRef, useState } from "react";

export default function SnakeGameScreen({col, row, isPlay, setIsPlay, setPath, map, setOri, setDes}:{col: number, row:number,isPlay:boolean, setIsPlay:Function, setPath:Function, map:String[][], setOri:Function,setDes:Function}) {
    const [app, setApp] = useState<App>();
    const appRef = useRef<HTMLDivElement>(null);
    useEffect(()=>{
        const initApp = new App({col, row, map, ref:appRef.current, setOri, setDes});
        appRef?.current?.appendChild(initApp.app.view);
        initApp.app.start();
        setApp(initApp);
    }, []);
    useEffect(()=>{
        const play = async () => {
            setPath('Playing...')
            const text = await app?.board.play();
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