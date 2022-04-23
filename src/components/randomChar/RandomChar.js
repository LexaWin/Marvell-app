import { useState, useEffect } from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';

const RandomChar = () => {
  const [char, setChar] = useState(null);

  const { loading, error, getCharacter, clearError } = useMarvelService();

  let timerId;

  useEffect(() => {
    updateChar();

    timerId = setInterval(updateChar, 60000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  const onCharLoaded = (char) => {
    const MAX_LENGTH = 210;

    const description = char.description
      ? char.description.length > MAX_LENGTH
        ? `${char.description.slice(0, MAX_LENGTH)}...`
        : char.description
      : 'There is no description for this character.';

    setChar({ ...char, description });
  };

  const updateChar = () => {
    clearError();

    const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
    // const id = 1011006;
    // if (Math.random() > 0.5) id = 1011245; // error char

    getCharacter(id).then(onCharLoaded);
  };

  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading ? <Spinner /> : null;
  const content = !(loading || error || !char) ? <View char={char} /> : null;

  return (
    <div className="randomchar">
      {errorMessage}
      {spinner}
      {content}
      <div className="randomchar__static">
        <p className="randomchar__title">
          Random character for today!
          <br />
          Do you want to get to know him better?
        </p>
        <p className="randomchar__title">Or choose another one</p>
        <button className="button button__main" onClick={updateChar}>
          <div className="inner">try it</div>
        </button>
        <img src={mjolnir} alt="mjolnir" className="randomchar__decoration" />
      </div>
    </div>
  );
};

const View = ({ char }) => {
  const { name, description, thumbnail, homepage, wiki } = char;

  let thumbClassName = 'randomchar__img';

  if (thumbnail.endsWith('image_not_available.jpg')) {
    thumbClassName += ' randomchar__img-not-available';
  }

  return (
    <div className="randomchar__block">
      <img src={thumbnail} alt="Random character" className={thumbClassName} />
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
  );
};

export default RandomChar;
