import notImage from "../resources/img/image_not_available.webp"

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


    getAllCharacters = async (qty = 9) => {
        const res = await this.getResource(`${this._apiBase}characters?limit=${qty}&offset=210&${this._apikey}`)
        return res.data.results.map(this._transformCharacter)
    }

    getCharacter = async (id) => {
        const res = await this.getResource(`${this._apiBase}characters/${id}?${this._apikey} `)
        return this._transformCharacter(res.data.results[0])
    }

    _transformCharacter = (char) => {
        const { id, name, description, thumbnail, urls } = char

        const sliceText = (test, maxLen = 220) => {
            let str = test.trim().replace(/\s+/g, " ") || 'no information available'

            if (str.length > maxLen) str = str.slice(0, maxLen - 3).match(/.+(?=\s)/g) + "..."
            return str
        }

        const srcThumbnail = thumbnail.path.includes('image_not_available') ? notImage : `${thumbnail.path}.${thumbnail.extension}`

        return {
            id,
            name,
            description: sliceText(description),
            thumbnail: srcThumbnail,
            homepage: urls[0].url,
            wiki: urls[1].url
        }
    }

}

export default MarvelService