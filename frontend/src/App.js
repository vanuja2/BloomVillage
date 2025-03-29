import React from "react";
import { Route, Routes } from "react-router-dom";
import AllPost from "./Components/Blog_Management/Posts";
import AddBlogPost from "./Components/Blog_Management/AddBlogPost";
import Adminpost from "./Components/Blog_Management/AdminPost";

function App() {
  return (
    <div >
      <React.Fragment>
        <Routes>
          {/*Blog Post*/}
          <Route path="/addpost" element={<AddBlogPost />} />
          <Route path="/posts" element={<AllPost />} />
          <Route path="/adminposts" element={<Adminpost />} />
        </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;
