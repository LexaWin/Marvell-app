import { useState, useEffect, useRef } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import PropTypes from 'prop-types';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';

import './charList.scss';

const CharList = (props) => {
  const [charList, setCharList] = useState([]);
  const [newItemLoading, setNewItemLoading] = useState(false);
  const [offset, setOffset] = useState(210);
  const [charEnded, setCharEnded] = useState(false);

  const { loading, error, getAllCharacters } = useMarvelService();

  useEffect(() => {
    onRequest(offset, true);
  }, []);

  const onRequest = (offset, initial) => {
    initial ? setNewItemLoading(false) : setNewItemLoading(true);

    getAllCharacters(offset).then(onCharListLoaded);
  };

  const onCharListLoaded = (newCharList) => {
    let ended = false;

    if (newCharList.length < 9) {
      ended = true;
    }

    setCharList((charList) => [...charList, ...newCharList]);
    setNewItemLoading(false);
    setOffset((offset) => offset + 9);
    setCharEnded(ended);
  };

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
        <CSSTransition key={char.id} timeout={500} classNames="char__item">
          <li
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
        </CSSTransition>
      );
    });

    return (
      <ul className="char__grid">
        <TransitionGroup component={null}>{charactersList}</TransitionGroup>
      </ul>
    );
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

  const charactersList = renderCharacters(charList);

  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading && !newItemLoading ? <Spinner /> : null;

  return (
    <div className="char__list">
      {errorMessage}
      {spinner}
      {charactersList}
      <button
        className="button button__main button__long"
        disabled={newItemLoading}
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
