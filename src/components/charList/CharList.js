import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Spinner from "../spinner/Spinner"
import ErrorMessage from '../errorMessage/ErrorMessage';
import { useMarvelService } from "../../services/MarvelService";

import './charList.scss';


const CharList = ({ charId, onCharSelected, setRefApp, onFocusTo }) => {
    const [chars, setChars] = useState([])
    const [offset, setOffset] = useState(210)
    const [charEnded, setCharEnded] = useState(false)

    const { loading, error, getAllCharacters, charsMarvel, codeError } = useMarvelService()

    useEffect(() => {
        onRequest()
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
        [])

    const onRequest = () => {
        getAllCharacters(offset)
            .then(onCharListLoaded)
    }

    const onCharListLoaded = newChars => {
        setChars(chars => [...chars, ...newChars])
        setOffset(offset => offset + 9)
        setCharEnded(newChars.length < 9 || offset > charsMarvel - 10)
    }

    const onCharListMore = () => {
        onRequest()
    }

    const viewList = (chars) => {
        const cardsChars = chars.map(char => {
            const { id, name, thumbnail } = char
            const idSelected = id === charId
            const classLi = `char__item ${idSelected ? 'char__item_selected' : ''}`

            return (
                <li
                    className={classLi}
                    key={id}
                >
                    <button
                        ref={link => idSelected ? setRefApp('CharList', link) : null}
                        onClick={() => onCharSelected(id)}
                        onKeyDown={e => (e.code === 'ArrowRight' && idSelected) ? onFocusTo('CharInfo') : null}
                    >
                        <img src={thumbnail} alt={name} />
                        <div className="char__name">{name}</div>
                    </button>
                </li>
            )
        })
        return (
            <ul className="char__grid">
                {cardsChars}
            </ul>
        )
    }

    const charList = (error && codeError(error) === '429') ? (<span className="char__error_message">You have exceeded your rate limit.  Please try again later.</span>)
        : error ? <ErrorMessage /> : viewList(chars)
    const classButton = `button ${loading ? 'button__secondary' : 'button__main'} button__long`
    const styleButton = loading ? { width: 'unset' } : {}

    return (
        <div className="char__list">
            {charList}
            {loading ? <Spinner /> : null}
            {(error || loading || charEnded) ? null : (
                <button
                    className={classButton}
                    onClick={onCharListMore}
                    style={styleButton}
                >
                    <div className="inner">load more</div>
                </button>
            )}
        </div>
    )
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired,
    setRefApp: PropTypes.func.isRequired,
    onFocusTo: PropTypes.func.isRequired,
    charId: PropTypes.number.isRequired,
}

export default CharList;