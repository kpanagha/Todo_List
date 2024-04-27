import React, { useState} from "react";
import "./Login.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import mixpanel from "mixpanel-browser";
const mixPanelToken ="5ab560bcf67fd7ea0967d3fe88ce79d8" ;

mixpanel.init(mixPanelToken, {
  debug: true,
  track_pageview: true,
  persistence: "localStorage",
  ignore_dnt: true,
});

const Login = () => {
  const navigate = useNavigate();


  const [Inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  const change = (e) => {
    const { name, value } = e.target;
    setInputs({ ...Inputs, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!Inputs.email.trim() || !Inputs.password.trim()) {
      alert("Please fill all fields.");
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:1000/api/v1/signin", Inputs);
      console.log(response);
  
      // Check if the response contains data and if it's successful
      if (response.data && response.status === 200) {
        // Set user data in session storage
        //Mixpanel.identify(response.data.others._id);
        sessionStorage.setItem("id", response.data.others._id);

  
        const username = response.data.others.username;
        const usermail = response.data.others.email;
  
        // Set user data in local storage
        localStorage.setItem("username", username);
        localStorage.setItem("usermail", usermail);
  
        // Log user data
        console.log("Logged in as:", username);
        console.log("Email:", usermail);
        Loggined(usermail);

        mixpanel.identify(usermail);
  
        mixpanel.people.set({
          $name: username,
          $email: usermail,
          $created: new Date().toISOString(),
          $user_id: usermail,
          test: "Test",
        });
  
        // Navigate to todo page
        navigate("/todo");
      } else {
        // Handle unexpected response
        console.error("Unexpected response format:", response);
        alert("Unexpected response from server. Please try again.");
      }
    } catch (error) {
      if (error.response && error.response.data.message === "User not found.") {
        // Handle user not found error
        console.error("User not found.");
        alert("User not found. Please check your credentials.");
      } else {
        // Handle other errors
        console.error("Error occurred during login:", error);
        alert("An error occurred during login. Please try again later.");
      }
    }
  };
  const Loggined = (usermail) => {
    mixpanel.track("User Logged In", {
      user_id: usermail,
      login_method: "Email",
      success: true,
      timestamp: new Date().toISOString(), // ISO 8601 format
    });
    mixpanel.people.increment("Logins", 1);
    console.log("Login event tracked successfully");
  };



  return (
    <div className="form-container">
      <form className="form" onSubmit={handleSubmit}>
        <h2 className="login-heading">Login</h2>
        <div className="form-control">
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={Inputs.email}
            onChange={change}
          />
          <div className="icon">
            <MdOutlineAlternateEmail />
          </div>
        </div>
        <div className="form-control">
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={Inputs.password}
            onChange={change}
          />
          <div className="icon">
            <RiLockPasswordFill />
          </div>
        </div>
        <button className="login-btn" type="submit">
          Login
        </button>
        <p className="login-p">
          Don't have an account?
          <Link to="/register" className="login-link">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;