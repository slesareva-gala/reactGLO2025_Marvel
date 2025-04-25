import { useState, useEffect } from 'react';
import { Link } from "react-router-dom"
import PropTypes from 'prop-types';
import Skeleton from '../skeleton/Skeleton';
import setContent from '../../utils/setContent';

import { useMarvelService } from "../../services/MarvelService";

import './charInfo.scss';

const CharInfo = ({ charId, setRefApp, onFocusTo, comicsMax = 10 }) => {
    const [char, setChar] = useState(0)

    const { processing, setProcessing, getCharacter } = useMarvelService()

    useEffect(() => updateChar(), // eslint-disable-next-line react-hooks/exhaustive-deps
        [charId])

    const updateChar = () => {
        if (!charId) return

        getCharacter(charId)
            .then(onCharLoaded)
            .then(() => setProcessing('confirmed'))
    }

    const onCharLoaded = (char) => {
        setChar(char)
    }

    const setContentCust = (processing) => {
        if (processing === 'confirmed' && !char) processing = "error"

        switch (processing) {
            case 'waiting':
                return <Skeleton />
            default:
                return setContent(processing, View, { char, comicsMax, setRefApp, onFocusTo })
        }
    }

    return (
        <div className="char__info">
            {setContentCust(processing)}
        </div>
    )
}

const View = ({ data }) => {
    const { char, comicsMax, setRefApp, onFocusTo } = data
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
                            className="button button__main"
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
                        const id = item.resourceURI.match(/\d+$/)[0]

                        return (
                            <li className="char__comics-item" key={i}
                                onKeyDown={e => (e.code === 'ArrowLeft') ? onFocusTo('CharList') : null}
                            >
                                <Link to={`/comics/${id}`}>
                                    {item.name}
                                </Link>
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