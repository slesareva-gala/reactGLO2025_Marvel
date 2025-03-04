import { useState, useRef } from "react"

import { useMarvelService } from "./MarvelService";

export const useMarvelBuffering = ({
    qtyMin = 3,
    qtyLimit = 10,
    callbackOffset = () => 0
}) => {
    const [loading, setLoading] = useState(true)
    const { getAllCharacters, error } = useMarvelService()

    const _chars = useRef([])
    const _qtyExpected = useRef(0)
    const _qtyMin = Math.max(1, qtyMin)
    const _qtyLimit = Math.min(100, Math.max(1, qtyLimit))

    const setBuffer = (chars) => {
        if (chars) _chars.current = chars.length ? _chars.current.concat(chars) : [null]
        _qtyExpected.current -= _qtyLimit

        if (chars) setLoading(_chars.current.length < 1)
        else setLoading(false)
    }

    const getBuffer = () => {
        const bufferLength = _chars.current.length
        const char = bufferLength ? _chars.current[bufferLength - 1] : null

        if (!error && (bufferLength + _qtyExpected.current) < _qtyMin) {

            setLoading(bufferLength < 1)
            updateBuffer()
        }

        if (char) _chars.current = _chars.current.slice(0, bufferLength - 1)

        return char
    }

    const updateBuffer = () => {
        const offset = callbackOffset()

        _qtyExpected.current += _qtyLimit

        getAllCharacters(offset, _qtyLimit)
            .then((chars) => setBuffer(chars))
            .catch((e) => setBuffer(null))
    }

    return { loading, error, getBuffer }
}
