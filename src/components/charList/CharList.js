import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

const CharList = (props) => {

  const [charList, setCharList] = useState([]);
  const [newItemLoading, setNewItemLoading] = useState([]);
  const [offset, setOffset] = useState(210);
  const [charEnded, setCharEnded] = useState(false);

  const {loading, error, getAllCharacters} = useMarvelService();

  useEffect(() => {
    onRequest(offset, true)
  }, []);

  const onRequest = (offset, initial) => {
    initial ? setNewItemLoading(false) : setNewItemLoading(true);
    getAllCharacters(offset)
    .then(onCharListLoaded)
  }
 
  const onCharListLoaded = (newCharList) => {
    let ended = false;

    if (newCharList.length < 9) {
      ended = true;
    }

    setCharList([...charList, ...newCharList]);
    setNewItemLoading(newItemLoading => false);
    setOffset(offset => offset + 9);
    setCharEnded(charEnded => ended);
  }

  const itemRefs = useRef([]); 

  const focusOnItem = (id) => {
    itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
    itemRefs.current[id].classList.add('char__item_selected');
    itemRefs.current[id].focus();
  }

  const spinner = loading && !newItemLoading ? <Spinner/> : null; 
  const errorMessage = !error ? null : <ErrorMessage />;

  const cards = charList.map((item, i) => {
    return (
      <li 
        className="char__item"
        key={item.id}
        onClick={() => {props.onCharSelected(item.id); focusOnItem(i);}}
        tabIndex={0}
        ref={(el) => itemRefs.current[i] = el}
        onKeyPress={(e) => {
          if (e.key === ' ' || e.key === "Enter") {
            props.onCharSelected(item.id);
            focusOnItem(i);
          }}}>
        <img className={(item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') ?
          'char__img--not-found' :
          'char__img'} 
          src={item.thumbnail} alt="#"/>
        <div className="char__name">{item.name}</div>
      </li>
    )
  });
  
  return (
    <div className="char__list">
      <ul className="char__grid">
        {errorMessage}
        {spinner}
        {cards}
      </ul>
      <button 
        className="button button__main button__long"
        disabled={newItemLoading}
        style={{'display': charEnded ? 'none' : 'block'}}
        onClick={() => onRequest(offset)}>
        <div className="inner">load more</div>
      </button>
    </div>
  )
}

CharList.propTypes = {
  onCharSelected: PropTypes.func
};

export default CharList;