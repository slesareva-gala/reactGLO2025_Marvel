import styled from 'styled-components';
import imgError from "./error.gif"

const ErrorImg = styled.img`
  display: block;
  width: 250px;
  height: 250px;
  object-fit: contain;
  margin: 0 auto;
`

const ErrorMessage = () => {
    return (
        <ErrorImg src={imgError} alt="error" />
    )
}

export default ErrorMessage