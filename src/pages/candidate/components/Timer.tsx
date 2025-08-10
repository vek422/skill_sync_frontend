import { useEffect, useState } from "react";

export default function Timer({ end_time }: { end_time: Date }) {
  if (!end_time || isNaN(end_time.getTime())) return null;

  const [remainingTime, setRemainingTime] = useState(
    () => end_time.getTime() - Date.now()
  );

  useEffect(() => {
    const update = () => {
      setRemainingTime(end_time.getTime() - Date.now());
    };

    update();

    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [end_time]);

  const formatTime = (ms: number) => {
    const sign = ms < 0 ? "-" : "";
    const abs = Math.abs(ms);
    const totalSeconds = Math.floor(abs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const hh = hours.toString().padStart(2, "0");
    const mm = minutes.toString().padStart(2, "0");
    const ss = seconds.toString().padStart(2, "0");
    return `${sign}${hh}:${mm}:${ss}`;
  };

  return <span>{formatTime(remainingTime)}</span>;
}
