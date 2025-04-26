import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useMarvelService } from "../../services/MarvelService";

import setContent from '../../utils/setContent';
import AppBanner from "../appBanner/AppBanner";


const SinglePage = ({ Component, dataType }) => {
    const { id } = useParams()
    const [data, setData] = useState(null)

    const { processing, setProcessing, getComic, getCharacter } = useMarvelService()

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

        setProcessing(data ? 'confirmed' : 'error')
    }

    return (
        <>
            <AppBanner />
            {setContent(processing, Component, data)}
        </>
    )
}

export default SinglePage;