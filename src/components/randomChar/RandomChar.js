import { Component } from 'react';

import Spinner from "../spinner/Spinner"
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from "../../services/MarvelService";

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';

class RandomChar extends Component {
    state = {
        char: {},
        selected: true,
        loading: true,
        error: false
    }

    marvelService = new MarvelService()
    stackChars = {
        _chars: [],
        _qtyMin: Math.max(1, (this.props.stackMin || 1)),
        _qtyMax: Math.max(1, (this.props.stackMin || 1), (this.props.stackMax || 1)),
        _qtyExpected: 0,

        available: () => {
            const { _chars, _qtyMin, _qtyMax, _qtyExpected } = this.stackChars
            let qtySend = _qtyMax - _chars.length - _qtyExpected

            if ((_chars.length + _qtyExpected) < _qtyMin) {
                for (let i = 0; i < qtySend; i++) {
                    this.updateChar()
                }
                this.stackChars._qtyExpected += qtySend
            }
            return _chars.length > 0
        },

        set: (char) => {
            if (char === null) this.stackChars._chars.push(null)
            else this.stackChars._chars.push(char)
            this.stackChars._qtyExpected -= 1
        },
        get: () => this.stackChars._chars.pop()
    }

    componentDidMount() {
        this.onCharRender()
        this.timerId = setInterval(() => {
            this.onCharRender()
        }, 3000)

    }

    componentDidUpdate(prevProps) {
        if (this.props.error429 !== prevProps.error429) {
            clearInterval(this.timerId)
        }
    }

    componentWillUnmount() {
        clearInterval(this.timerId)
    }

    onCharRender = () => {

        if (!this.stackChars.available() || (!this.state.loading && this.state.selected)) return

        const char = this.stackChars.get()

        this.setState({
            char,
            loading: false,
            error: (char === null)
        })

    }

    onCharSelected = () => {
        this.setState({ selected: !this.state.selected })
    }

    charLoaded = (chars) => this.stackChars.set(chars)
    charError = (e) => {
        this.stackChars.set(null)
        if (e.message === '429') this.props.onError429()
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
        const { error429 } = this.props

        const cardChar = (error || error429) ? <ErrorMessage /> : loading ? <Spinner /> : <View char={char} selected={selected} />
        const btnText = selected ? 'Show others' : 'I choose'
        const btnClass = `button ${(loading || error429) ? 'button__secondary' : 'button__main'}`

        return (
            <div className="randomchar">
                {cardChar}

                <div className="randomchar__static">
                    <p className="randomchar__title">
                        Random character for today!<br />
                        Do you want to get to know him better?
                    </p>
                    <p className="randomchar__title">
                        Or choose another one
                    </p>
                    <button className={btnClass}>
                        <div className="inner" onClick={this.onCharSelected}>{btnText}</div>
                    </button>
                    <img src={mjolnir} alt="mjolnir" className="randomchar__decoration" />
                </div>
            </div>
        )
    }
}

const sliceText = (text, maxLen) => {
    let str = text.trim().replace(/\s+/g, " ") || 'no information available'

    if (str.length > maxLen) str = str.slice(0, maxLen - 3).match(/.+(?=\s)/g) + "..."
    return str
}

const View = ({ char, selected }) => {
    const { id, name, description, thumbnail, homepage, wiki } = char
    const btnClass = `button ${selected ? 'button__main' : 'button__secondary'}`
    const descriptionShort = sliceText(description, 210)

    return (
        <div className="randomchar__block" key={id}>
            <img src={thumbnail} alt={name} className="randomchar__img" />
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">{descriptionShort}</p>
                <div className="randomchar__btns">
                    <a href={homepage} className={btnClass}>
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className={btnClass}>
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
    )

}


export default RandomChar;