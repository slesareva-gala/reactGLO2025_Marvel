import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import { useMarvelService } from "../../services/MarvelService";
import setContent from '../../utils/setContent';

import './charList.scss';


const CharList = ({ charId, onCharSelected, setRefApp, onFocusTo }) => {
    const { processing, setProcessing, getAllCharacters, charsMarvel, offsetCharsBeginMarvel } = useMarvelService()

    const [chars, setChars] = useState([])
    const [offset, setOffset] = useState(offsetCharsBeginMarvel)

    useEffect(() => {
        onRequest()
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
        [])

    const onRequest = () => {
        getAllCharacters(offset)
            .then(onCharListLoaded)
            .then(() => setProcessing('confirmed'))
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

    const setContentCust = (processing) => {
        switch (processing) {
            case 'confirmed':
                return null
            case 'error429':
                return (<span className="char__error_message">You have exceeded your rate limit.  Please try again later.</span>)
            default:
                return setContent(processing)
        }
    }

    const classButton = `button ${processing === 'loading' ? 'button__secondary' : 'button__main'} button__long`
    const styleButton = processing === 'loading' ? { width: 'unset' } : {}

    return (
        <div className="char__list">
            {viewList(chars)}
            {setContentCust(processing)}
            {(processing === 'error429' || processing === 'loading' || offset > charsMarvel - 1) ? null : (
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