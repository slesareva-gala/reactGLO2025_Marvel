import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

import Spinner from "../spinner/Spinner"
import Page404 from './Page404';

import { useMarvelService } from "../../services/MarvelService";

import './singleComicPage.scss';

const SingleComicPage = () => {
    const { comicId } = useParams()
    const [comic, setComic] = useState(null)

    const { loading, error, clearError, getComic } = useMarvelService()

    useEffect(() => updateComic(), // eslint-disable-next-line react-hooks/exhaustive-deps
        [comicId])

    const updateComic = () => {
        if (!comicId) return

        clearError()
        getComic(comicId)
            .then(onComicLoaded)
    }

    const onComicLoaded = (comic) => {
        setComic(comic)
    }

    const content = error ? <Page404 />
        : loading ? <Spinner />
            : comic ? <View comic={comic} />
                : null

    return (
        <>
            {content}
        </>
    )
}

const View = ({ comic }) => {
    const { title, description, pageCount, thumbnail, language, price } = comic

    return (
        <div className="single-comic">
            <img src={thumbnail} alt={title} className="single-comic__img" />
            <div className="single-comic__info">
                <h2 className="single-comic__name">{title}</h2>
                <p className="single-comic__descr">{description}</p>
                <p className="single-comic__descr">{pageCount}</p>
                <p className="single-comic__descr">Language: {language}</p>
                <div className="single-comic__price">{price}</div>
            </div>
            <Link to="/comics" className="single-comic__back">Back to all</Link>
        </div>
    )
}

export default SingleComicPage;