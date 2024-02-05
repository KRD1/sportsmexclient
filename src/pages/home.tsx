import CardsMini from "../components/gamecards/cards-mini";
import { MdCalendarMonth } from "react-icons/md";
import { useEffect, useState } from "react";

export default function Home() {
  const [games, setGames] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const newSocket = new WebSocket('wss://sportslineindex.com');

    newSocket.onopen = () => {
      console.log('WebSocket connected');
    }

    newSocket.onmessage = (event) => {
      const newItem = JSON.parse(event.data)?.data;
      setGames((prevGames) => {
        const indexToUpdate = prevGames.findIndex((item) => item.ctr === newItem.ctr);

        if (indexToUpdate !== -1) {
          // If the item with the same ctr is found, replace it
          prevGames[indexToUpdate] = newItem;
          return [...prevGames];
        } else {
          // If the item with the same ctr is not found, add it to the array
          return [...prevGames, newItem];
        }
      });
    };

    newSocket.onclose = (event) => {
      console.log('WebSocket closed', event);
    };

    newSocket.onerror = (event) => {
      console.error('WebSocket error', event);
      setError('WebSocket connection error');
    };

    // Cleanup WebSocket connection on component unmount
    return () => {
      if (newSocket) {
        newSocket.close();
      }
    };
  }, []); 

  return (
    <div>
      <div className="game-calender"> 
        <h5>Today</h5>
        <MdCalendarMonth height={2} width={'2em'} fontSize={25} />
      </div>
      <CardsMini games={games} />
    </div>
  )
}
