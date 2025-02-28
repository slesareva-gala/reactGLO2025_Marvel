import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Spinner from "../spinner/Spinner"
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';

import MarvelService from "../../services/MarvelService";

import './charInfo.scss';

const marvelService = new MarvelService()

const CharInfo = ({ charId, notCharList, onError429, setRefApp, onFocusTo, comicsMax = 10 }) => {
    const [char, setChar] = useState(0)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    useEffect(() => updateChar(), // eslint-disable-next-line react-hooks/exhaustive-deps
        [charId])

    const updateChar = () => {
        if (!charId) return

        onCharLoading()
        marvelService
            .getCharacter(charId)
            .then(onCharLoaded)
            .catch(onError)
    }

    const onCharLoaded = (char) => {
        setChar(char)
        setLoading(false)
    }

    const onCharLoading = () => {
        setLoading(true)
    }

    const onError = (e) => {
        if (e.message === '429') onError429()
        else {
            setLoading(false)
            setError(true)
        }
    }

    const classBox = notCharList ? '' : 'char__info'
    const content = notCharList ? null
        : error ? <ErrorMessage />
            : loading ? <Spinner />
                : char ? <View char={char} comicsMax={comicsMax} setRefApp={setRefApp} onFocusTo={onFocusTo} />
                    : <Skeleton />

    return (
        <div className={classBox}>
            {content}
        </div>
    )
}

const View = ({ char, comicsMax, setRefApp, onFocusTo }) => {
    const { id, name, description, thumbnail, homepage, wiki, comics } = char
    const qtyComics = Math.min(comics.length, comicsMax)
    comics.length = qtyComics

    return (
        <>
            <div className="char__basics" key={id}>
                <img src={thumbnail} alt={name} />
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage}
                            ref={link => setRefApp('CharInfo', link)}
                            className="button button__main"
                            onKeyDown={e => (e.code === 'ArrowLeft') ? onFocusTo('CharList') : null}
                        >
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki}
                            className="button button__secondary"
                            onKeyDown={e => (e.code === 'ArrowLeft') ? onFocusTo('CharList') : null}
                        >
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {qtyComics > 0 ? null : 'There is no comics with this character'}
                {
                    comics.map((item, i) => {
                        return (
                            <li className="char__comics-item" key={i}>
                                {item.name}
                            </li>

                        )
                    })
                }

            </ul>
        </>
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number.isRequired,
    notCharList: PropTypes.bool.isRequired,
    onError429: PropTypes.func.isRequired,
    setRefApp: PropTypes.func.isRequired,
    onFocusTo: PropTypes.func.isRequired,
    comicsMax: PropTypes.number
}

export default CharInfo;