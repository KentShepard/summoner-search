import React from 'react';
import { Link } from 'react-router-dom';

var Search = ({searchBar, searchName, nameChange, handleEnterKeyPress}) => (
  <div className="search-bar form-inline row justify-content-md-center">
    <input className="form-control search-bar" type="text" onChange={(e) => nameChange(e.target.value)} placeholder="Summoner name..." value={searchBar} onKeyPress={handleEnterKeyPress}/>
    <button className="btn btn-outline-primary" type="button" onClick={searchName}><Link to={{pathname: `/summoner/${searchBar}`}}>Search</Link></button>
  </div>
);

export default Search;