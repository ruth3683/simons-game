import React, { useEffect, useState } from 'react';
import axios from 'axios';
import GamePad from './gamePad';
import '../styles/gameControl.css';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';

function GameControl(){
    const URL: string = 'http://localhost:2400';
    const colors: string[] = [
        'green', 'red', 'yellow', 'blue'
    ]
    const [score, setScore] = useState<number>(0);
    const [randomColors, setRandomColors] = useState<string[]>([]);
    const [indexInStep, setIndexInStep] = useState<number>(0);
    const [disabled, setDisabled] = useState<boolean>(true);
    const [playerName, setPlayerName] = useState<string>('');
    const [isLogin, setIsLogin] = useState<boolean>(false);
    const [gameId, setGameId] = useState<string>();
    const [maxScore, setMaxScore] = useState<number>();

    const createGame = async () => {
        const { data } = await axios.post(`${URL}/createGame`, { 'player_name': playerName });
        setGameId(data.id);
    }

    const getMaxScore = async () => {
        const {data} = await axios.get(`${URL}/playerMaxScore/${playerName}`);
        setMaxScore(data.max_score);
    }

    const randomColor = () => {
        const randomIndex: number = Math.floor(Math.random() * colors.length);
        const newColor: string = colors[randomIndex];
        setRandomColors([...randomColors, newColor]);
    }

    const startGame = async () => {
        await createGame();
        randomColor();
        setDisabled(true);
        await getMaxScore();
    }

    const finishGame = async () => {
        setScore(score > 1 ? score - 1 : score)
        setRandomColors([]);
        setIndexInStep(0);
        const response=await axios.post(`${URL}/finishGame`, { 'id': gameId, 'player_name': playerName, 'score': score }, {
            headers: {
                'id_header': gameId,
            }
        });
        setScore(0);
        setDisabled(false);
        await getMaxScore();
    }

    const checkCorectness = (color: string) => {
        if (randomColors[indexInStep] === color) {
            setIndexInStep(indexInStep + 1);
        }
        else {
            finishGame();
        }
    };

    const handleSubmit = (event: React.SyntheticEvent) => {
        event.preventDefault();
        setDisabled(false);
        setIsLogin(true);
        startGame();
    }

    //useeffect check if the player has clicked all the colors, if so update the score and random a new color
    useEffect(() => {
        if (indexInStep === randomColors.length && indexInStep !== 0) {
            setScore(score + 1);
            setIndexInStep(0);
            randomColor();
        }
    }, [indexInStep])

    return (
        <div className="container">
            <header>
                <h1>Simon's Game</h1>
            </header>
            <main>
                <GamePad checkCorectness={checkCorectness} randomColors={randomColors} />
            </main>
            <footer>
                <form onSubmit={handleSubmit}>
                    {!isLogin && <input
                        className='nameInput'
                        type='text'
                        value={playerName}
                        placeholder='Name'
                        onChange={(e) => setPlayerName(e.target.value)}
                        required={true}
                        minLength={2}
                    />}
                    <button
                        type='submit'
                        className='startButton'
                        disabled={disabled && isLogin}
                    >
                        start
                    </button>
                </form>
                {isLogin && <p>max score:  {maxScore} || score: {score}</p>}
            </footer>
        </div >
    );
}

export default GameControl;
