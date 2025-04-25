import { useState, useRef } from "react"

import { useMarvelService } from "./MarvelService";

export const useMarvelBuffering = ({
    qtyMin = 3,
    qtyLimit = 10,
    callbackOffset = () => 0
}) => {
    const { getAllCharacters, charsMarvel, offsetCharsBeginMarvel } = useMarvelService()

    const [loading, setLoading] = useState(true)
    const [processing, setProcessing] = useState('waiting')

    const _chars = useRef([])
    const _qtyExpected = useRef(0)
    const _qtyMin = Math.max(1, qtyMin)
    const _qtyLimit = Math.min(100, Math.max(1, qtyLimit))

    const setBuffer = (chars) => {
        _chars.current = chars.length ? _chars.current.concat(chars) : [null]
        _qtyExpected.current -= _qtyLimit

        setLoading(false)
    }

    const getBuffer = () => {
        const bufferLength = _chars.current.length
        const char = bufferLength ? _chars.current[bufferLength - 1] : null

        if (char) {
            _chars.current = _chars.current.slice(0, bufferLength - 1)
            setProcessing('confirmed')
        } else setProcessing(bufferLength ? 'error' : 'waiting')

        if ((bufferLength + _qtyExpected.current) < _qtyMin) {
            setLoading(bufferLength < 1)
            updateBuffer()
        }

        return char
    }

    const updateBuffer = () => {
        const offset = callbackOffset()

        _qtyExpected.current += _qtyLimit

        getAllCharacters(offset, _qtyLimit)
            .then((chars) => setBuffer(chars))
            .catch((e) => setBuffer([]))
    }

    return { processing, loading, getBuffer, charsMarvel, offsetCharsBeginMarvel }
}
