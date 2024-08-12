import { useEffect, useRef } from "react";

type Callback = () => void;

export function useInterval(callback: Callback, delay: number) {
  const savedCallback = useRef<Callback>();

  // Remember the latest callback function
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval
  useEffect(() => {
    function tick() {
      if (savedCallback.current) {
        savedCallback.current();
      }
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
