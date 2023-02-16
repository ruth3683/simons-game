import React, { useEffect, useState } from 'react';
import '../styles/gamePad.css';

type Props = {
    checkCorectness: (color: string) => void;
    randomColors: string[];
}
const GamePad: React.FC<Props> = ({ checkCorectness, randomColors }) => {
    const COLOR_BUTTON: string = 'colorButton';
    const [disabled, setDisabled] = useState<boolean>(true);
    const [greenClass, setGreenClass] = useState<string>('colorButton');
    const [redClass, setRedClass] = useState<string>('colorButton');
    const [yellowClass, setYellowClass] = useState<string>('colorButton');
    const [blueClass, setBlueClass] = useState<string>('colorButton');

    const timeout = (ms: number) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const highlightRandomColors = async () => {
        await timeout(400);
        setDisabled(true);
        for (let i: number = 0; i < randomColors.length; i++) {
            switch (randomColors[i]) {
                case 'red':
                    setRedClass('colorButton noOpacity');
                    await timeout(1000);
                    setRedClass('colorButton');
                    break;
                case 'green':
                    setGreenClass('colorButton noOpacity');
                    await timeout(1000);
                    setGreenClass('colorButton');
                    break;
                case 'yellow':
                    setYellowClass('colorButton noOpacity');
                    await timeout(1000);
                    setYellowClass('colorButton');
                    break;
                case 'blue':
                    setBlueClass('colorButton noOpacity');
                    await timeout(1000);
                    setBlueClass('colorButton');
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
