import React from "react";
import GameDetails from "./gameDetails";
import { Col, Row } from "reactstrap";

interface GameDetailsProps { }

const Index: React.FC<GameDetailsProps> = () => {
    return (
        <Row >
            <Col >
            <GameDetails />
            </Col>
        </Row>
    );
}

export default Index;

