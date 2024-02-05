import React from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, Col, Row } from "reactstrap";
import moment from  'moment-timezone'
import { isNil } from 'lodash';
import {Game} from '../../types/interfaces'
import config from "../../config";
import uparrow from '../../assets/images/uparrow.png'
import downarrow from '../../assets/images/downarrow.png'

interface CardBoxProps {
  games: Game[];
}

const CardBox: React.FC<CardBoxProps> = ({ games }) => {
  return (
    <React.Fragment>
      {games.map((game, key) => (
        <Col md="6"  lg="4"key={key}>
          <Link to='gamedetails' state={game}>
            <Card>
              <CardBody>
                <Row>
                  <Col xs="7">
                    {game.game_status==="Live"&&<span className="red-dot"></span> }
                    <h5>{isNil(game.game_status)?moment(game.gamedate).tz('America/New_York').fromNow():game.game_status}</h5>
                    <div>
                    <div className='client-images'>
                        <img src={config.teamLogoUrl+game.away_team.replace(/ /g, '-')+"&width=320&height=320"} alt={game.at_abbrev}  className="mx-2"/>
                        <span>
                          <div className="game-title text-truncate w-80">{game.away_team}</div>
                          <span>Away</span>
                        </span>
                      </div>
                      <div className='client-images'>
                        <img src={config.teamLogoUrl+game.home_team.replace(/ /g, '-')+"&width=320&height=320"} alt={game.ht_abbrev}  className="mx-2" />
                        <span>
                          <div className="game-title text-truncate w-80">{game.home_team}</div>
                          <span >Home</span>
                        </span>
                      </div>
                     
                    </div>
                  </Col>
                  <Col xs="2">
                    <h5 className="text-nowrap">Total</h5>
                    <Col className="card-row h-100">
                      <div>{game.at_score??0}</div>
                      <div>{game.ht_score??0}</div>
                    </Col>
                  </Col>
                  <Col xs="3" className="d-grid text-center">
                    <h5>Win %</h5>
                    <Col className="card-win h-100">
                      <div className={ game.probability_pct >= 50 ? 'green-text win-stat' : 'red-text win-stat'}>
                        {game.probability_pct >= 50 ? <div className="arrow-img">  <img  className =' position-absolute 'src={uparrow} /></div>
                          : ''}
                        {`${game?.probability_pct.toFixed(0)}% `}
                        {game.probability_pct >= 50 ?''
                          : <span className="arrow-img pb-2"> <img className=" position-absolute " src={downarrow} /></span>}
                      </div>
                      <span>chances</span>
                    </Col>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Link>
        </Col>
      ))}
    </React.Fragment>
  );
};

export default CardBox;
