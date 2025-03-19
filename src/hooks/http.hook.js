import { useState, useCallback } from "react"

export const useHttp = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const request = useCallback(
        async (url,
            method = 'GET',
            body = null,
            headers = { 'Content-Type': 'application/json' }) => {

            setLoading(true)
            setError(null)
            try {
                const response = await fetch(url, { method, body, headers })

                if (!response.ok) {
                    throw new Error(`Could not fetch ${url}, status: ${response.status}`)
                }

                const data = await response.json()

                setLoading(false)

                return data

            } catch (e) {
                const eMessage = e.message.includes('status:') ? e.message : `${e.message} ${url}, status: 000`
                setLoading(false)
                setError(eMessage)
                throw new Error(eMessage);
            }
        }, [])

    const codeError = useCallback((eMessage) => eMessage.match(/(?<=status:\s*)\d{3}/g)[0], [])

    return { loading, request, error, codeError }
}
