import { Component } from 'react';

import Spinner from "../spinner/Spinner"
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from "../../services/MarvelService";

import './charList.scss';

class CharList extends Component {
    state = {
        chars: [],
        selectId: 0,
        loading: true,
        error: false
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
            loading: false,
        })
    }

    onCharListError = () => {
        this.setState({
            error: true,
            loading: false
        })
    }

    viewList = (chars) => {
        const cardsChars = chars.map(char => {
            const { id, name, thumbnail } = char
            const classLi = `char__item ${id === this.state.selectId ? 'char__item_selected' : ''}`
            const classImg = thumbnail.includes('image_not_available') ? 'not_image' : ''

            return (
                <li
                    className={classLi}
                    key={id}
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
        const { chars, loading, error } = this.state

        const charList = error ? <ErrorMessage /> : loading ? <Spinner /> : this.viewList(chars)

        return (
            <div className="char__list">
                {charList}
                <button className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

export default CharList;