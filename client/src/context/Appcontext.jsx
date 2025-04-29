import React, { useEffect, useState } from 'react';
import { createContext } from "react";
import { dummyCourses } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import humanizeDuration from 'humanize-duration';

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();

  const [allCourses, setAllCourses] = useState([]);
  const [isEducator, setIsEducator] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  // Fetch all courses
  const fetchAllCourses = async () => {
    setAllCourses(dummyCourses);
  };

  // Fetch user enrolled courses
  const fetchUserEnrolledCourses = async () => {
    setEnrolledCourses(dummyCourses);
  };

  // Calculate average rating for a course
  const calculateRating = (course) => {
    if (course.courseRatings.length === 0) {
      return 0;
    }
    let totalRating = 0;
    course.courseRatings.forEach(rating => {
      totalRating += rating.rating;
    });
    return totalRating / course.courseRatings.length;
  };

  // Calculate chapter time
  const calculateChapterTime = (chapter) => {
    let time = 0;
    chapter.chapterContent.forEach((lecture) => {
      if (lecture?.lectureDuration && typeof lecture.lectureDuration === "number") {
        time += lecture.lectureDuration;
      }
    });
    if (time === 0) return "0 min";
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"], round: true });
  };

  // Calculate total course duration
  const calculateCourseDuration = (course) => {
    let totalMinutes = 0;
    course.courseContent.forEach(chapter => {
      chapter.chapterContent.forEach(lecture => {
        totalMinutes += lecture.lectureDuration;
      });
    });
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours > 0 && minutes > 0) {
      return `${hours} hrs ${minutes} min`;
    } else if (hours > 0) {
      return `${hours} hrs`;
    } else {
      return `${minutes} min`;
    }
  };

  // Calculate the number of lectures in a course
  const calculateNoOfLectures = (course) => {
    let totalLectures = 0;
    course.courseContent.forEach(chapter => {
      if (Array.isArray(chapter.chapterContent)) {
        totalLectures += chapter.chapterContent.length;
      }
    });
    return totalLectures;
  };

  useEffect(() => {
    fetchAllCourses();
    fetchUserEnrolledCourses();
  }, []);

  const value = {
    currency, allCourses, navigate, calculateRating, isEducator, setIsEducator,
    calculateChapterTime, calculateCourseDuration, calculateNoOfLectures, enrolledCourses, fetchUserEnrolledCourses
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};
