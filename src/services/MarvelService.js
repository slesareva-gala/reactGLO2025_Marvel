
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


    getAllCharacters = () => {
        return this.getResource(`${this._apiBase}characters?limit=9&offset=210&${this._apikey}`)
    }

    getCharacter = (id) => {
        return this.getResource(`${this._apiBase}characters/${id}?${this._apikey} `)
    }

}

export default MarvelService