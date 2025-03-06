import { useState, useRef } from "react";
import AppHeader from "../appHeader/AppHeader";
import RandomChar from "../randomChar/RandomChar";
import CharList from "../charList/CharList";
import CharInfo from "../charInfo/CharInfo";
import ErrorBoundary from "../errorBoundary/ErrorBoundary";

import CommicList from "../comicsList/ComicsList";

import decoration from '../../resources/img/vision.png';

const App = () => {
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
        <div className="app" >
            <AppHeader />
            <main>
                <ErrorBoundary>
                    <CommicList />
                </ErrorBoundary>
                {/* <ErrorBoundary>
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
                    <ErrorBoundary>
                        <CharInfo
                            setRefApp={setRefApp} onFocusTo={onFocusTo}
                            charId={selectedChar}
                        />
                    </ErrorBoundary>
                </div>
                <img className="bg-decoration" src={decoration} alt="vision" /> */}

            </main >
        </div >
    )
}

export default App;