import { Component } from 'react';

import Spinner from "../spinner/Spinner"
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from "../../services/MarvelService";

import './charList.scss';

class CharList extends Component {
    state = {
        chars: [],
    }

    marvelService = new MarvelService()

    componentDidMount() {
        this.marvelService
            .getAllCharacters()
            .then(this.onCharListLoaded)
            .catch(this.onCharListError)
    }

    onCharListLoaded = (chars) => {
        this.setState({
            chars,
            selectId: chars[0].id,
        })
        this.props.onListLoaded()
    }

    onCharListError = (e) => {
        if (e.message === '429') this.props.onError429()
        else this.props.onListError()
    }

    viewList = (chars) => {
        const cardsChars = chars.map(char => {
            const { id, name, thumbnail } = char
            const classLi = `char__item ${id === this.props.charId ? 'char__item_selected' : ''}`
            const classImg = thumbnail.includes('image_not_available') ? 'not_image' : ''

            return (
                <li
                    className={classLi}
                    key={id}
                    onClick={() => this.props.onCharSelected(id)}
                >
                    <img src={thumbnail} alt={name} className={classImg} />
                    <div className="char__name">{name}</div>
                </li>
            )
        })

        return (
            <ul className="char__grid">
                {cardsChars}
            </ul>
        )
    }

    render() {
        const { chars } = this.state
        const { loading, error, error429 } = this.props

        const charList = error429 ? (<span className="char__error_message">You have exceeded your rate limit.  Please try again later.</span>)
            : error ? <ErrorMessage /> : loading ? <Spinner /> : this.viewList(chars)

        return (
            <div className="char__list">
                {charList}
                {(loading || error) ? null : (
                    <button className="button button__main button__long">
                        <div className="inner">load more</div>
                    </button>
                )}
            </div>
        )
    }
}

export default CharList;