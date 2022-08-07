import React, { useEffect, useState } from "react";
import { tvApi, moviesApi } from "../../api";
import popcorn from "../../assets/noPosterSmall.png";
import { Link } from "react-router-dom";
import "./search.css";
const Search = () => {
  const [movieResults, setMovieResults] = useState();
  const [tvResults, setTVResults] = useState();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState();
  const [error, setError] = useState();

  async function searchByTerm() {
    setLoading(true);
    try {
      const {
        data: { results: movieResults },
      } = await moviesApi.search(search);
      const {
        data: { results: tvResults },
      } = await tvApi.search(search);
      setMovieResults(movieResults);
      setTVResults(tvResults);
    } catch {
      setError("Can't find results.");
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if (search !== "") {
      searchByTerm();
    }
  };

  const updateTerm = (event) => {
    const {
      target: { value },
    } = event;
    setSearch(value);
  };

  return (
    <div>
      <form className="search-form mt-2" onSubmit={handleSubmit}>
        <input
          className="search-input"
          placeholder="Search Movies or TV Shows..."
          value={search}
          onChange={updateTerm}
        />
      </form>
      <>
        {movieResults && movieResults.length > 0 && (
          <Section title="Movie Results">
            {movieResults.map((movie) => (
              <Poster
                key={movie.id}
                id={movie.id}
                imageUrl={movie.poster_path}
                title={movie.original_title}
                rating={movie.vote_average}
                year={movie.release_date && movie.release_date.substring(0, 4)}
                isMovie={true}
              />
            ))}
          </Section>
        )}
        {tvResults && tvResults.length > 0 && (
          <Section title="TV Show Results">
            {tvResults.map((show) => (
              <Poster
                key={show.id}
                id={show.id}
                imageUrl={show.poster_path}
                title={show.original_name}
                rating={show.vote_average}
                year={
                  show.first_air_date && show.first_air_date.substring(0, 4)
                }
              />
            ))}
          </Section>
        )}
      </>
    </div>
  );
};

const Section = ({ title, children }) => {
  return (
    <div className="section-container mx-1">
      <span className="section-title">{title}</span>
      <div className="section-grid">{children}</div>
    </div>
  );
};

const Poster = ({ id, imageUrl, title, rating, year, isMovie = false }) => {
  return (
    <Link to={isMovie ? `/movie/${id}` : `/show/${id}`}>
      <div className="poster-container">
        <div className="poster-imgcontainer">
          <div
            className="poster-img"
            style={{
              backgroundImage: imageUrl
                ? `url(https://image.tmdb.org/t/p/w300${imageUrl})`
                : `url(${popcorn})`,
            }}
          />
          <span className="poster-rating">
            <span role="img" aria-label="rating">
              ⭐️
            </span>
            {rating}/10
          </span>
        </div>
        <span className="poster-title">
          {title.length > 15 ? `${title.substring(0, 15)}...` : title}
        </span>
        <span className="poster-year">{year}</span>
      </div>
    </Link>
  );
};

export default Search;
