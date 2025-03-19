import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { useMarvelService } from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './comicsList.scss';

const ComicsList = () => {
    const [comics, setComics] = useState([]);
    const [offset, setOffset] = useState(0);

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
        setComics(comics => [...comics,
        ...newComics.filter(obj1 => comics.findIndex(obj2 => (obj2.id === obj1.id)) < 0)])
        setOffset(offset + 8)
    }

    const viewList = (comics) => {
        const cardsComics = comics.map(comic => {
            const { id, title, thumbnail, price } = comic

            return (
                <li className="comics__item" key={id}>
                    <Link to={`/comics/${id}`}>
                        <img src={thumbnail} alt={title} className="comics__item-img" />
                        <div className="comics__item-name">{title}</div>
                        <div className="comics__item-price">{price}</div>
                    </Link>
                </li>
            )
        })
        return (
            <ul className="comics__grid">
                {cardsComics}
            </ul>
        )
    }

    const isError429 = error && codeError(error) === '429'
    const comicsError = isError429 ? (<span className="comics__error_message">You have exceeded your rate limit.  Please try again later.</span>)
        : error ? <ErrorMessage /> : null
    const classButton = `button ${loading ? 'button__secondary' : 'button__main'} button__long`
    const styleButton = loading ? { width: 'unset' } : {}

    return (
        <div className="comics__list">
            {viewList(comics)}
            {comicsError}
            {loading ? <Spinner /> : null}
            {(isError429 || loading || offset > comicsMarvel - 1) ? null : (
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