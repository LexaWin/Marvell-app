import { useHttp } from '../hooks/http.hook';

const useMarvelService = () => {
  const { loading, request, error, clearError } = useHttp();

  const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
  const _apiKey = 'apikey=7ce5011319e205a0723c48d43ca3ee56';
  const _baseOffset = 210;

  const getAllCharacters = async (offset = _baseOffset) => {
    const res = await request(
      `${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`
    );

    return res.data.results.map(_transformCharacter);
  };

  const getCharacter = async (id) => {
    const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);

    return _transformCharacter(res.data.results[0]);
  };

  const _transformCharacter = (char) => ({
    id: char.id,
    name: char.name,
    description: char.description,
    thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
    homepage: char.urls[0].url,
    wiki: char.urls[1].url,
    comics: char.comics.items,
  });

  const getAllComics = async (offset = _baseOffset) => {
    const res = await request(
      `${_apiBase}comics?limit=8&offset=${offset}&${_apiKey}`
    );

    return res.data.results.map(_transformComic);
  };

  const _transformComic = (comic) => ({
    id: comic.id,
    title: comic.title,
    description: comic.description || 'There is no description',
    pageCount: comic.pageCount
      ? `${comic.pageCount} p.`
      : 'No information about the number of pages',
    thumbnail: comic.thumbnail.path + '.' + comic.thumbnail.extension,
    language: comic.textObjects.language || 'en-us',
    price: comic.prices[0].price
      ? `${comic.prices[0].price}$`
      : 'not available',
  });

  return {
    loading,
    error,
    clearError,
    getAllCharacters,
    getCharacter,
    getAllComics,
  };
};

export default useMarvelService;
