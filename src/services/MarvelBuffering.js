import { useState, useRef } from "react"

export const useBuffering = ({
    qtyMin = 3,
    qtyLimit = 10,
    getData }) => {

    const [processing, setProcessing] = useState('waiting')

    const list = useRef([])
    const qtyExpected = useRef(0)

    qtyMin = Math.max(1, qtyMin)
    qtyLimit = Math.min(100, Math.max(1, qtyLimit))

    const setBuffer = (elements) => {
        list.current = elements.length ? list.current.concat(elements) : [null]
        qtyExpected.current -= qtyLimit
    }

    const getBuffer = () => {
        const bufferLength = list.current.length
        const char = bufferLength ? list.current[bufferLength - 1] : null

        if (char) {
            setProcessing('confirmed')
        } else {
            setProcessing(bufferLength ? 'error' : 'waiting')
        }
        if (bufferLength) list.current = list.current.slice(0, bufferLength - 1)

        return char
    }

    const updateBuffer = () => {
        if (!getData) {
            setBuffer([])
            return
        }

        if ((list.current.length + qtyExpected.current) < qtyMin) {

            qtyExpected.current += qtyLimit

            getData(qtyLimit)
                .then((data) => setBuffer(data))
                .catch((e) => setBuffer([]))
        }
    }

    return { processing, getBuffer, updateBuffer }
}
