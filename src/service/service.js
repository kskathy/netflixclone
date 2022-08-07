const URL = "http://localhost:4000/profile";
const ChatURL = "http://localhost:4000/chat";

export const findAllProfile = () =>
  fetch(`${URL}`).then((response) => response.json());

export const findProfileById = (id) =>
  fetch(`${URL}/${id}`).then((response) => response.json());

export const createProfile = (profile) =>
  fetch(URL, {
    method: "POST",
    body: JSON.stringify(profile),
    headers: {
      "content-type": "application/json",
    },
  }).then((response) => response.json());

export const editProfile = (profile) => {
  fetch(`${URL}/${profile._id}`, {
    method: "PUT",
    body: JSON.stringify(profile),
    headers: {
      "content-type": "application/json",
    },
  }).then((response) => response.json());
};

export const handleFilm = (profile) => {
  fetch(`${URL}/${profile._id}/movie`, {
    method: "PUT",
    body: JSON.stringify(profile),
    headers: {
      "content-type": "application/json",
    },
  }).then((response) => response.json());
};

export const handleFollower = (profile) => {
  fetch(`${URL}/${profile._id}/follower`, {
    method: "PUT",
    body: JSON.stringify(profile),
    headers: {
      "content-type": "application/json",
    },
  }).then((response) => response.json());
};

export const handleFollowing = (profile) => {
  fetch(`${URL}/${profile._id}/following`, {
    method: "PUT",
    body: JSON.stringify(profile),
    headers: {
      "content-type": "application/json",
    },
  }).then((response) => response.json());
};

export const handleChat = (profile) => {
  fetch(`${URL}/${profile._id}/chat`, {
    method: "PUT",
    body: JSON.stringify(profile),
    headers: {
      "content-type": "application/json",
    },
  }).then((response) => response.json());
};

export const createChat = (chat) =>
  fetch(ChatURL, {
    method: "POST",
    body: JSON.stringify(chat),
    headers: {
      "content-type": "application/json",
    },
  }).then((response) => response.json());

export const findChatById = (id) =>
  fetch(`${ChatURL}/${id}`).then((response) => response.json());

export const sendChat = (chat) => {
  fetch(`${ChatURL}/${chat._id}`, {
    method: "PUT",
    body: JSON.stringify(chat),
    headers: {
      "content-type": "application/json",
    },
  }).then((response) => response.json());
};

export default {
  findProfileById,
  findAllProfile,
  editProfile,
  createProfile,
  handleFilm,
  handleFollower,
  handleFollowing,
  handleChat,
  createChat,
  findChatById,
  sendChat,
};
