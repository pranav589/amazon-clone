import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SearchIcon } from "../icons";
import { GlobalState } from "../../GlobalState";

const Search = () => {
  const navigate = useNavigate();
  const state = useContext(GlobalState);
  const [search, setSearch] = state.productsAPI.search;

  return (
    <div className="navbar__search">
      <input
        type="text"
        className="navbar__search-input"
        value={search}
        placeholder="Enter your search"
        onChange={(e) => setSearch(e.target.value.toLowerCase())}
      />
      <SearchIcon className="navbar__search-icon" />
    </div>
  );
};

export default Search;
