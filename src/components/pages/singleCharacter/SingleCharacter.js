import { Helmet } from "react-helmet";

import './singleCharacter.scss';

const SingleCharacter = ({ data }) => {

    const { name, description, thumbnail } = data;

    return (
        <div className="single-char">
            <Helmet>
                <meta
                    name="description"
                    content={`Selected Marvel Character: ${name}`}
                />
                <title>{name}</title>
            </Helmet>
            <img src={thumbnail} alt={name} className="single-char__char-img" />
            <div className="single-char__info">
                <h2 className="single-char__name">{name}</h2>
                <p className="single-char__descr">{description}</p>
            </div>
        </div>
    )
}

export default SingleCharacter;