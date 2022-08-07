import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./home.css";
import { moviesApi, tvApi } from "../../api";
import popcorn from "../../assets/noPosterSmall.png";

const Home = () => {
  const [nowPlaying, setNowPlaying] = useState();
  const [popular, setPopular] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState();
  const [popularTV, setPopularTV] = useState();
  const [topRated, setTopRated] = useState();

  useEffect(() => {
    async function fetchMovieApi() {
      try {
        const {
          data: { results: nowPlaying },
        } = await moviesApi.nowPlaying();
        const {
          data: { results: popular },
        } = await moviesApi.popular();
        setNowPlaying(nowPlaying);
        setPopular(popular);
      } catch {
        setError("Can't find movie information.");
      } finally {
        setLoading(false);
      }
    }

    async function fetchTVApi() {
      try {
        const {
          data: { results: topRated },
        } = await tvApi.topRated();
        const {
          data: { results: popularTV },
        } = await tvApi.popular();
        setTopRated(topRated);
        setPopularTV(popularTV);
      } catch {
        setError("Can't find movie information.");
      } finally {
        setLoading(false);
      }
    }
    fetchMovieApi();
    fetchTVApi();
  }, []);

  return (
    <>
      <div className="home-container">
        {nowPlaying && nowPlaying.length > 0 && (
          <Section title="Now Playing">
            {nowPlaying.map((movie) => (
              <Poster
                key={movie.id}
                id={movie.id}
                imageUrl={movie.poster_path}
                title={movie.original_title}
                rating={movie.vote_average}
                year={movie.release_date.substring(0, 4)}
                isMovie={true}
              />
            ))}
          </Section>
        )}
        {popular && popular.length > 0 && (
          <Section title="Popular Movies">
            {popular.map((movie) => (
              <Poster
                key={movie.id}
                id={movie.id}
                imageUrl={movie.poster_path}
                title={movie.original_title}
                rating={movie.vote_average}
                year={movie.release_date.substring(0, 4)}
                isMovie={true}
              />
            ))}
          </Section>
        )}
        {topRated && topRated.length > 0 && (
          <Section title="Top Rated Shows">
            {topRated.map((show) => (
              <Poster
                key={show.id}
                id={show.id}
                imageUrl={show.poster_path}
                title={show.original_name}
                rating={show.vote_average}
                year={show.first_air_date.substring(0, 4)}
              />
            ))}
          </Section>
        )}
        {popularTV && popularTV.length > 0 && (
          <Section title="Popular Shows">
            {popularTV.map((show) => (
              <Poster
                key={show.id}
                id={show.id}
                imageUrl={show.poster_path}
                title={show.original_name}
                rating={show.vote_average}
                year={show.first_air_date.substring(0, 4)}
              />
            ))}
          </Section>
        )}
      </div>
    </>
  );
};

const Section = ({ title, children }) => {
  return (
    <div className="section-container">
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

export default Home;
