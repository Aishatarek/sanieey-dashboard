import React from "react";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";

import AdminLayout from "layouts/admin";
import SignIn from "SignIn";
const App = () => {

  return (
    <>
      <BrowserRouter>

      <Routes>
      <Route path="admin/*" element={<AdminLayout />} />
      <Route path="/" element={<SignIn />} />

      
    </Routes>
</BrowserRouter>

    </>
  );
};

export default App;
