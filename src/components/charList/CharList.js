import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';

import './charList.scss';

const CharList = (props) => {
  const [characters, setCharacters] = useState([]);
  const [newCharLoading, setNewCharLoading] = useState(false);
  const [offset, setOffset] = useState(210);
  const [charEnded, setCharEnded] = useState(false);

  const { loading, error, getAllCharacters } = useMarvelService();

  useEffect(() => {
    onRequest(offset, true);
  }, []);

  const onRequest = (offset, initial) => {
    initial ? setNewCharLoading(false) : setNewCharLoading(true);

    getAllCharacters(offset).then(onCharactersLoaded);
  };

  const onCharactersLoaded = (newCharacters) => {
    let ended = false;

    if (newCharacters.length < 9) {
      ended = true;
    }

    setCharacters((characters) => [...characters, ...newCharacters]);
    setNewCharLoading(false);
    setOffset((offset) => offset + 9);
    setCharEnded(ended);
  };

  console.log('charList!');

  const charRefs = useRef([]);

  const onCharFocus = (id) => {
    charRefs.current.forEach((ref) =>
      ref.classList.remove('char__item_selected')
    );
    charRefs.current[id].classList.add('char__item_selected');
    charRefs.current[id].focus();
  };

  function renderCharacters(characters) {
    const charactersList = characters.map((char, index) => {
      let thumbClassName = 'char__item_img';

      if (char.thumbnail.endsWith('image_not_available.jpg')) {
        thumbClassName += ' char__item_img-not-available';
      }

      return (
        <li
          key={index}
          className="char__item"
          onClick={() => onCharClick(char.id, index)}
          onKeyDown={(e) => onCharKeyDown(e, char.id, index)}
          tabIndex="0"
          ref={(el) => (charRefs.current[index] = el)}
        >
          <img
            src={char.thumbnail}
            alt={char.name}
            className={thumbClassName}
          />
          <div className="char__name">{char.name}</div>
        </li>
      );
    });

    return <ul className="char__grid">{charactersList}</ul>;
  }

  const onCharClick = (id, index) => {
    props.onCharSelected(id);
    onCharFocus(index);
  };

  const onCharKeyDown = (e, id, index) => {
    if ([' ', 'Enter'].includes(e.key)) {
      e.preventDefault();
      onCharClick(id, index);
    }
  };

  const charactersList = renderCharacters(characters);

  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading && !newCharLoading ? <Spinner /> : null;

  return (
    <div className="char__list">
      {errorMessage}
      {spinner}
      {charactersList}
      <button
        className="button button__main button__long"
        disabled={newCharLoading}
        style={{ display: charEnded ? 'none' : 'block' }}
        onClick={() => onRequest(offset)}
      >
        <div className="inner">load more</div>
      </button>
    </div>
  );
};

CharList.propTypes = {
  onCharSelected: PropTypes.func.isRequired,
};

export default CharList;
