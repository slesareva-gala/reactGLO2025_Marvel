import { Component } from 'react';
import Spinner from "../spinner/Spinner"
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';

import MarvelService from "../../services/MarvelService";

import './charInfo.scss';

class CharInfo extends Component {
    state = {
        char: null,
        loading: false,
        error: false
    }

    marvelService = new MarvelService()

    componentDidMount() {
        this.updateChar()
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.charId !== prevProps.charId) {
            this.updateChar()
        }
    }

    updateChar = () => {
        const { charId } = this.props

        if (!charId) return

        this.onCharLoading()
        this.marvelService
            .getCharacter(charId)
            .then(this.onCharLoaded)
            .catch(this.onError)
    }


    onCharLoaded = (char) => {
        this.setState({
            char,
            loading: false
        })
    }

    onCharLoading = () => {
        this.setState({
            loading: true
        })
    }


    onError = (e) => {
        if (e.message === '429') this.props.onError429()
        else this.setState({
            loading: false,
            error: true
        })
    }

    render() {
        const { char, loading, error } = this.state
        const { notCharList } = this.props

        const classBox = notCharList ? '' : 'char__info'
        const content = notCharList ? null
            : error ? <ErrorMessage />
                : loading ? <Spinner />
                    : char ? <View char={char} />
                        : <Skeleton />

        return (
            <div className={classBox}>
                {content}
            </div>
        )
    }
}

const View = ({ char }) => {
    const { id, name, description, thumbnail, homepage, wiki, comics } = char
    const classImg = thumbnail.includes('image_not_available') ? 'not_image' : ''
    const qtyComics = Math.min(comics.length, this.props.comicsMax)
    comics.length = qtyComics

    return (
        <>
            <div className="char__basics" key={id}>
                <img src={thumbnail} alt={name} className={classImg} />
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {qtyComics > 0 ? null : 'There is no comics with this character'}
                {
                    comics.map((item, i) => {
                        return (
                            <li className="char__comics-item" key={i}>
                                {item.name}
                            </li>

                        )
                    })
                }

            </ul>
        </>
    )
}

export default CharInfo;