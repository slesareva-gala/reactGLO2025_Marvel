import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage as FormikErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';

import { useMarvelService } from '../../services/MarvelService';
import Spinner from "../spinner/Spinner"
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charSearchForm.scss';

const CharSearchForm = () => {
    const [char, setChar] = useState(null);
    const { loading, error, getCharacterByName } = useMarvelService();

    const onCharLoaded = (char) => {
        setChar(char);
    }

    const updateChar = (name) => {
        getCharacterByName(name)
            .then(onCharLoaded);
    }

    const results = error ? <div className="char__search-critical-error"><ErrorMessage /></div>
        : !char ? null
            : char.length > 0 ?
                <div className="char__search-wrapper">
                    <div className="char__search-success">There is! Visit {char[0].name} page?</div>
                    <Link to={`/characters/${char[0].id}`} className="button button__main">
                        <div className="inner">To page</div>
                    </Link>
                </div>
                : <div className="char__search-error">
                    The character was not found. Check the name and try again
                </div>
    const btnClass = `button ${(loading || error) ? 'button__secondary' : 'button__main'}`

    return (
        <div className="char__search-form">
            <Formik
                initialValues={{
                    charName: ''
                }}
                validationSchema={Yup.object({
                    charName: Yup.string().required('This field is required')
                })}
                onSubmit={({ charName }) => {
                    updateChar(charName);
                }}
            >
                <Form>
                    <label className="char__search-label" htmlFor="charName">Or find a character by name:</label>
                    <div className="char__search-wrapper">
                        <Field
                            id="charName"
                            name='charName'
                            type='text'
                            placeholder="Enter name" />
                        <button
                            type='submit'
                            className={btnClass}>
                            <div className="inner">find</div>
                        </button>
                    </div>
                    <FormikErrorMessage component="div" className="char__search-error" name="charName" />
                </Form>
            </Formik>
            {loading ? <Spinner /> : null}
            {results}
        </div>
    )
}

export default CharSearchForm;