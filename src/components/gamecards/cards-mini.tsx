import React from "react"
import {  Row } from "reactstrap"

//Import Components
import CardBox from "./card-box"

const CardsMini = ({games}:any) => {
  return (
    <React.Fragment>
          <div className="currency-price">
            <Row>
              <CardBox games={games} />
            </Row>
          </div>
    </React.Fragment>
  )
}

export default CardsMini
