import { useState, useCallback } from "react"

export const useHttp = () => {
    const [processing, setProcessing] = useState('waiting')

    const request = useCallback(
        async (url,
            method = 'GET',
            body = null,
            headers = {
                'Content-Type': 'application/json',
                'Accept-Language': 'en-US, en;q=0.9'
            }) => {

            setProcessing('loading')

            try {
                const response = await fetch(url, { method, body, headers })

                if (!response.ok) {
                    throw new Error(`Could not fetch ${url}, status: ${response.status}`)
                }

                const data = await response.json()

                //setProcessing('confirmed') -  устанавливаем "вручную" после обработки data в цепочке обработки then

                return data

            } catch (e) {
                const codeError = e.message.includes('status:') ? e.message.match(/(?<=status:\s*)\d{3}/g)[0] : '000'

                setProcessing('error' + codeError)

                throw new Error(e);
            }
        }, [])

    return { request, processing, setProcessing }
}
