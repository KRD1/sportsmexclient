import React, { useEffect, useState } from 'react'
import LineChart from '../../components/charts/LineChart'
import { Card, Row } from 'reactstrap'
import { useLocation } from 'react-router';
import { Slider } from '@mui/material'; // Import Slider from Material-UI
import config from '../../config';
import { isNil } from 'lodash';
import moment from 'moment';


export default function GameDetails() {
    const [game, setGame] = useState<GameType | null>(null);
    const[error,setError]=useState<string>("")
    const location = useLocation();
    const [sliderValue, setSliderValue] = useState<number>(1); // State to manage Slider value

    const handleSliderChange = (event: Event, newValue: number | number[]) => {
        setSliderValue(newValue as number);
    };


    useEffect(() => {
        location.state && setGame(location.state as GameType);

        const newSocket = new WebSocket('wss://sportslineindex.com');

        newSocket.onopen = () => {
          console.log('WebSocket connected');
        }
    
        newSocket.onmessage = (event) => {
          const newItem = JSON.parse(event.data)?.data;
          if(newItem.ctr===location.state.ctr)
          {
          setGame(newItem)
          }
       
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
        <div className="game-details-container">
            <Card className="w-100 m-auto">
                <div className="d-flex  align-items-center justify-content-between w-100 game-teams gap-4">
                <Row className="justify-content-center align-items-center text-center  flex-column">
                        <img className='avatar-md' src={config.teamLogoUrl+game?.away_team.replace(/ /g, '-')+"&width=320&height=320"} alt="away_team_logo" />
                        <span className='min-content fw-bold'>{game?.away_team}</span>
                        <span>Away</span>
                    </Row>
                    <span className="score">{game?.at_score ?? 0}</span>
                    <div className="text-center">
                    {/* {game.game_status==="Live"&&<span className="red-dot"></span> } */}
                    <span>{isNil(game?.game_status)?moment(game?.gamedate).tz('America/New_York').fromNow():game.game_status}</span>
                        {game?.game_status==="Live"&&<span className="live">Q{game?.period} 
                            {game?.gametime}</span>}
                    </div>
                    <span className="score">{game?.ht_score ?? 0}</span>
                   
                    <Row className="justify-content-center align-items-center text-center flex-column">
                        <img className="avatar-md" src={config.teamLogoUrl+game?.home_team.replace(/ /g, '-')+"&width=320&height=320"} alt="home_team_logo" />
                        <span className='min-content fw-bold'>{game?.home_team}</span>
                        <span>Home</span>
                    </Row>
                </div>
                <hr className="mb-4" />

                <h5 className="text-center">{game?.probability_pct.toFixed(0)}% chances {game?.home_team} Wins! </h5>
                <hr className="mb-4" />

                <div style={{ margin: ' 12px 24px' }}>
                    <Slider
                        value={sliderValue}
                        onChange={handleSliderChange}
                        min={1}
                        max={125}
                        step={1}
                        marks={[
                            { value: 1, label: '1x' },
                            { value: 25, label: '25x' },
                            { value: 50, label: '50x' },
                            { value: 75, label: '75x' },
                            { value: 100, label: '100x' },
                            { value: 125, label: '125x' },
                        ]}
                    />
                </div>
                <div className="justify-content-between win-probality mb-4">
                    <span>Win Probability</span> <span>{game?.probability_pct.toFixed(0)}%</span>
                </div>

                <div className="d-flex flex-column">
                    <div className="d-flex align-items-center mb-4">
                        <img className="avatar-sm" src={config.teamLogoUrl+game?.home_team.replace(/ /g, '-')+"&width=320&height=320"} alt="home_team_logo" />
                        <span className="fw-bold">{game?.home_team}</span>
                    </div>
                    <LineChart  ctr={location.state?.ctr} />
                   
                </div>
            </Card>
        </div>
    )
}
interface GameType {
    home_teamlogo: string;
    home_team: string;
    at_score: number;
    completed: number;
    ht_score: number;
    away_teamlogo: string;
    away_team: string;
    probability_pct: number;
    ctr:string;
    game_status:string;
    gamedate: string;
    period:number;
    gametime:string;

}
