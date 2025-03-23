import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useMarvelService } from "../../services/MarvelService";
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import AppBanner from "../appBanner/AppBanner";


const SinglePage = ({ Component, dataType }) => {
    const { id } = useParams()
    const [data, setData] = useState(null)

    const { loading, error, getComic, getCharacter } = useMarvelService()

    useEffect(() => updateData(), // eslint-disable-next-line react-hooks/exhaustive-deps
        [id])

    const updateData = () => {
        if (!id) return

        switch (dataType) {
            case 'comic':
                getComic(id)
                    .then(onDataLoaded)
                break
            case 'character':
                getCharacter(id)
                    .then(onDataLoaded)
                break
            default:
                return
        }
    }

    const onDataLoaded = (data) => {
        setData(data)
    }

    const content = error ? <ErrorMessage />
        : loading ? <Spinner />
            : data ? <Component data={data} />
                : null

    return (
        <>
            <AppBanner />
            {content}
        </>
    )
}

export default SinglePage;