import { useHttp } from "../Hooks/http.hook";

const useMarvelService = () => {
  const {error, request, loading, clearError} = useHttp();

  const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
  const _apiKey = 'apikey=bbef4af878433fee15d01951e47ced3d';
  const _baseOffset = 210;

  const getAllCharacters = async (offset = _baseOffset) => {
    const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
    return res.data.results.map(_transformCharacter)
  }

  const getCharacter = async (id) => {
    const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
    return _transformCharacter(res.data.results[0]);
  }

  const getAllComics = async (offset = 210) => {
    const res = await request(`${_apiBase}comics?orderBy=issueNumber&offset=${offset}&${_apiKey}`);
    return res.data.results.map(_transformComics);
  }

  const getComics = async (id) => {
    const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
    return _transformComics(res.data.results[0]);
  }

  const _transformCharacter = (char) => {
    return {
      id: char.id,
      name: char.name,
      description: char.description,
      thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
      homepage: char.urls[0].url,
      wiki: char.urls[1].url,
      comics: char.comics.items
    };
  }

  const _transformComics = (comics) => {
    return {
      id: comics.id,
      src: comics.urls[0].url,
      thumbnail: comics.thumbnail.path + '.' + comics.thumbnail.extension,
      title: comics.title,
      description: comics.description || 'There is not description',
      pageCount: comics.pageCount ? `${comics.pageCount} p.` : 'No information about the number of pages',
      language: comics.textObjects.language || 'en-us',
      price: comics.prices.price ? `${comics.prices[0].price}$` : 'not available'
    };
  }

  return {loading, error, getAllCharacters, getCharacter, clearError, getAllComics, getComics}
}

export default useMarvelService;