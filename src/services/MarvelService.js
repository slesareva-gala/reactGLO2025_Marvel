import { useHttp } from '../hooks/http.hook'

import imgNotFound from "../resources/img/image_not_found.webp"
import imgNotAvailbale from "../resources/img/image_not_available.webp"

export const useMarvelService = () => {
    const { request, processing, setProcessing } = useHttp()

    const _apiBase = 'https://gateway.marvel.com:443/v1/public/'
    const _apiKey = `apikey=${process.env.REACT_APP_MARVEL_API_KEY}`

    const charsMarvel = 1564 // на 16.02.2025
    const offsetCharsBeginMarvel = 196
    const comicsMarvel = 1000 // ???

    const getAllCharacters = async (offset = offsetCharsBeginMarvel, limit = 9) => {
        if (offset > charsMarvel - 1) return []

        try {
            const res = await request(`${_apiBase}characters?limit=${limit}&offset=${offset}&${_apiKey}`)
            return res.data.results.map(_transformCharacter)
        } catch (e) {
            return []
        }
    }

    const getCharacter = async (id) => {
        try {
            const res = await request(`${_apiBase}characters/${id}?${_apiKey} `)
            return res ? _transformCharacter(res.data.results[0]) : null
        } catch (e) {
            return null
        }
    }

    const getCharacterByName = async (name) => {
        try {
            const res = await request(`${_apiBase}characters?name=${name}&${_apiKey}`);
            return res.data.results.map(_transformCharacter);
        } catch (e) {
            return []
        }
    }

    const getAllComics = async (offset = 0, limit = 8) => {
        try {
            const res = await request(`${_apiBase}comics?orderBy=issueNumber&limit=${limit}&offset=${offset}&${_apiKey}`)
            return res.data.results.map(_transformComics)
        } catch (e) {
            return []
        }
    }

    const getComic = async (id) => {
        try {
            const res = await request(`${_apiBase}comics/${id}?${_apiKey}`)
            return res ? _transformComics(res.data.results[0]) : []
        } catch (e) {
            return []
        }
    }

    const _transformCharacter = (char) => {
        const { id, name, description, thumbnail, urls } = char

        const srcThumbnail = thumbnail.path.includes('image_not_available') ? imgNotFound
            : thumbnail.path.includes('4c002e0305708') ? imgNotAvailbale
                : `${thumbnail.path}.${thumbnail.extension}`

        return {
            id,
            name,
            description: description,
            thumbnail: srcThumbnail,
            homepage: urls[0].url,
            wiki: urls[1].url,
            comics: char.comics.items,
        }
    }

    const _transformComics = (comics) => {
        const { id, title, description, pageCount, thumbnail, prices } = comics

        return {
            id,
            title,
            description: description || "The description is missing",
            pageCount: pageCount
                ? `${pageCount} p.`
                : "No information about the number of pages",
            thumbnail: `${thumbnail.path}.${thumbnail.extension}`,
            language: comics.textObjects[0]?.language || "en-us",
            price: prices[0].price
                ? `${prices[0].price} $`
                : "not available",
        }
    }

    return {
        charsMarvel, comicsMarvel, offsetCharsBeginMarvel,
        processing, setProcessing,
        getCharacter, getCharacterByName, getAllCharacters,
        getAllComics, getComic
    }
}
