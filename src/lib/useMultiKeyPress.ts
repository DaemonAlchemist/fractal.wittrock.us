import { useEffect, useState } from "react";

export default function useMultiKeyPress():string[] {
    const [keysPressed, setKeyPressed] = useState<string[]>([]);
  
    function downHandler({ key }:KeyboardEvent) {
        setKeyPressed(k => [...k.filter(v => v !== key), key]);
    }
  
    const upHandler = ({ key }:KeyboardEvent) => {
        setKeyPressed(k => k.filter(v => v !== key));
    };
  
    useEffect(() => {
      window.addEventListener("keydown", downHandler);
      window.addEventListener("keyup", upHandler);
      return () => {
        window.removeEventListener("keydown", downHandler);
        window.removeEventListener("keyup", upHandler);
      };
    }, []); // Empty array ensures that effect is only run on mount and unmount
  
    console.log(keysPressed);
    return keysPressed;
  }
  