import { useState, useEffect } from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';

import './comicsList.scss';

const ComicsList = () => {
  const [comics, setComics] = useState([]);
  const [offset, setOffset] = useState(210);
  const [newComicLoading, setNewComicLoading] = useState(false);
  const [comicEnded, setComicEnded] = useState(false);

  const { loading, error, getAllComics } = useMarvelService();

  useEffect(() => {
    onRequest(offset, true);
  }, []);

  const onRequest = (offset, initial) => {
    initial ? setNewComicLoading(false) : setNewComicLoading(true);

    getAllComics(offset).then(onComicsLoaded);
  };

  const onComicsLoaded = (newComics) => {
    let ended = false;

    if (newComics.length < 8) {
      ended = true;
    }

    setComics((comics) => [...comics, ...newComics]);
    setNewComicLoading(false);
    setOffset((offset) => offset + 8);
    setComicEnded(ended);
  };

  function renderComics(comics) {
    const comicsList = comics.map((comic, index) => {
      return (
        <li key={index} className="comics__item">
          <a href="#">
            <img
              src={comic.thumbnail}
              alt={comic.title}
              className="comics__item-img"
            />
            <div className="comics__item-name">{comic.title}</div>
            <div className="comics__item-price">{comic.price}</div>
          </a>
        </li>
      );
    });

    return <ul className="comics__grid">{comicsList}</ul>;
  }

  const comicsList = renderComics(comics);
  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading && !newComicLoading ? <Spinner /> : null;

  return (
    <div className="comics__list">
      {errorMessage}
      {spinner}
      {comicsList}
      <button
        className="button button__main button__long"
        disabled={newComicLoading}
        style={{ display: comicEnded ? 'none' : 'block' }}
        onClick={() => onRequest(offset)}
      >
        <div className="inner">load more</div>
      </button>
    </div>
  );
};

export default ComicsList;
