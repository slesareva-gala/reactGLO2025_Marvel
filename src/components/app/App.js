import { useState, useRef } from "react";
import AppHeader from "../appHeader/AppHeader";
import RandomChar from "../randomChar/RandomChar";
import CharList from "../charList/CharList";
import CharInfo from "../charInfo/CharInfo";
import ErrorBoundary from "../errorBoundary/ErrorBoundary";

import decoration from '../../resources/img/vision.png';

const App = () => {
    const [loadingList, setLoadingList] = useState(true)
    const [errorList, setErrorList] = useState(false)
    const [selectedChar, setSelectedChar] = useState(0)
    const [error429, setError429] = useState()

    const refs = useRef({})

    const onListLoaded = () => {
        setLoadingList(false)
    }

    const onListError = (errorMessage) => {
        setErrorList(true)
        setLoadingList(false)
    }

    const onCharSelected = (id) => {
        setSelectedChar(id)
    }

    const setRefApp = (nameRef, elem) => {
        refs[nameRef] = elem
    }

    const onFocusTo = (nameRef) => {
        if (refs[nameRef]) refs[nameRef].focus()
    }


    const onError429 = () => {
        setError429(true)
        setErrorList(true)
        setLoadingList(false)
    }

    let styleImg = { visibility: 'visible', bottom: '-130px' }
    if (loadingList) styleImg = { ...styleImg, visibility: 'hidden' }
    if (error429) styleImg = { ...styleImg, bottom: '-300px' }

    return (
        <div className="app" >
            <AppHeader />
            <main>
                <ErrorBoundary>
                    <RandomChar
                        onError429={onError429} error429={error429}
                    />
                </ErrorBoundary>
                <div className="char__content">
                    <ErrorBoundary>
                        <CharList
                            setRefApp={setRefApp} onFocusTo={onFocusTo}
                            onListLoaded={onListLoaded}
                            loadingList={loadingList}
                            onListError={onListError}
                            error={errorList}
                            onError429={onError429} error429={error429}
                            onCharSelected={onCharSelected}
                            charId={selectedChar}
                        />
                    </ErrorBoundary>
                    <ErrorBoundary>
                        <CharInfo
                            setRefApp={setRefApp} onFocusTo={onFocusTo}
                            notCharList={loadingList || errorList}
                            onError429={onError429}
                            charId={selectedChar}
                        />
                    </ErrorBoundary>
                </div>
                <img className="bg-decoration" src={decoration} alt="vision" style={styleImg} />

            </main >
        </div >
    )

}

export default App;