import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import Spinner from "../spinner/Spinner"
import ErrorMessage from '../errorMessage/ErrorMessage';
import { useMarvelService } from "../../services/MarvelService";

import './charList.scss';


const CharList = ({ charId, onCharSelected, setRefApp, onFocusTo }) => {
    const { loading, error, getAllCharacters, charsMarvel, codeError, offsetCharsBerginMarvel } = useMarvelService()

    const [chars, setChars] = useState([])
    const [offset, setOffset] = useState(offsetCharsBerginMarvel)


    useEffect(() => {
        onRequest()
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
        [])

    const onRequest = () => {
        getAllCharacters(offset)
            .then(onCharListLoaded)
    }

    const onCharListLoaded = newChars => {
        setChars(chars => [...chars,
        ...newChars.filter(obj1 => chars.findIndex(obj2 => (obj2.id === obj1.id)) < 0)])
        setOffset(offset + 9)
    }

    const viewList = (chars) => {
        const cardsChars = chars.map(char => {
            const { id, name, thumbnail } = char
            const idSelected = id === charId
            const classLi = `char__item ${idSelected ? 'char__item_selected' : ''}`

            return (
                <CSSTransition key={id} timeout={300} classNames="char__item">
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
                </CSSTransition>
            )
        })
        return (
            <ul className="char__grid">
                <TransitionGroup component={null}>
                    {cardsChars}
                </TransitionGroup>
            </ul>
        )
    }

    const isError429 = error && codeError(error) === '429'
    const charsError = isError429 ? (<span className="char__error_message">You have exceeded your rate limit.  Please try again later.</span>)
        : error ? <ErrorMessage /> : null
    const classButton = `button ${loading ? 'button__secondary' : 'button__main'} button__long`
    const styleButton = loading ? { width: 'unset' } : {}

    return (
        <div className="char__list">
            {viewList(chars)}
            {charsError}
            {loading ? <Spinner /> : null}
            {(isError429 || loading || offset > charsMarvel - 1) ? null : (
                <button
                    className={classButton}
                    onClick={onRequest}
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