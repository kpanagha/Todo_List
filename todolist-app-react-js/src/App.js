import './App.css';
import { TodoWrapper } from './components/TodoWrapper';

import Login from './Login/Login';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from './Register/Register';
import mixpanel from 'mixpanel-browser';
mixpanel.init('5ab560bcf67fd7ea0967d3fe88ce79d8');
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/todo" element={<TodoWrapper />}></Route>
        <Route path="/register" element={<Register/>} ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
// import React from "react";
// 
// import Login from "./Login";
// import TodoWrapper from "./TodoWrapper";

// const App = () => {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Login />} />
//         <Route path="/todo/:userId" element={<TodoWrapper />} /> {/* Receive user ID as a URL parameter */}
//       </Routes>
//     </Router>
//   );
// };

// export default App;

