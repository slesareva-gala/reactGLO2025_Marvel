import { useState, useRef } from "react";
import { Helmet } from "react-helmet";

import RandomChar from "../randomChar/RandomChar";
import CharList from "../charList/CharList";
import CharInfo from "../charInfo/CharInfo";
import CharSearchForm from '../charSearchForm/CharSearchForm';

import ErrorBoundary from "../errorBoundary/ErrorBoundary";

import decoration from '../../resources/img/vision.png';

const MainPage = () => {
    const [selectedChar, setSelectedChar] = useState(0)

    const refs = useRef({})

    const onCharSelected = (id) => {
        setSelectedChar(id)
    }

    const setRefApp = (nameRef, elem) => {
        refs[nameRef] = elem
    }

    const onFocusTo = (nameRef) => {
        if (refs[nameRef]) refs[nameRef].focus()
    }

    return (
        <>
            <Helmet>
                <meta
                    name="description"
                    content="Marvel information portal"
                />
                <title>Marvel information portal</title>
            </Helmet>
            <ErrorBoundary>
                <RandomChar />
            </ErrorBoundary>
            <div className="char__content">
                <ErrorBoundary>
                    <CharList
                        setRefApp={setRefApp} onFocusTo={onFocusTo}
                        onCharSelected={onCharSelected}
                        charId={selectedChar}
                    />
                </ErrorBoundary>
                <div>
                    <ErrorBoundary>
                        <CharInfo
                            setRefApp={setRefApp} onFocusTo={onFocusTo}
                            charId={selectedChar}
                        />
                    </ErrorBoundary>
                    <ErrorBoundary>
                        <CharSearchForm />
                    </ErrorBoundary>
                    <img className="bg-decoration" src={decoration} alt="vision" />
                </div>
            </div>
        </>
    )
}

export default MainPage