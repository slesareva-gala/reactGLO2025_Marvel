import { Link, NavLink } from "react-router-dom"
import './appHeader.scss';

const AppHeader = () => {
    return (
        <header className="app__header">
            <h1 className="app__title">
                <Link to="/reactGLO2025_Marvel">
                    <span>Marvel</span> information portal
                </Link>
            </h1>
            <nav className="app__menu">
                <ul>
                    <li><NavLink exact activeStyle={{ 'color': '#9f0013' }} to="/reactGLO2025_Marvel">Characters</NavLink></li>
                    /
                    <li><NavLink activeStyle={{ 'color': '#9f0013' }} to="/reactGLO2025_Marvel/comics">Comics</NavLink></li>
                </ul>
            </nav>
        </header>
    )
}

export default AppHeader;