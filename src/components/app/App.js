import { Component } from "react";
import AppHeader from "../appHeader/AppHeader";
import RandomChar from "../randomChar/RandomChar";
import CharList from "../charList/CharList";
import CharInfo from "../charInfo/CharInfo";
import ErrorBoundary from "../errorBoundary/ErrorBoundary";

import decoration from '../../resources/img/vision.png';

class App extends Component {
    state = {
        loadingList: true,
        errorList: false,
        selectedChar: 0,
        error429: false
    }

    onListLoaded = () => {
        this.setState({
            loadingList: false
        })
    }

    onListError = (errorMessage) => {
        this.setState({
            errorList: true,
            loadingList: false
        })
    }

    onCharSelected = (id) => {
        this.setState({
            selectedChar: id
        })
    }

    onFocusTo = (componentName) => {
        if (!this.refs[componentName] || !this.refs[componentName].refs.current) return
        this.refs[componentName].refs.current.focus()
    }

    onError429 = () => {
        this.setState({
            error429: true,
            errorList: true,
            loadingList: false
        })
    }

    render() {
        let styleImg = { visibility: 'visible', bottom: '-130px' }
        if (this.state.loadingList) styleImg = { ...styleImg, visibility: 'hidden' }
        if (this.state.error429) styleImg = { ...styleImg, bottom: '-300px' }

        return (
            <div className="app" >
                <AppHeader />
                <main>
                    <ErrorBoundary>
                        <RandomChar
                            stackMin={1}    // in prod 5
                            stackLimit={5}  // in prod 10
                            onError429={this.onError429} error429={this.state.error429}
                        />
                    </ErrorBoundary>
                    <div className="char__content">
                        <ErrorBoundary>
                            <CharList
                                ref={(link) => this.refs.CharList = link}
                                onFocusTo={this.onFocusTo}
                                onListLoaded={this.onListLoaded}
                                loadingList={this.state.loadingList}
                                onListError={this.onListError}
                                error={this.state.errorList}
                                onError429={this.onError429} error429={this.state.error429}
                                onCharSelected={this.onCharSelected}
                                charId={this.state.selectedChar}
                            />
                        </ErrorBoundary>
                        <ErrorBoundary>
                            <CharInfo
                                ref={(link) => this.refs.CharInfo = link}
                                onFocusTo={this.onFocusTo}
                                notCharList={this.state.loadingList || this.state.errorList}
                                onError429={this.onError429}
                                charId={this.state.selectedChar}
                            />
                        </ErrorBoundary>
                    </div>
                    <img className="bg-decoration" src={decoration} alt="vision" style={styleImg} />

                </main >
            </div >
        )
    }
}

export default App;