import { Component } from 'react';
import PropTypes from 'prop-types';

import Spinner from "../spinner/Spinner"
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from "../../services/MarvelService";

import './charList.scss';

const charsMarvel = 1564 // на 16.02.2025

class CharList extends Component {
    state = {
        chars: [],
        moreLoading: false,
        offset: 210,
        charEnded: false,
    }

    marvelService = new MarvelService()

    componentDidMount() {
        this.onRequest()
    }

    onRequest = () => {
        this.marvelService
            .getAllCharacters(this.state.offset)
            .then(this.onCharListLoaded)
            .catch(this.onCharListError)
    }

    onCharListMore = () => {
        this.setState({
            moreLoading: true
        })
        this.onRequest()
    }

    onCharListLoaded = (newChars) => {
        this.setState(({ chars, offset }) => ({
            chars: [...chars, ...newChars],
            moreLoading: false,
            offset: offset + 9,
            charEnded: newChars.length < 9 || offset > charsMarvel - 10
        }))
        if (this.props.loadingList) this.props.onListLoaded(false)
    }

    onCharListError = (e) => {
        if (e.message === '429') this.props.onError429()
        else {
            this.setState({
                moreLoading: false
            })
            this.props.onListError()
        }
    }

    viewList = (chars) => {
        const cardsChars = chars.map(char => {
            const { id, name, thumbnail } = char
            const classLi = `char__item ${id === this.props.charId ? 'char__item_selected' : ''}`

            return (
                <li
                    className={classLi}
                    key={id}
                    onClick={() => this.props.onCharSelected(id)}
                >
                    <img src={thumbnail} alt={name} />
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
        const { chars, moreLoading, charEnded } = this.state
        const { loadingList, error, error429 } = this.props

        const charList = error429 ? (<span className="char__error_message">You have exceeded your rate limit.  Please try again later.</span>)
            : error ? <ErrorMessage /> : loadingList ? <Spinner /> : this.viewList(chars)
        const classButton = `button ${moreLoading ? 'button__secondary' : 'button__main'} button__long`
        const styleButton = moreLoading ? { width: 'unset' } : {}

        return (
            <div className="char__list">
                {charList}
                {moreLoading ? <Spinner /> : null}
                {(error429 || loadingList || charEnded) ? null : (
                    <button
                        className={classButton}
                        onClick={this.onCharListMore}
                        style={styleButton}
                    >
                        <div className="inner">load more</div>
                    </button>
                )}
            </div>
        )
    }
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired,
    onListLoaded: PropTypes.func.isRequired,
    onListError: PropTypes.func.isRequired,
    onError429: PropTypes.func.isRequired,
    loadingList: PropTypes.bool.isRequired,
    error: PropTypes.bool.isRequired,
    charId: PropTypes.number.isRequired,
}



export default CharList;