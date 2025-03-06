import { useState, useEffect } from 'react';
import { useMarvelService } from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './comicsList.scss';

const ComicsList = () => {
    const [comics, setComics] = useState([]);
    const [offset, setOffset] = useState(0);
    const [comicsEnded, setComicsEnded] = useState(false);

    const { loading, error, getAllComics, comicsMarvel, codeError } = useMarvelService();

    useEffect(() => {
        onRequest();
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
        [])

    const onRequest = () => {
        getAllComics(offset)
            .then(onComicsListLoaded)
    }

    const onComicsListLoaded = (newComics) => {
        setComics(comics => [...comics, ...newComics])
        setOffset(offset => offset + 8)
        setComicsEnded(newComics.length < 8 || offset > comicsMarvel - 9)
    }

    const viewList = (comics) => {
        const cardsComics = comics.map((comic, i) => {
            const { id, title, thumbnail, price } = comic

            return (
                <li className="comics__item" key={`${i}_${id}`}>
                    <a href="/">
                        <img src={thumbnail} alt={title} className="comics__item-img" />
                        <div className="comics__item-name">{title}</div>
                        <div className="comics__item-price">{price}</div>
                    </a>
                </li>
            )
        })
        return (
            <ul className="comics__grid">
                {cardsComics}
            </ul>
        )
    }

    const comicsList = (error && codeError(error) === '429') ? (<span className="comics__error_message">You have exceeded your rate limit.  Please try again later.</span>)
        : error ? <ErrorMessage /> : viewList(comics)
    const classButton = `button ${loading ? 'button__secondary' : 'button__main'} button__long`
    const styleButton = loading ? { width: 'unset' } : {}

    return (
        <div className="comics__list">
            {comicsList}
            {loading ? <Spinner /> : null}
            {(error || loading || comicsEnded) ? null : (
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

export default ComicsList