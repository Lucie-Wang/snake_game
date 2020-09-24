import React from "react";
import fire from '../img/Flat-Nintendo-Icons/PNG/Fire-Flower.png';
import ice from '../img/Flat-Nintendo-Icons/PNG/Ice-Flower.png';

const NavBar = (props) => {

    return (
        <div className="top-nav">
            <h1>Welcome!</h1>
            <div className='button'>
                    <button onClick={props.startGame}>Start Game</button></div>
            <div className='sideRight'>
            <h2><img src={fire} width="20px" />  Score: {props.score}</h2>
                    <h2><img src={ice} width="20px" />  Time: {props.time}</h2>
            </div>
        </div>
    );
}

export default NavBar;