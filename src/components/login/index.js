import React, { useState, useEffect } from "react";
import wallpaper from "../../assets/wallpaper.png";
import "./login.css";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import service from "../../service/service";
const Login = ({ auth }) => {
  const [isLoggin, setIsLoggin] = useState(false);
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggin(true);
        window.location.href = "/";
      } else {
        setIsLoggin(false);
      }
    });
  }, []);

  return (
    <div className="login-container d-flex justify-content-center align-items-center">
      <div
        className="login-backdrop"
        style={{
          backgroundImage: `url(${wallpaper})`,
        }}
      />
      <div className="signin-container">
        {isLoggin ? (
          <div className="text-center redirection-text">Redirecting ...</div>
        ) : (
          <SignIn auth={auth} />
        )}
      </div>
    </div>
  );
};

const SignIn = ({ auth }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [login, setLogin] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [role, setRole] = useState(1);

  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;
    setError(false);
    if (name === "email") {
      setEmail(value);
    } else if (name == "password") {
      setPassword(value);
    } else if (name == "name") {
      setName(value);
    } else if (name == "confirmPassword") {
      setConfirmPassword(value);
    }
  };

  const onLogin = async (event) => {
    event.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setError(true);
    }
  };

  const initState = () => {
    setEmail("");
    setPassword("");
    setName("");
    setConfirmPassword("");
    setError(false);
    setErrorMessage("");
    setRole(1);
  };

  const goSignUp = () => {
    setLogin(false);
    initState();
  };

  const goLogin = () => {
    setLogin(true);
    initState();
  };

  const onSignUp = async (event) => {
    event.preventDefault();
    if (confirmPassword === password) {
      if (password.length < 6) {
        setErrorMessage("Passwords must be more than 6 characters");
        setError(true);
      } else {
        try {
          await createUserWithEmailAndPassword(auth, email, password).then(
            (user) => {
              const uid = user.user.uid;
              const newProfile = {
                _id: uid,
                email: email,
                name: name,
                role: role,
              };
              service.createProfile(newProfile);
            }
          );
        } catch (error) {
          setErrorMessage("Email already exist");
          setError(true);
        }
      }
    } else {
      setErrorMessage("Passwords are not matching");
      setError(true);
    }
  };

  return (
    <div className="login-content">
      {login ? (
        <div>
          <form onSubmit={onLogin}>
            <h1 className="login-h1">Sign In</h1>
            <div className="login-label">User Email</div>
            <input
              name="email"
              type="email"
              value={email}
              className="form-control"
              placeholder="Email"
              required
              onChange={onChange}
            />
            <div className="login-label">Password</div>
            <input
              name="password"
              value={password}
              className="form-control"
              type="password"
              placeholder="Password"
              required
              onChange={onChange}
            />
            {error && <div className="pt-2 error-message">Error Occured</div>}
            <div>
              <input
                className=" btn btn-danger mt-3 mb-2 d-flex justify-content-center align-items-center"
                type="submit"
                value={`Sign in`}
              />
            </div>
          </form>
          <div className="mt-3 cursor-pointer" onClick={goSignUp}>
            New to the site?{" "}
            <a className="text-underline" >
              {"  "}
              <u>Sign up here</u>
            </a>
          </div>
        </div>
      ) : (
        <form onSubmit={onSignUp}>
          <h1 className="login-h1">Sign Up</h1>

          <div className="login-label">Name</div>
          <input
            name="name"
            type="text"
            value={name}
            className="form-control"
            placeholder="Name"
            required
            onChange={onChange}
          />

          <div className="login-label">User Email </div>
          <input
            name="email"
            type="email"
            value={email}
            className="form-control"
            placeholder="Email"
            required
            onChange={onChange}
          />

          <div className="login-label">Password</div>
          <input
            name="password"
            value={password}
            className="form-control"
            type="password"
            placeholder="Password"
            required
            onChange={onChange}
          />

          <div className="login-label">Confirm Password</div>
          <input
            name="confirmPassword"
            value={confirmPassword}
            className="form-control"
            type="password"
            placeholder="Password"
            required
            onChange={onChange}
          />

          <div className="login-label">Choose Your Role</div>

          <div className="select">
            <select
            className="login-select"
              onChange={(e) => {
                setRole(e.target.value);
              }}
            >
              <option value="1">Student</option>
              <option value="2">Professor</option>
              <option value="3">Reviewer</option>
            </select>
          </div>

          {error && <div className="pt-2 error-message">{errorMessage}</div>}

      

          <div className="cursor-pointer mt-3" onClick={goLogin}>
            Have your account already?{" "}
            <a className="text-underline">
              <u>Back to Login </u>
            </a>
          </div>
          <div>
            <input
              className=" btn btn-danger mt-3 mb-2 d-flex justify-content-center align-items-center"
              type="submit"
              value={`Sign Up`}
            />
          </div>
        </form>
      )}
    </div>
  );
};

export default Login;
