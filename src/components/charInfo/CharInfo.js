import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Sceleton from '../skeleton/Skeleton';
import useMarvelService from '../../services/MarvelService';

import './charInfo.scss';

const CharInfo = (props) => {
  const [char, setChar] = useState(null);

  const { loading, error, getCharacter, clearError } = useMarvelService();

  useEffect(() => {
    updateChar();
  }, [props.charId]);

  const updateChar = () => {
    if (!props.charId) return;

    clearError();

    getCharacter(props.charId).then(onCharLoaded);
  };

  const onCharLoaded = (char) => {
    const MAX_COMICS_COUNT = 10;
    const comics = char.comics.slice(0, MAX_COMICS_COUNT);

    if (!comics.length)
      comics.push({
        name: 'There are no comics for this character.',
      });

    setChar(() => ({ ...char, comics }));
  };

  const sceleton = char || loading || error ? null : <Sceleton />;
  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading ? <Spinner /> : null;
  const content = !(loading || error || !char) ? <View char={char} /> : null;

  return (
    <div className="char__info">
      {sceleton}
      {errorMessage}
      {spinner}
      {content}
    </div>
  );
};

const View = ({ char }) => {
  const { name, description, thumbnail, homepage, wiki, comics } = char;

  let thumbClassName = 'char__basics__img';

  if (thumbnail.endsWith('image_not_available.jpg')) {
    thumbClassName += ' char__basics__img-not-available';
  }

  return (
    <>
      <div className="char__basics">
        <img src={thumbnail} alt={name} className={thumbClassName} />
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
      <div className="char__descr">{description}</div>
      <div className="char__comics">Comics:</div>
      <ul className="char__comics-list">
        {comics.map((item, index) => {
          return (
            <li key={index} className="char__comics-item">
              {item.name}
            </li>
          );
        })}
      </ul>
    </>
  );
};

CharInfo.propTypes = {
  charId: PropTypes.number,
};

export default CharInfo;
