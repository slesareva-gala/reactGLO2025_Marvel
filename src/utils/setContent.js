import Spinner from "../components/spinner/Spinner"
import ErrorMessage from '../components/errorMessage/ErrorMessage';

const setContent = (processing, Component, data) => {

    switch (processing.replace(/\d/g, '')) {
        case 'waiting':
            return <Spinner />
        case 'loading':
            return <Spinner />
        case 'confirmed':
            return <Component data={data} />
        case 'error':
            return <ErrorMessage />
        default:
            throw new Error('Unexpected process state')
    }
}

export default setContent