import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

// Student Pages
import Home from './pages/students/Home';
import CourseList from './pages/students/CourseList';
import CourseDetails from './pages/students/CourseDetails';
import MyEnrollments from './pages/students/MyEnrollments';
import Player from './pages/students/Player';
import Loading from './components/students/Loading';
import Navbar from './components/students/Navbar';
import "quill/dist/quill.snow.css";

// Educator Pages
import Educator from './pages/educator/Educator';
import Dashboard from './pages/educator/Dashboard';
import AddCourse from './pages/educator/Addcourse';
import Mycourse from './pages/educator/Mycourse';
import StudentsEnrolled from './pages/educator/StudentsEnrolled';

const App = () => {
  const location = useLocation();
  const isEducatorRoute = location.pathname.startsWith('/educator');

  return (
    <div className="text-default min-h-screen bg-transparent">
      {/* Student Navbar */}
      {!isEducatorRoute && <Navbar />}

      {/* All Routes */}
      <Routes>
        {/* Student Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/course-list" element={<CourseList />} />
        <Route path="/course-list/:input" element={<CourseList />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/my-enrollments" element={<MyEnrollments />} />
        <Route path="/player/:courseId" element={<Player />} />
        <Route path="/loading/:path" element={<Loading />} />

        {/* Educator Routes */}
        <Route path="/educator" element={<Educator />}>
          <Route path='/educator' element={<Dashboard />} />
          <Route path="add-course" element={<AddCourse />} />
          <Route path="my-course" element={<Mycourse />} />
          <Route path="student-enrolled" element={<StudentsEnrolled />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
