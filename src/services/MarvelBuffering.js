import MarvelService from "./MarvelService";

class MarvelBuffering {

    constructor({
        qtyMin = 1,
        qtyLimit = 1,
        callbackOffset = () => 0,
        callbackError = (e) => null }
    ) {
        this._chars = []
        this._qtyExpected = 0
        this._qtyMin = Math.max(1, qtyMin)
        this._qtyLimit = Math.min(100, Math.max(1, qtyLimit))

        this._marvelService = new MarvelService()
        this._callbackOffset = callbackOffset
        this._callbackError = callbackError
    }

    set callbackOffset(callback) { if (typeof (callback) === 'function') this._callbackOffset = callback }
    get callbackOffset() { return this._callbackOffset }
    set callbackError(callback) { if (typeof (callback) === 'function') this._callbackError = callback }
    get callbackError() { return this._callbackError }

    available() {
        const { _chars, _qtyExpected, _qtyMin, _qtyLimit } = this

        if ((_chars.length + _qtyExpected) < _qtyMin) {
            this._qtyExpected += _qtyLimit
            this.updateChars(_qtyLimit)
        }
        return this._chars.length > 0
    }

    set(chars) {
        if (chars.length) this._chars.push(...chars)
        else if (this._chars.length < 1) this._chars.push(null)

        this._qtyExpected -= this._qtyLimit
    }
    get() { return this._chars.pop() }

    error(e) {
        this.set([null])
        this.callbackError(e)
    }

    updateChars(limit) {
        const offset = this.callbackOffset()
        this._marvelService
            .getAllCharacters(offset, limit)
            .then((chars) => this.set(chars))
            .catch((e) => this.error(e))
    }
}

export default MarvelBuffering
