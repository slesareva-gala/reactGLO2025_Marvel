import { useHttp } from '../hooks/http.hook'

import imgNotFound from "../resources/img/image_not_found.webp"
import imgNotAvailbale from "../resources/img/image_not_available.webp"

export const useMarvelService = () => {
    const { loading, request, error, clearError, codeError } = useHttp()

    const _apiBase = 'https://gateway.marvel.com:443/v1/public/'
    const _apikey = `apikey=${process.env.REACT_APP_MARVEL_API_KEY}`
    const charsMarvel = 1564 // на 16.02.2025

    const getAllCharacters = async (offset = 210, limit = 9) => {
        if (offset > charsMarvel - 1) return []

        try {
            const res = await request(`${_apiBase}characters?limit=${limit}&offset=${offset}&${_apikey}`)
            return res.data.results.map(_transformCharacter)
        } catch (e) {
            return []
        }
    }

    const getCharacter = async (id) => {
        try {
            const res = await request(`${_apiBase}characters/${id}?${_apikey} `)
            return res ? _transformCharacter(res.data.results[0]) : null
        } catch (e) {
            return null
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

    return { loading, error, clearError, codeError, getCharacter, getAllCharacters, charsMarvel }
}
