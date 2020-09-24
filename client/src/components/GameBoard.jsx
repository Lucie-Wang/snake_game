import React, { useEffect, useState, useRef } from 'react';
import { useInterval } from './useIntervals';
import {
    CANVAS_SIZE,
    SNAKE_START,
    FRUIT_START,
    SPEED,
    SCALE,
    DIRECTIONS
} from './constants';
import apple from '../img/icons_png/apple.png';
import NavBar from './Navbar';
import axios from 'axios'
import { navigate } from '@reach/router'


const GameBoard = (props) => {
    const canvasRef = useRef();
    const [snake, setSnake] = useState(SNAKE_START);
    const [fruit, setFruit] = useState(FRUIT_START);
    const [dir, setDir] = useState([0, -1]);
    const [speed, setSpeed] = useState(null);
    const [gameOver, setGameOver] = useState(false);
    const [showTop, setShowTop] = useState(true);
    const [score, setScore] = useState(0);
    const [intervalVar, setIntervalVar] = useState(null);
    const [timer, setTimer] = useState(0);
    const [startState, setStartState] = useState(false);
    const [formState, setFormState] = useState({
        playerName: '',
        score: '',
        time: ''
    });
    const [errorState, setErrorState] = useState([]);
    const [hidden, setHidden] = useState(true);
    const [displayState, setDisplayState] = useState([]);
    const [refresher, setRefresher] = useState(false);

    var timerInterval = null

    useInterval(() => gameLoop(), speed);

    const endGame = () => {
        setSpeed(null);
        setGameOver(true);
        setShowTop(false);
        onTimesUp();
        setHidden(false)
    };

    const moveSnake = ({ keyCode }) =>
        keyCode >= 37 && keyCode <= 40 && setDir(DIRECTIONS[keyCode]);

    const createFruit = () =>
        fruit.map((_a, i) => Math.floor(Math.random() * (CANVAS_SIZE[i] / SCALE)));

    const checkCollision = (piece, snk = snake) => {
        if (
            piece[0] * SCALE >= CANVAS_SIZE[0] ||
            piece[0] < 0 ||
            piece[1] * SCALE >= CANVAS_SIZE[1] ||
            piece[1] < 0
        )
            return true;

        for (const segment of snk) {
            if (piece[0] === segment[0] && piece[1] === segment[1]) return true;
        }
        return false;
    };

    const checkFruitCollision = (newSnake) => {
        if (newSnake[0][0] === fruit[0] && newSnake[0][1] === fruit[1]) {
            let newFruit = createFruit();
            while (checkCollision(newFruit, newSnake)) {
                newFruit = createFruit();
            }
            setFruit(newFruit);
            return true;
        }
        return false;
    };

    const gameLoop = () => {
        const snakeCopy = JSON.parse(JSON.stringify(snake));
        const newSnakeHead = [snakeCopy[0][0] + dir[0], snakeCopy[0][1] + dir[1]];
        snakeCopy.unshift(newSnakeHead);
        if (checkCollision(newSnakeHead)) {
            endGame()
        }
        if (!checkFruitCollision(snakeCopy) && !gameOver) {
            if (snake.length <= 12) { setScore((snake.length - 2)) }
            else if (snake.length > 12 && snake.length <= 32) {
                setScore(10 + (snake.length - 12) * 2)
                setSpeed(SPEED - 100)
            }
            else if (snake.length > 32) {
                setScore(50 + (snake.length - 32) * 3)
                setSpeed(SPEED - 200)
            }
            snakeCopy.pop();
        }
        setSnake(snakeCopy);
    };

    const startGame = () => {
        setHidden(true);
        startTimer(0);
        setSnake(SNAKE_START);
        setFruit(FRUIT_START);
        setDir([0, -1]);
        setGameOver(false);
        setSpeed(SPEED);
    };

    function onTimesUp() {
        clearInterval(timerInterval);
        setStartState(false);
    };

    useEffect(
        () => {
            if (gameOver) {
                onTimesUp();
                window.clearTimeout(intervalVar);
            } else {
                if (startState) {
                    setIntervalVar(window.setTimeout(() => timerOperations(1), 1000));
                }
            }
        },
        [timer, startState, gameOver]
    );

    const timerOperations = (arg) => {
        if (arg === 0) {
            setTimer(0);
        } else {
            setTimer(timer + 1);
        }
    };

    const startTimer = (arg) => {
        setStartState(!startState);
        timerOperations(arg);
    };


    const formatTime = (time) => {
        if (time >= 3600) {
            let hours = Math.floor(time / 3600);
            if (hours < 10) {
                hours = `0${hours}`;
            }
            let minutes = Math.floor(time / 60) - hours * 60;
            if (minutes < 10) {
                minutes = `0${minutes}`;
            }
            let seconds = time - (hours * 3600 + minutes * 60);
            if (seconds < 10) {
                seconds = `0${seconds}`;
            }
            return `${hours}:${minutes}:${seconds}`;
        } else {
            const minutes = Math.floor(time / 60);
            let seconds = time % 60;

            if (seconds < 10) {
                seconds = `0${seconds}`;
            }

            return `${minutes}:${seconds}`;
        }
    };

    useEffect(() => {
        const context = canvasRef.current.getContext("2d");
        context.setTransform(SCALE, 0, 0, SCALE, 0, 0);
        context.clearRect(0, 0, window.innerWidth, window.innerHeight);
        context.fillStyle = "green";
        snake.forEach(([x, y]) => context.fillRect(x, y, 1, 1));
        context.fillStyle = 'red';
        context.fillRect(fruit[0], fruit[1], 1, 1);
    }, [snake, fruit, gameOver]);

    const onChangeHandler = (e) => {
        setFormState({
            ...formState, [e.target.name]: e.target.value,
            score: score,
            time: timer
        })
        console.log(formState, 'onChange')
    };

    const submitForm = (e) => {
        console.log(formState, 'onsubmit')
        e.preventDefault()
        axios.post('http://localhost:8000/api/v1/create', formState)
            .then(response => {
                console.log(response)
                if (response.data.errors) {
                    const temp = []
                    for (let key in response.data.errors) {
                        temp.push(response.data.errors[key].message)
                    }
                    setErrorState([...temp])
                } else {
                    setRefresher(!refresher)
                    setHidden(!hidden)
                    navigate('/')
                    document.getElementById("myForm").reset()
                    setFormState({
                        playerName: '',
                        score: '',
                        time: ''
                    })
                }
            })
            .catch(error => console.log(error))

    }

    useEffect(() => {
        axios.get('http://localhost:8000/api/v1/findTop')
            .then(response => {
                setDisplayState(response.data)
                setShowTop(true);
            })
            .catch(error => console.log(error))
    }, [refresher])


    return (
        <div role="button" tabIndex="0" onKeyDown={e => moveSnake(e)}>
            <NavBar score={score} time={formatTime(timer)} startGame={startGame} />
            <div className='wrapper' >
                <div></div>
                <canvas
                    className='board'
                    ref={canvasRef}
                    width={`${CANVAS_SIZE[0]}px`}
                    height={`${CANVAS_SIZE[1]}px`}
                />
                <div>
                    <div className='side'>
                        <div className='display-banner'>
                            {!showTop ?
                                <div> {errorState.map((item, index) => (
                                    <p style={{ color: 'red' }} key={index}>{item}</p>
                                ))}
                                    <form onSubmit={submitForm} hidden={hidden} id='myForm'>
                                        <h3>Show off Your Score!</h3>
                                        <p>Player Name</p>
                                        <input type="text" name='playerName' onChange={onChangeHandler} />
                                        <p>Score : {score}</p>
                                        <p>Time: {formatTime(timer)}</p>

                                        <button type='submit'> Submit</button>
                                    </form></div>
                                :
                                <div>
                                    <h3>Top 5 Scores</h3>
                                    <table >
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Score</th>
                                                <th>Time</th>
                                                <th>Player</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {displayState.map((item, index) => (
                                                <tr key={index} >
                                                    <td>{index + 1}</td>
                                                    <td>{item.score} </td>
                                                    <td>{formatTime(item.time)}</td>
                                                    <td>{item.playerName} </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <div></div>
            </div>
        </div>
    );
}

export default GameBoard;