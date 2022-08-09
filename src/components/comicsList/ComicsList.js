import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

import './comicsList.scss';

const ComicsList = (props) => {
  const {getAllComics, loading, error} = useMarvelService();

  const [comicsList, setComicsList] = useState([]);
  const [newItemLoading, setNewItemLoading] = useState([]);
  const [offset, setOffset] = useState(210);
  const [comicsEnded, setComicsEnded] = useState(false);

  useEffect(() => {
    onRequest(offset, true)
    // eslint-disable-next-line
  }, []);

  const onRequest = (offset, initial) => {
    initial ? setNewItemLoading(false) : setNewItemLoading(true);
    getAllComics(offset)
      .then(onComicstLoaded)
  }

  const onComicstLoaded = (newComicsList) => {
    let ended = false;

    if (newComicsList.length < 20) {
      ended = true;
    }


    setComicsList([...comicsList, ...newComicsList]);
    setNewItemLoading(false);
    setOffset(offset => offset + 20);
    setComicsEnded(ended);
  }

  const spinner = loading && !newItemLoading ? <Spinner/> : null; 
  const errorMessage = !error ? null : <ErrorMessage />;

  const itemRefs = useRef([]); 
  const focusOnItem = (id) => {
    itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
    itemRefs.current[id].classList.add('char__item_selected');
    itemRefs.current[id].focus();
  }

  const comicses = comicsList.map((item, i) => {
    return (
      <li 
        className="comics__item"
        key={i}
        tabIndex={0}
        ref={(el) => itemRefs.current[i] = el}
        onKeyPress={(e) => {
          if (e.key === ' ' || e.key === "Enter") {
            props.onCharSelected(item.id);
            focusOnItem(i);
          }}}>
        <Link to={`/react_advenced_marvel-portal/comics/${item.id}`}>
          <img src={item.thumbnail} alt="ultimate war" className="comics__item-img"/>
          <div className="comics__item-name">{item.title}</div>
          <div className="comics__item-price">{item.price}</div>
        </Link>
      </li>
    )
  });

  return (
    <div className="comics__list">
      <ul className="comics__grid">
        {comicses}
        {spinner}
        {errorMessage}
      </ul>
      <button 
        className="button button__main button__long"
        disabled={newItemLoading}
        style={{'display': comicsEnded ? 'none' : 'block'}}
        onClick={() => onRequest(offset)}
        >
        <div className="inner">load more</div>
      </button>
    </div>
  )
}

export default ComicsList;