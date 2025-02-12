import { Component } from 'react';

import Spinner from "../spinner/Spinner"
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from "../../services/MarvelService";

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';

class RandomChar extends Component {
    state = {
        char: {},
        selected: false,
        loading: true,
        error: false
    }

    marvelService = new MarvelService()
    stackChar = []

    componentDidMount() {
        this.onCharRender()
        this.timerId = setInterval(() => {
            this.onCharRender()
        }, 3000)

    }
    componentWillUnmount() {
        clearInterval(this.timerId)
    }

    onCharRender = () => {
        if (this.stackChar.length < 3) this.updateChar()
        if (this.stackChar.length < 1 || this.state.selected) return

        const stackChar = this.stackChar.shift()
        this.setState({ char: { ...stackChar.char }, loading: false, error: stackChar.error })
    }

    onCharSelected = () => {
        this.setState({ selected: !this.state.selected })
    }

    charLoaded = (char) => {
        this.stackChar.push({
            char: { ...char },
            loading: false,
            error: false
        })
    }
    charError = () => {
        this.stackChar.push({
            char: {},
            loading: false,
            error: true
        })
    }

    updateChar = () => {
        const id = Math.floor(Math.random() * 400 + 1011000)
        this.marvelService
            .getCharacter(id)
            .then(this.charLoaded)
            .catch(this.charError)
    }

    render() {
        const { char, selected, loading, error } = this.state
        const cardChar = error ? <ErrorMessage /> : loading ? <Spinner /> : <View char={char} />
        const btnText = selected ? 'Show other' : 'I choose'
        const btnClass = `button button__main ${loading ? 'loading' : ''}`

        return (
            <div className="randomchar">
                {cardChar}

                <div className="randomchar__static">
                    <p className="randomchar__title">
                        Choose a random character for today!<br />
                        Who would you like to get to know better?
                    </p>
                    <p className="randomchar__title">
                        Try!
                    </p>
                    <button className={btnClass}>
                        <div className="inner" onClick={this.onCharSelected}>{btnText}</div>
                    </button>
                    <img src={mjolnir} alt="mjolnir" className="randomchar__decoration" />
                </div>
            </div >
        )
    }
}


const View = ({ char }) => {
    const { name, description, thumbnail, homepage, wiki } = char
    const classImg = `randomchar__img ${thumbnail.includes('image_not_available') ? 'not_image' : ''}`

    return (
        <div className="randomchar__block">
            <img src={thumbnail} alt="Random character" className={classImg} />
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">{description}</p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
    )

}


export default RandomChar;