import React, { useEffect, useState } from 'react';
import '../styles/gamePad.css';

type Props = {
    checkCorectness: (color: string) => void;
    randomColors: string[];
}
const GamePad: React.FC<Props> = ({ checkCorectness, randomColors }) => {
    const COLOR_BUTTON: string = 'colorButton';
    const NO_OPACITY: string = 'noOpacity';
    const [disabled, setDisabled] = useState<boolean>(true);
    const [greenClass, setGreenClass] = useState<string>(COLOR_BUTTON);
    const [redClass, setRedClass] = useState<string>(COLOR_BUTTON);
    const [yellowClass, setYellowClass] = useState<string>(COLOR_BUTTON);
    const [blueClass, setBlueClass] = useState<string>(COLOR_BUTTON);

    const timeout = (ms: number) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const setAndResetClass = async(setState: any) => {
        setState(`${COLOR_BUTTON} ${NO_OPACITY}`);
        await timeout(1000);
        setState(COLOR_BUTTON);
    }

    const highlightRandomColors = async () => {
        await timeout(400);
        setDisabled(true);
        for (let i: number = 0; i < randomColors.length; i++) {
            switch (randomColors[i]) {
                case 'red':
                    await setAndResetClass(setRedClass);
                    break;
                case 'green':
                    await setAndResetClass(setGreenClass);
                    break;
                case 'yellow':
                    await setAndResetClass(setYellowClass);
                    break;
                case 'blue':
                    await setAndResetClass(setBlueClass);
                    break;
            }
            if (i !== randomColors.length - 1 && randomColors[i] === randomColors[i + 1])
                await timeout(200);
        };
        setDisabled(false);
    }

    useEffect(() => {
        if (randomColors.length != 0)
            highlightRandomColors();
        else
            setDisabled(true);
    }, [randomColors.length])

    return (
        <div>
            <div>
                <button disabled={disabled} className={greenClass} style={{ backgroundColor: '#05ef05', }} onClick={() => { checkCorectness('green') }}></button>
                <button disabled={disabled} className={redClass} style={{ backgroundColor: '#fc0000' }} onClick={() => { checkCorectness('red') }}></button>
            </div >
            <div>
                <button disabled={disabled} className={yellowClass} style={{ backgroundColor: '#ffae00' }} onClick={() => { checkCorectness('yellow') }}></button>
                <button disabled={disabled} className={blueClass} style={{ backgroundColor: '#045ef4' }} onClick={() => { checkCorectness('blue') }}></button>
            </div>
        </div>
    );
}

export default GamePad;
