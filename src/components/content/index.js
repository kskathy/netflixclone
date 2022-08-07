import Header from "../header";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Search from "../search";
import Home from "../home";
import Detail from "../detail";
import Profile from "../profile";
import Login from "../login";
import People from "../people";
import Privacy from "../privacy";
import firebaseApp from "../../firebase/firebase";
import { getAuth } from "firebase/auth";
const Contents = () => {
  const auth = getAuth(firebaseApp);
  return (
    <Router>
      <>
        <Header auth={auth} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/people" element={<People auth={auth} />} />
          <Route path="/search" element={<Search />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/login" element={<Login auth={auth} />} />
          <Route path="/movie/:id" element={<Detail auth={auth} />} />
          <Route path="/show/:id" element={<Detail auth={auth} />} />
          <Route path="/profile/:id" element={<Profile auth={auth} />} />
        </Routes>
      </>
    </Router>
  );
};

export default Contents;
