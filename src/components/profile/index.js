import React, { useEffect, useState } from "react";
import "./profile.css";
import service from "../../service/service";
import { useParams } from "react-router-dom";
import { BigHead } from "@bigheads/core";
import { getRandomOptions } from "../../utils/bigheadGen";
import popcorn from "../../assets/noPosterSmall.png";
import { Modal } from "react-bootstrap";
import Swal from "sweetalert2";
const Profile = ({ auth }) => {
  const [profile, setProfile] = useState();
  const [initProfile, setInitProfile] = useState(false);
  const [initUser, setInitUser] = useState(false);
  const [user, setUser] = useState();
  const [follow, setFollow] = useState(false);
  const [followerIndex, setFollowerIndex] = useState();
  const [followingIndex, setFollowingIndex] = useState();
  const [chatMode, setChatMode] = useState(false);
  const [newChat, setNewChat] = useState(true);
  const [chatId, setChatId] = useState();
  const [chatData, setChatData] = useState();
  const [text, setText] = useState("");
  const { id } = useParams();

  const [face, setFace] = useState(<BigHead {...getRandomOptions()} />);

  const findProfileById = (id, uid) => {
    service.findProfileById(id).then((profile) => {
      if (profile === null) {
        window.location.href = "/";
      } else {
        setProfile(profile);
        if (profile.followers.length > 0) {
          for (var i = 0; i < profile.followers.length; i++) {
            if (profile.followers[i].id == uid) {
              setFollow(true);
              setFollowerIndex(i);
            }
          }
        }
        setInitProfile(true);
      }
    });
  };

  const findUserById = (uid) => {
    service.findProfileById(uid).then((user) => {
      if (user === null) {
        window.location.href = "/";
      } else {
        setUser(user);
        if (user.followings.length > 0) {
          for (var i = 0; i < user.followings.length; i++) {
            if (user.followings[i].id == id) {
              setFollow(true);
              setFollowingIndex(i);
            }
          }
        }
        if (user.chats.length > 0) {
          for (var i = 0; i < user.chats.length; i++) {
            if (user.chats[i].receiver == id || user.chats[i].sender == id) {
              setNewChat(false);
              setChatId(user.chats[i]._id);
              service.findChatById(user.chats[i]._id).then((data) => {
                setChatData(data);
              });
            }
          }
        }
        setInitUser(true);
      }
    });
  };

  const onClickSendChat = () => {
    const newChat = chatData;
    debugger;
    const Chat = {
      chat: text,
      sender: user._id,
      receiver: profile._id,
    };
    newChat.conversation.push(Chat);
    service.sendChat(newChat);
    setText("");
    setChatData(newChat);
  };

  const onClickFollow = () => {
    const newProfile = profile;
    const newFollower = {
      id: user._id,
      name: user.name,
      role: user.role,
    };
    newProfile.followers.push(newFollower);
    service.handleFollower(newProfile);

    const newUser = user;
    const newFollowing = {
      id: profile._id,
      name: profile.name,
      role: user.role,
    };
    newUser.followings.push(newFollowing);
    service.handleFollowing(newUser);
    setFollow(true);
  };

  const onClickChatStart = () => {
    const newUser = user;
    const newProfile = profile;
    const newChatforUser = {
      _id: Math.floor(Math.random() * 9999999).toString(),
      sender: user._id,
      receiver: profile._id,
    };

    service.createChat(newChatforUser);
    newUser.chats.push(newChatforUser);

    service.handleChat(newUser);
    newProfile.chats.push(newChatforUser);

    service.handleChat(newProfile);
    setNewChat(false);

    service.findChatById(newChatforUser._id).then((data) => {
      setChatData(data);
    });
  };

  const onClickUnFollow = () => {
    const newProfile = profile;
    newProfile.followers.splice(followerIndex, 1);
    service.handleFollower(newProfile);

    const newUser = user;
    newUser.followings.splice(followingIndex, 1);
    service.handleFollowing(newUser);

    setFollow(false);
  };

  useEffect(() => {
    async function userInfo() {
      await auth.onAuthStateChanged((user) => {
        if (!user) {
          window.location.href = "/";
        } else {
          findUserById(user.uid);
          findProfileById(id, user.uid);
        }
      });
    }
    userInfo();
  }, []);

  return (
    <div className="m-4">
      {initProfile && initUser && (
        <div>
          <div>
            <ProfileHeader
              face={face}
              user={user}
              profile={profile}
              id={id}
              follow={follow}
              chatMode={chatMode}
              setChatMode={setChatMode}
              onClickFollow={onClickFollow}
              onClickUnFollow={onClickUnFollow}
            />
          </div>
          {chatMode == false ? (
            <>
              <div className="mt-3">
                <ProfileBrowser profile={profile} />
              </div>
              <div>
                <ProfileDetail profile={profile} user={user} id={id} />
              </div>
            </>
          ) : (
            <div className="mt-4">
              <ChattingRoom
                user={user}
                chatData={chatData}
                onClickChatStart={onClickChatStart}
                onClickSendChat={onClickSendChat}
                newChat={newChat}
                setText={setText}
                text={text}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ChattingRoom = ({
  chatData,
  newChat,
  onClickChatStart,
  onClickSendChat,
  text,
  setText,
  user,
}) => {
  return (
    <div className="chatting-container">
      <div className="chatting-content-container" id="scroll-style">
        {newChat ? (
          <div className="d-flex h-100 justify-content-center align-items-center">
            <button
              className="btn btn-danger follow-btn"
              onClick={() => {
                onClickChatStart();
              }}
            >
              Start Chatting
            </button>
          </div>
        ) : (
          <div>
            {chatData !== undefined && (
              <>
                <div>
                  {chatData.conversation.map((elem) => {
                    if (user._id !== elem.sender) {
                      return (
                        <div className="d-flex">
                          <div className="receiving-chat">{elem.chat}</div>
                        </div>
                      );
                    } else {
                      return (
                        <div className="d-flex justify-content-end">
                          <div className="sending-chat">{elem.chat}</div>
                        </div>
                      );
                    }
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </div>
      <div className="chatting-input-container">
        <div className="d-flex justify-content-center align-items-center mx-2">
          <form className="w-100 d-flex">
            <input
              className="form-control"
              placeholder="Type your message"
              value={text}
              onChange={(e) => {
                setText(e.target.value);
              }}
            />
            <button
              className="btn btn-success follow-btn ms-3"
              disabled={newChat == true || text == ""}
              onClick={() => {
                onClickSendChat();
              }}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const ProfileHeader = ({
  face,
  user,
  profile,
  id,
  follow,
  chatMode,
  onClickFollow,
  onClickUnFollow,
  setChatMode,
}) => {
  return (
    <div className="d-flex">
      <div className="profile-avatar">{face}</div>
      <div className="d-flex align-items-baseline flex-column justify-content-end">
        <span className="profile-name fw-bold mb-1">{profile.name}</span>
        <div className="profile-year mb-2">
          <span>Member Since {profile.date.substring(0, 4)}</span>
        </div>
        <div>
          {user._id !== id && (
            <>
              <div className="d-flex">
                <button
                  className="btn btn-success follow-btn me-2"
                  onClick={() => {
                    setChatMode(!chatMode);
                  }}
                >
                  Chat
                </button>
                {follow ? (
                  <button
                    className="btn btn-danger follow-btn"
                    onClick={() => {
                      onClickUnFollow();
                    }}
                  >
                    Unfollow
                  </button>
                ) : (
                  <button
                    className="btn btn-danger follow-btn"
                    onClick={() => {
                      onClickFollow();
                    }}
                  >
                    Follow
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const ProfileBrowser = ({ profile }) => {
  const [tab, setTab] = useState("followers");
  const onClickTab = (name) => {
    setTab(name);
  };

  const tabs = ["followers", "followings", "favorites"];
  const profileTabInfo = [
    {
      key: "followers",
      contents: <ProfileFollowerCard profile={profile} />,
    },
    {
      key: "followings",
      contents: <ProfileFollowingCard profile={profile} />,
    },
    {
      key: "favorites",
      contents: <MovieCard profile={profile} />,
    },
  ];

  return (
    <div className="mt-4 pt-2">
      <div>
        {tabs.map((elem) => {
          return (
            <button
              name={elem}
              className={`text-capitalize profile-btn ${
                elem == tab && "selected"
              }`}
              onClick={(e) => {
                onClickTab(e.target.name);
              }}
            >
              {elem}
            </button>
          );
        })}
      </div>
      <div className="profile-info-container" id="scroll-style">
        {profileTabInfo.map((elem) => {
          return <div>{elem.key === tab && elem.contents}</div>;
        })}
      </div>
    </div>
  );
};

const ProfileDetail = ({ profile, user, id }) => {
  const [show, setShow] = useState(false);

  const [profilename, setProfileName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone);
  const [role, setRole] = useState(profile.role);
  const [birthDate, setBirthdate] = useState(profile.birthDate);
  const [city, setCity] = useState(profile.city);
  const [state, setState] = useState(profile.state);
  const [country, setCountry] = useState(profile.country);
  const [school, setSchool] = useState(profile.school);
  const [company, setCompany] = useState(profile.company);
  const [description, setDescription] = useState(profile.description);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
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

  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;
    debugger;
    if (name == "name") {
      setProfileName(value);
    } else if (name === "phone") {
      setPhone(value);
    } else if (name === "role") {
      console.log(parseInt(value));
      setRole(value);
    } else if (name === "birthday") {
      setBirthdate(value);
    } else if (name === "city") {
      setCity(value);
    } else if (name === "state") {
      setState(value);
    } else if (name === "country") {
      setCountry(value);
    } else if (name === "school") {
      setSchool(value);
    } else if (name === "company") {
      setCompany(value);
    } else if (name === "description") {
      setDescription(value);
    }
  };

  const physicalAddress = () => {
    if (
      profile.city == null &&
      profile.state == null &&
      profile.country == null
    ) {
      return "has not defined yet";
    } else {
      return `${profile.city !== null && profile.city + " ·"} ${
        profile.state !== null && profile.state + " ·"
      } ${profile.country !== null && profile.country}`;
    }
  };

  const onSubmitChange = () => {
    const copyProfile = profile;
    const editProfile = {
      ...copyProfile,
      name: profilename,
      role: role,
      birthdate: birthDate,
      phone: phone,
      city: city,
      state: state,
      country: country,
      school: school,
      company: company,
      description: description,
    };
    service.editProfile(editProfile);
    handleClose();
    Swal.fire({
      icon: "success",
      title: "Your change has been made",
    }).then(() => {
      window.location.reload();
    });
  };

  return (
    <div className="mt-4 account-detail-container">
      <h1 className="fw-bold account-title">Account Detail</h1>
      <div className="d-flex mt-3 mb-2">
        <div className="col-3 fw-bold account-sub">Email</div>
        <div className="col-4 account-data">{profile.email}</div>
      </div>

      {profile.phone !== null && (
        <div className="d-flex mt-2">
          <div className="col-3 fw-bold account-sub">Phone</div>
          <div className="col-4 text-capitalize account-data">
            {profile.phone}
          </div>
        </div>
      )}

      {profile.birthdate !== null && (
        <div className="d-flex mt-2">
          <div className="col-3 fw-bold account-sub">Birthday</div>
          <div className="col-4 text-capitalize account-data">
            {profile.birthdate.substring(0, 10)}
          </div>
        </div>
      )}

      <div className="d-flex mt-2">
        <div className="col-3 fw-bold account-sub">Address</div>
        <div className="col-4 text-capitalize account-data">
          {physicalAddress()}
        </div>
      </div>

      <div className="d-flex mt-2">
        <div className="col-3 fw-bold account-sub">Role</div>
        <div className="col-4 text-capitalize account-data">
          {roleFinder(profile.role)}
        </div>
      </div>

      {(profile.role == 1 || profile.role == 2) && profile.school !== null && (
        <div className="d-flex mt-2">
          <div className="col-3 fw-bold account-sub">School</div>
          <div className="col-4 text-capitalize account-data">
            {profile.school}
          </div>
        </div>
      )}

      {profile.role == 3 && profile.company !== null && (
        <div className="d-flex mt-2">
          <div className="col-3 fw-bold account-sub">Company</div>
          <div className="col-4 text-capitalize account-data">
            {profile.company}
          </div>
        </div>
      )}

      <div className="d-flex mt-2">
        <div className="col-3 fw-bold account-sub">Description</div>
        <div className="col-4 account-data">{profile.description}</div>
      </div>

      <div className="d-flex justify-content-end">
        <div>
          <u className="cursor-pointer privacy-link">
            <a href="/privacy">Privacy Policy</a>
          </u>
        </div>
      </div>
      <div className="d-flex justify-content-end">
        {user._id == id && (
          <button
            className="btn btn-danger profile-edit-btn d-flex justify-content-center align-items-center"
            onClick={handleShow}
          >
            Edit Profile
          </button>
        )}
      </div>

      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <div className="detail-modal">
          <Modal.Header closeButton>
            <Modal.Title>Edit Profile</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="d-flex align-items-center col-6">
                <div className="edit-label me-2">Name</div>
                <input
                  className="form-control"
                  name="name"
                  type="text"
                  value={profilename}
                  placeholder="Name"
                  required
                  onChange={onChange}
                />
              </div>
              <div className="d-flex align-items-center  col-6">
                <div className="edit-label me-2">Role</div>
                <select
                  className="form-control cursor-pointer"
                  name="role"
                  onChange={onChange}
                >
                  <option selected disabled hidden>
                    Choose here
                  </option>
                  <option value="1">Student</option>
                  <option value="2">Professor</option>
                  <option value="3">Reviewer</option>
                </select>
              </div>
            </div>
            <div className="row">
              {role == 3 ? (
                <div className="d-flex  flex-column col-4">
                  <div className="edit-label my-2">Company</div>
                  <input
                    className="form-control"
                    name="company"
                    type="text"
                    value={company}
                    placeholder="Company"
                    required
                    onChange={onChange}
                  />
                </div>
              ) : (
                <div className="d-flex  flex-column col-4">
                  <div className="edit-label my-2">School</div>
                  <input
                    className="form-control"
                    name="school"
                    type="text"
                    value={school}
                    placeholder="School"
                    required
                    onChange={onChange}
                  />
                </div>
              )}
              <div className="d-flex  flex-column col-4">
                <div className="edit-label my-2">Phone Number</div>
                <input
                  className="form-control"
                  name="phone"
                  type="tel"
                  value={phone}
                  placeholder="Phone Number"
                  required
                  onChange={onChange}
                />
              </div>
              <div className="d-flex  flex-column col-4">
                <div className="edit-label my-2">Birthday</div>
                <input
                  className="form-control"
                  name="birthday"
                  type="date"
                  value={birthDate}
                  required
                  onChange={onChange}
                />
              </div>
            </div>
            <div className="row">
              <div className="d-flex flex-column col-4">
                <div className="edit-label my-2">City</div>
                <input
                  className="form-control"
                  name="city"
                  type="text"
                  value={city}
                  placeholder="City"
                  required
                  onChange={onChange}
                />
              </div>
              <div className="d-flex  flex-column col-4">
                <div className="edit-label my-2">State</div>
                <input
                  className="form-control"
                  name="state"
                  type="text"
                  value={state}
                  placeholder="State"
                  required
                  onChange={onChange}
                />
              </div>
              <div className="d-flex  flex-column col-4">
                <div className="edit-label my-2"> Country</div>
                <input
                  className="form-control"
                  name="country"
                  type="text"
                  value={country}
                  placeholder="Country"
                  required
                  onChange={onChange}
                />
              </div>
            </div>

            <div className="d-flex flex-column">
              <div className="edit-label my-2">Description</div>
              <textarea
                className="form-control profile-edit-textbox"
                value={description}
                name="description"
                placeholder="Describe your self in here ..."
                onChange={onChange}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <div className="d-flex justify-content-end">
              <button
                className="m-2 btn btn-secondary profile-edit-btn d-flex justify-content-center align-items-center"
                onClick={handleClose}
              >
                Cancel Change
              </button>
              <button
                className="m-2 btn btn-danger profile-edit-btn d-flex justify-content-center align-items-center"
                onClick={onSubmitChange}
              >
                Save Changes
              </button>
            </div>
          </Modal.Footer>
        </div>
      </Modal>
    </div>
  );
};

const ProfileFollowerCard = ({ profile }) => {
  const gotoProfile = (id) => {
    window.location.href = `/profile/${id}`;
  };

  return (
    <div className="section-grid mt-0">
      {profile.followers.map((elem) => {
        return (
          <p
            className="person-container cursor-pointer mt-3 mx-2"
            onClick={() => {
              gotoProfile(elem.id);
            }}
          >
            <Poster person={elem} />
          </p>
        );
      })}
    </div>
  );
};

const ProfileFollowingCard = ({ profile }) => {
  const gotoProfile = (id) => {
    window.location.href = `/profile/${id}`;
  };

  return (
    <div className="section-grid mt-0">
      {profile.followings.map((elem) => {
        return (
          <p
            className="person-container cursor-pointer mt-3 mx-2"
            onClick={() => {
              gotoProfile(elem.id);
            }}
          >
            <Poster person={elem} />
          </p>
        );
      })}
    </div>
  );
};

const MovieCard = ({ profile }) => {
  return (
    <div>
      {profile.movieList.length > 0 && (
        <div className="section-grid mt-3">
          {profile.movieList.map((movie) => {
            return (
              <p className="mx-2 cursor-pointer card-container">
                <a
                  href={
                    movie.type === 0
                      ? `/movie/${movie.id}`
                      : `/show/${movie.id}`
                  }
                >
                  <div>
                    <div>
                      <img
                        className="movie-card-img"
                        src={
                          movie.img
                            ? `https://image.tmdb.org/t/p/w300${movie.img}`
                            : popcorn
                        }
                      />
                    </div>
                    <div className="d-flex justify-content-center flex-column mt-2">
                      <span className="fw-bold">
                        {movie.name.length > 13
                          ? `${movie.name.substring(0, 13)}...`
                          : movie.name}
                      </span>
                      <span className="movie-year">
                        {movie.year.substring(0, 4)}
                      </span>
                    </div>
                  </div>
                </a>
              </p>
            );
          })}
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
    <div className="poster-container ">
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

export default Profile;
