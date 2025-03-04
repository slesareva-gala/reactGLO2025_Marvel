import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Spinner from "../spinner/Spinner"
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';

import { useMarvelService } from "../../services/MarvelService";

import './charInfo.scss';

const CharInfo = ({ charId, setRefApp, onFocusTo, comicsMax = 10 }) => {
    const [char, setChar] = useState(0)

    const { loading, error, clearError, getCharacter } = useMarvelService()

    useEffect(() => updateChar(), // eslint-disable-next-line react-hooks/exhaustive-deps
        [charId])

    const updateChar = () => {
        if (!charId) return

        clearError()
        getCharacter(charId)
            .then(onCharLoaded)
    }

    const onCharLoaded = (char) => {
        setChar(char)
    }

    const content = error ? <ErrorMessage />
        : loading ? <Spinner />
            : char ? <View char={char} comicsMax={comicsMax} setRefApp={setRefApp} onFocusTo={onFocusTo} />
                : <Skeleton />

    return (
        <div className="char__info">
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
    setRefApp: PropTypes.func.isRequired,
    onFocusTo: PropTypes.func.isRequired,
    comicsMax: PropTypes.number
}

export default CharInfo;