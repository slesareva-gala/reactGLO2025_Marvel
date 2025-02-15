import imgNotFound from "../resources/img/image_not_found.webp"
import imgNotAvailbale from "../resources/img/image_not_available.webp"

class MarvelService {
    _apiBase = 'https://gateway.marvel.com:443/v1/public/'
    _apikey = `apikey=${process.env.REACT_APP_MARVEL_API_KEY}`

    getResource = async (url) => {
        let res = await fetch(url)

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`)
        }
        return await res.json()
    }


    getAllCharacters = async (offset) => {
        try {
            const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=${offset}&${this._apikey}`)
            return res.data.results.map(this._transformCharacter)
        } catch (e) {
            throw new Error(e.message.match(/(?<=status:\s*)\d{3}/g)[0])
        }
    }

    getCharacter = async (id) => {
        try {
            const res = await this.getResource(`${this._apiBase}characters/${id}?${this._apikey} `)
            return this._transformCharacter(res.data.results[0])
        } catch (e) {
            throw new Error(e.message.match(/(?<=status:\s*)\d{3}/g)[0])
        }

    }

    _transformCharacter = (char) => {
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

}

export default MarvelService