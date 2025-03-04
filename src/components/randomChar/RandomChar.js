import { useState, useEffect } from 'react';

import Spinner from "../spinner/Spinner"
import ErrorMessage from '../errorMessage/ErrorMessage';
import { useMarvelBuffering } from "../../services/MarvelBuffering";

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';


const RandomChar = () => {
    const [char, setChar] = useState(null)
    const [selected, setSelected] = useState(true)

    const { loading, error, getBuffer } = useMarvelBuffering({
        qtyMin: 3,
        qtyLimit: 10,
        callbackOffset: () => Math.floor(Math.random() * 1200 + 210)
    })

    useEffect(() => {
        onCharRender()
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
        [loading, selected])

    useEffect(() => {
        const timerId = setInterval(() => onCharRender(), 3000)
        return () => clearInterval(timerId)
    })

    const onCharRender = () => {
        if ((selected && char) || error) return

        setChar(getBuffer())
    }

    const onCharSelected = () => {
        setSelected(selected => !selected)
    }

    const cardChar = loading ? <Spinner /> : (error || char === null) ? <ErrorMessage /> : <View char={char} selected={selected} />
    const btnText = selected ? 'Show others' : 'I choose'
    const btnClass = `button ${(loading || error) ? 'button__secondary' : 'button__main'}`

    return (
        <div className="randomchar">
            {cardChar}

            <div className="randomchar__static">
                <p className="randomchar__title">
                    Random character for today!<br />
                    Do you want to get to know him better?
                </p>
                <p className="randomchar__title">
                    Or choose another one
                </p>
                <button className={btnClass} onClick={onCharSelected}>
                    <div className="inner" >{btnText}</div>
                </button>
                <img src={mjolnir} alt="mjolnir" className="randomchar__decoration" />
            </div>
        </div>
    )
}

const sliceText = (text, maxLen) => {
    let str = text.trim().replace(/\s+/g, " ") || 'no information available'

    if (str.length > maxLen) str = str.slice(0, maxLen - 3).match(/.+(?=\s)/g) + "..."
    return str
}

const View = ({ char, selected }) => {
    const { id, name, description, thumbnail, homepage, wiki } = char
    const btnClass = `button ${selected ? 'button__main' : 'button__secondary'}`
    const descriptionShort = sliceText(description, 210)

    return (
        <div className="randomchar__block" key={id}>
            <img src={thumbnail} alt={name} className="randomchar__img" />
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">{descriptionShort}</p>
                <div className="randomchar__btns">
                    <a href={homepage} className={btnClass}>
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className={btnClass}>
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
    )
}


export default RandomChar;