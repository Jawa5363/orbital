import React, { useRef, useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthProvider';
import { ClipLoader } from 'react-spinners';

import axios from '../api/axios';
const LOGIN_URL = '/login';

const Login = () => {
  const { setAuth } = useContext(AuthContext);
  const userRef = useRef();
  const errRef = useRef();

  const [username, setUser] = useState('');
  const [password, setpassword] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg('');
  }, [username, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ username, password }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        },
      );
      const accessToken = response?.data?.accessToken;
      const roles = response?.data?.roles;
      setAuth({ user: username, password, roles, accessToken });
      setUser('');
      setpassword('');
      setTimeout(() => {
        window.location.href = '/home';
      }, 1000); //1 second loading
    } catch (err) {
      setTimeout(() => {
        setLoading(false);
      }, 1000); //1 second loading
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 400) {
        setErrMsg('Missing Username or Password');
      } else if (err.response?.status === 401) {
        setErrMsg('Username or password is wrong');
      } else {
        setErrMsg('Login Failed');
      }
      errRef.current.focus();
    }
  };

  return (
    <>
      {loading ? (
        <ClipLoader />
      ) : (
        <section>
          <p
            ref={errRef}
            className={errMsg ? 'errmsg' : 'offscreen'}
            aria-live='assertive'
          >
            {errMsg}
          </p>
          <h1>Sign In</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor='username'>Username:</label>
            <input
              type='text'
              id='username'
              ref={userRef}
              autoComplete='off'
              onChange={(e) => setUser(e.target.value)}
              value={username}
              required
            />

            <label htmlFor='password'>Password:</label>
            <input
              type='password'
              id='password'
              onChange={(e) => setpassword(e.target.value)}
              value={password}
              required
            />
            <button disabled={username === '' || password.length < 6}>
              Sign In
            </button>
          </form>
          <p>
            Need an Account?
            <br />
            <span className='line'>
              <a href='/'>Sign Up</a>
            </span>
          </p>
        </section>
      )}
    </>
  );
};

export default Login;
