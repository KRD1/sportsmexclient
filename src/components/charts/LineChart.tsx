// LineChart.js
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {CategoryScale} from 'chart.js'; 
import { Chart } from 'chart.js/auto';
import config from '../../config';
const LineChart = (state) => {
  const [result, setResult] = useState<any[]>([]);
  const [matchData, setmatchData] = useState<number[]>([]);
  const [error, setError] = useState<string>("");
  const [labels, setLabels] = useState<number[]>([]);

  // Sample data
  const genericOptions = {
    // fill: {
    //   target:{
    //     value:50
    //   },
    //   below:'rgb(255,0,0))',
    //   above:'rgb(192,75,75)'
    // },
    responsive: true,
    maintainAspectRatio: false, // Set to false for responsiveness
    scales: {
        x:{
          border:{dash: [4, 4]},
            ticks: {
              autoSkip: false,
                callback: function(val, index) {
                  if(index===36||index===72||index===108||index===144 ||index===180|| index===216||index===252||index===288)
                  {
                    if(index===36||index===108||index===180||index===252)
                    {
                  return getQuarter(index);
                    }
                    else{
                      return ''
                    }
                  }
                },
                
              },
              grid: {
                tickBorderDash: [2, 3],
                tickLength: 10,
                color:(ctx)=>{
                  return [1,3,5].includes(ctx.index)?'rgb(75, 192, 192)':undefined;
                }
            },
        },
        y: {
            beginAtZero: true,
          border:{dash: [4, 4]},
            position: 'right',
            max:100,
            stepSize: 10,
            ticks:{
            stepSize: 49,
            autoSkip: false,

            },
            grid: {
              tickBorderDash: [2, 3],
            }
        }
    },
    plugins:{
      legend:{
        display:false
      },
      tooltip:{
        callbacks:{
          title:function(context){
            return "Win Probability"
          }
        }
      }
    },
    interaction: {
      intersect: false
    },
    radius: 0,
  };
  
Chart.register(CategoryScale);

function getQuarter(minute:number) {
  let result;

  switch (minute) {
    case 36:
      result = '1st';
      break;
    case 108:
      result = '2nd';
      break;
    case 180:
      result = '3rd';
      break;
      case 252:
      result = '4th';
      break;
    default:
      result = '5th';
  }
  return result
}
function generateTimestamps(durationInMinutes:number, intervalInSeconds:number) {
  const timestamps = [];
  const totalSeconds = durationInMinutes * 60;

  for (let seconds = 0; seconds < totalSeconds; seconds += intervalInSeconds) {
      timestamps.push(seconds);
  }

  return timestamps;
}

  const skipped = (ctx, value) => ctx.p0.skip || ctx.p1.skip ? value : undefined;
const down = (ctx, value) => {
  return (ctx.p0.parsed.y <=50 && ctx.p1.parsed.y<=50) ? value : undefined};

  function getObjectBySeconds(targetSeconds:number, array) {
    for (const element of array) {
      if (element.seconds_elapsed >= targetSeconds) {
          return element;
      }
  }
  return null;
}
async function processElementsAsync(lbl, result) {
  const valArray = [];

  for (const element of lbl) {
      const val = await getObjectBySeconds(element, result);
      if(val===null)
      {
        break;
      }
      valArray.push((val.home_team_win_prct*100).toFixed(2));
  }

  setmatchData(valArray);
}
useEffect(() => {
  const fetchData = async () => {
    try {

      processElementsAsync(labels, result)
          .then(() => {
          })
          .catch(error => {
              console.error('Error:', error);
          });
    } catch (error) {
      console.log(error);
    }
  };

  fetchData();

  const newSocket = new WebSocket('wss://sportslineindex.com');

  newSocket.onopen = () => {
    console.log('WebSocket connected');
  }

  newSocket.onmessage = (event) => {
    const newItem = JSON.parse(event.data)?.data;
    if(newItem.ctr===state.ctr)
    {
      setResult((prevGames) => {
          return [...prevGames, newItem];
      });
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
}, [result]);
  useEffect(() => {
    const lbl=generateTimestamps(48,10)
    setLabels(lbl)
    const fetchData = async () => {
      try {
        const response = await fetch(config.restApiUrl+'data?ctr='+state.ctr);
        const result = await response.json();
      setResult(result)
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);
  
  const data = {
    labels: labels
    ,
    datasets: [{
        label: '    ',
        data: matchData,
        borderColor: 'rgb(75, 192, 192)',
        segment: {
          borderColor: ctx => skipped(ctx, 'rgb(0,0,0,0.2)') || down(ctx, 'rgb(192,75,75)'),
          borderDash: ctx => skipped(ctx, [6, 6]),
        },
        spanGaps: false,
      }],
  };

  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: 'auto' }}>
    <Line height={300} width={'100%'} data={data} options={genericOptions} />
  </div>
  );
};

export default LineChart;
