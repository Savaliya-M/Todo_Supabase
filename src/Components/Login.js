import React, { useState } from 'react';
import { supabase } from '../Components/supabase';
import md5 from 'md5';
import Cookies from 'js-cookie';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [loggedInUser, setLoggedInUser] = useState({
    email: "",
    password: ""
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({
    email: "",
    password: ""
  });

  const handleLogin = async () => {
    if (!loggedInUser.email) {
      setErrors((prevErrors) => ({ ...prevErrors, email: "Email is required" }));
      return;
    }

    if (!loggedInUser.password) {
      setErrors((prevErrors) => ({ ...prevErrors, password: "Password is required" }));
      return;
    }
    const hashedPassword = md5(loggedInUser.password);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loggedInUser.email,
        password: hashedPassword,
      });

      if (data) {
        Cookies.set('token', data.session.access_token);
        navigate('/dashboard');
      }

      if (error) {
        console.error(error);
      }
    } catch (error) {
      console.error('Error during sign-in:', error.message);
    }
    // const session = await supabase.auth.getSession().data.session
    // const token = session.access_token
    // supabase.auth.getSession().then(({ data: { session } }) => {
    // })


  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoggedInUser((prevUser) => ({ ...prevUser, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>
      <form>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email:
          </label>
          <input
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            type="email"
            id="email"
            name="email"
            value={loggedInUser.email}
            onChange={handleInputChange}
          />
          {errors.email && <p className="text-red-500">{errors.email}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password:
          </label>
          <input
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            type="password"
            id="password"
            name="password"
            value={loggedInUser.password}
            onChange={handleInputChange}
          />
          {errors.password && <p className="text-red-500">{errors.password}</p>}
        </div>
        <button
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none"
          type="button"
          onClick={handleLogin}
        >
          Login
        </button>
        <div className="mt-4 text-center">
          <p>
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Create User
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
