import { useState } from "react";

export const useVisualMode = value => {
  const [mode, setMode] = useState(value);
  const [history, setHistory] = useState([value]);

  const transition = function (mode, replace) {
    setMode(mode);
    if (replace) {
      setHistory(prev => [mode, ...(prev.slice(1))]);
    } else {
      setHistory(prev => [mode, ...prev]);
    }
  }

  const back = function () {
    if (history.length > 1) {
      setMode(history[1]);
      setHistory(prev => prev.slice(1));
    }
  }

  return {
    mode,
    transition,
    back
  };
}