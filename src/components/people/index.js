import React, { useState, useEffect } from "react";
import service from "../../service/service";
import "./people.css";
import Swal from "sweetalert2";
import { BigHead } from "@bigheads/core";
import { getRandomOptions } from "../../utils/bigheadGen";

const People = ({ auth }) => {
  const [people, setPeople] = useState();
  const [isLogginIn, setIsLoggin] = useState(false);
  const [init, setInit] = useState(false);
  const findAllProfile = (id) => {
    service.findAllProfile().then((people) => {
      setPeople(people);
      setInit(true);
    });
  };

  useEffect(() => {
    async function userInfo() {
      await auth.onAuthStateChanged((user) => {
        findAllProfile();
        if (user) {
          setIsLoggin(true);
        }
      });
    }
    userInfo();
  }, []);

  const gotoProfile = (id) => {
    if (isLogginIn) {
      window.location.href = `/profile/${id}`;
    } else {
      Swal.fire({
        icon: "error",
        title: "You need to login to see resident's profile!!",
      }).then(() => {
        window.location.href = "/login";
      });
    }
  };

  return (
    <div className="people-container">
      <div className=" section-title">Connect to Your Neighbors</div>
      {init && (
        <div>
          <div className="section-grid mt-0">
            {people.map((elem) => {
              return (
                <p
                  className="person-container cursor-pointer mt-3"
                  onClick={() => {
                    gotoProfile(elem._id);
                  }}
                >
                  <Poster person={elem} />
                </p>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const Poster = ({ person }) => {
  var randomColor = "#" + (((1 << 24) * Math.random()) | 0).toString(16);

  const roleFinder = (role) => {
    switch (role) {
      case 1:
        return "student";
      case 2:
        return "professor";
      case 3:
        return "reviewer";
    }
  };

  return (
    <div className="poster-container">
      <div className="poster-imgcontainer">
        <div
          className="poster-img d-flex justify-content-center align-items-center"
          style={{ backgroundColor: `${randomColor}` }}
        >
          <BigHead {...getRandomOptions()} />
        </div>
      </div>
      <div className="d-flex flex-column align-items-center">
        <span className="poster-title fw-bold">{person.name}</span>
        <span className="poster-role text-capitalize">{`${roleFinder(
          person.role
        )}`}</span>
      </div>
    </div>
  );
};

export default People;
