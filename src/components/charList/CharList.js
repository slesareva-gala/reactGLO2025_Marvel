import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Spinner from "../spinner/Spinner"
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from "../../services/MarvelService";

import './charList.scss';

const charsMarvel = 1564 // на 16.02.2025
const marvelService = new MarvelService()

const CharList = (props) => {
    const [chars, setChars] = useState([])
    const [moreLoading, setMoreLoading] = useState(false)
    const [offset, setOffset] = useState(210)
    const [charEnded, setCharEnded] = useState(false)

    useEffect(() => {
        if (props.loadingList || moreLoading) onRequest()
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
        [])

    const onRequest = () => {
        marvelService
            .getAllCharacters(offset)
            .then(onCharListLoaded)
            .catch(onCharListError)
    }

    const onCharListLoaded = newChars => {
        setChars(chars => [...chars, ...newChars])
        setMoreLoading(false)
        setOffset(offset => offset + 9)
        setCharEnded(newChars.length < 9 || offset > charsMarvel - 10)

        if (props.loadingList) props.onListLoaded(false)
    }

    const onCharListError = (e) => {
        if (e.message === '429') props.onError429()
        else {
            setMoreLoading(false)
            props.onListError()
        }
    }

    const onCharListMore = () => {
        setMoreLoading(true)
        onRequest()
    }

    const viewList = (chars) => {
        const cardsChars = chars.map(char => {
            const { id, name, thumbnail } = char
            const idSelected = id === props.charId
            const classLi = `char__item ${idSelected ? 'char__item_selected' : ''}`

            return (
                <li
                    className={classLi}
                    key={id}
                >
                    <button
                        ref={link => idSelected ? props.setRefApp('CharList', link) : null}
                        onClick={() => props.onCharSelected(id)}
                        onKeyDown={e => (e.code === 'ArrowRight' && idSelected) ? props.onFocusTo('CharInfo') : null}
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

    const { loadingList, error, error429 } = props

    const charList = error429 ? (<span className="char__error_message">You have exceeded your rate limit.  Please try again later.</span>)
        : error ? <ErrorMessage /> : loadingList ? <Spinner /> : viewList(chars)
    const classButton = `button ${moreLoading ? 'button__secondary' : 'button__main'} button__long`
    const styleButton = moreLoading ? { width: 'unset' } : {}

    return (
        <div className="char__list">
            {charList}
            {moreLoading ? <Spinner /> : null}
            {(error || error429 || loadingList || charEnded) ? null : (
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
    onListLoaded: PropTypes.func.isRequired,
    onListError: PropTypes.func.isRequired,
    onError429: PropTypes.func.isRequired,
    setRefApp: PropTypes.func.isRequired,
    onFocusTo: PropTypes.func.isRequired,
    loadingList: PropTypes.bool.isRequired,
    error: PropTypes.bool.isRequired,
    charId: PropTypes.number.isRequired,
}

export default CharList;