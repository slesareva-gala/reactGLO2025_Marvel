import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import AppHeader from "../appHeader/AppHeader";
import Spinner from "../spinner/Spinner";

const Page404 = lazy(() => import('../pages/Page404'))
const MainPage = lazy(() => import('../pages/MainPage'))
const ComicsPage = lazy(() => import('../pages/ComicsPage'))
const SinglePage = lazy(() => import('../pages/SinglePage'))
const SingleComic = lazy(() => import('../pages/singleComic/SingleComic'));
const SingleCharacter = lazy(() => import('../pages/singleCharacter/SingleCharacter'));


const App = () => {

    return (
        <Router>
            <div className="app" >
                <AppHeader />
                <main>
                    <Suspense fallback={<Spinner />}>
                        <Switch>
                            <Route exact path="/reactGLO2025_Marvel">
                                <MainPage />
                            </Route>
                            <Route exact path="/reactGLO2025_Marvel/comics">
                                <ComicsPage />
                            </Route>
                            <Route exact path="/reactGLO2025_Marvel/comics/:id">
                                <SinglePage Component={SingleComic} dataType='comic' />
                            </Route>
                            <Route exact path="/reactGLO2025_Marvel/characters/:id">
                                <SinglePage Component={SingleCharacter} dataType='character' />
                            </Route>
                            <Route path="*">
                                <Page404 />
                            </Route>
                        </Switch>
                    </Suspense>
                </main >
            </div >
        </Router>
    )
}

export default App;