import React, { useEffect, useState } from "react";
import { moviesApi, tvApi } from "../../api";
import { useParams } from "react-router-dom";
import "./detail.css";
import popcorn from "../../assets/noPosterSmall.png";
import service from "../../service/service";
const Detail = ({ auth }) => {
  const [isLoggin, setIsLoggin] = useState(false);
  const [init, setInit] = useState(false);
  const [result, setResult] = useState();
  const [isMovie, setIsMovie] = useState(
    window.location.pathname.includes("/movie/")
  );
  const [video, setVideo] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState();
  const [profile, setProfile] = useState();
  const [has, setHas] = useState(false);
  const [index, setIndex] = useState();

  const { id } = useParams();

  const findProfileById = (uid) => {
    service.findProfileById(uid).then((profile) => {
      setProfile(profile);
      if (profile.movieList.length > 0) {
        for (var i = 0; i < profile.movieList.length; i++) {
          if (profile.movieList[i].id == id) {
            setHas(true);
            setIndex(i);
          }
        }
      }
    });
  };

  const onClickAdd = () => {
    const newProfile = profile;
    const newMovie = {
      id: result.id,
      name: result.original_title
        ? result.original_title
        : result.original_name,
      year: result.release_date ? result.release_date : result.first_air_date,
      img: result.poster_path,
      type: isMovie ? 0 : 1,
    };
    newProfile.movieList.push(newMovie);
    service.handleFilm(newProfile);
    setHas(true);
  };

  const onClickRemove = () => {
    const newProfile = profile;
    newProfile.movieList.splice(index, 1);
    service.handleFilm(newProfile);
    setHas(false);
  };

  useEffect(() => {
    async function getFilmDetail() {
      const parsedId = parseInt(id);
      if (isNaN(parsedId)) {
        window.location.href = "/";
      }
      let result = null;
      let video = null;
      try {
        if (isMovie) {
          const detailRequest = await moviesApi.movieDetail(parsedId);
          result = detailRequest.data;
          setResult(result);
          const videoRequest = await moviesApi.movieVideo(parsedId);
          video = videoRequest.data;

          setVideo(video);
        } else {
          const detailRequest = await tvApi.showDetail(parsedId);
          result = detailRequest.data;
          setResult(result);
          const videoRequest = await tvApi.tvVideo(parsedId);
          video = videoRequest.data;
          setVideo(video);
        }
      } catch {
        setError("Can't find anything.");
      } finally {
        setLoading(false);
        setResult(result);
      }
    }
    async function userInfo() {
      await auth.onAuthStateChanged((user) => {
        if (user) {
          setIsLoggin(true);
          const uid = user.uid;
          findProfileById(uid);
          setInit(true);
        } else {
          setIsLoggin(false);
        }
      });
    }
    getFilmDetail();
    userInfo();
  }, []);

  return (
    loading == false && (
      <div className="detail-container">
        <div
          className="detail-backdrop"
          style={{
            backgroundImage: result.backdrop_path
              ? `url(https://image.tmdb.org/t/p/original${result.backdrop_path})`
              : `url(${popcorn})`,
          }}
        />
        <div className="detail-content">
          <div
            className="detail-cover d-none d-lg-block "
            style={{
              backgroundImage: result.poster_path
                ? `url(https://image.tmdb.org/t/p/original${result.poster_path})`
                : `url(${popcorn})`,
            }}
          />
          <div className="detail-data px-3">
            <div className="d-flex align-items-center">
              <h3 className="detail-title">
                {result.original_title
                  ? result.original_title
                  : result.original_name}
              </h3>
              {isLoggin && (
                <div className="col-2 mx-3 d-none d-lg-block">
                  {has ? (
                    <button
                      className="btn btn-danger  w-100 d-flex align-items-center justify-content-center cursor-pointer"
                      onClick={() => {
                        onClickRemove();
                      }}
                    >
                      Remove from List
                    </button>
                  ) : (
                    <button
                      className="btn btn-danger  w-100 d-flex align-items-center justify-content-center cursor-pointer"
                      onClick={() => {
                        onClickAdd();
                      }}
                    >
                      Add to List
                    </button>
                  )}
                </div>
              )}
            </div>
            <div className="detail-itemcontainer">
              <span className="detail-item">
                {result.release_date
                  ? result.release_date.substring(0, 4)
                  : result.first_air_date.substring(0, 4)}
              </span>
              <span className="detail-divider">•</span>
              <span className="detail-item">
                {result.runtime ? result.runtime : result.episode_run_time[0]}{" "}
                min
              </span>
              <span className="detail-divider">•</span>
              <span className="detail-item">
                {result.genres &&
                  result.genres.map((genre, index) =>
                    index === result.genres.length - 1
                      ? genre.name
                      : `${genre.name} / `
                  )}
              </span>
              <span className="detail-divider">•</span>
              <span className="detail-item">
                {result.vote_average ? `⭐️${result.vote_average}/10` : ``}
              </span>
            </div>
            <p className="detail-overview">{result.overview}</p>
            <div className="pt-4 d-none d-md-block">
              {video.results.length > 0 && (
                <div className="video-responsive ">
                  <iframe
                    width="560"
                    height="315"
                    src={`https://www.youtube.com/embed/${video.results[0].key}`}
                    title="YouTube video player"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default Detail;
