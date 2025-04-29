import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../../context/Appcontext';
import { assets } from '../../assets/assets';
import Loading from '../../components/students/Loading';
import humanizeDuration from 'humanize-duration';
import Footer from '../../components/educator/footer';
import YouTube from 'react-youtube';

const Coursedetails = () => {
  const { id } = useParams();
  const [CourseData, setCourseData] = useState(null);
  const [openSection, setOpenSection] = useState([]);
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);
  const [playerData, setPlayerData] = useState(null);

  const { allCourses, calculateRating, calculateNoOfLectures, calculateCourseDuration, calculateChapterTime, currency } = useContext(AppContext);

  const fetchCourseData = async () => {
    const findCourse = allCourses.find(course => course._id === id);
    setCourseData(findCourse);
  };

  useEffect(() => {
    fetchCourseData();
  }, [allCourses]);

  const toggleSection = (index) => {
    setOpenSection((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return CourseData ? (
    <>
      <div className='flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-36 px-8 md:pt-30 pt-20 text-left'>
        
        {/* Background Gradient */}
        <div
          className='absolute top-0 left-0 w-full -z-10 bg-gradient-to-b from-cyan-100/70 to-white'
          style={{ height: '500px' }}
        ></div>

        {/* Left column */}
        <div className='max-w-xl z-10 text-gray-500'>
          <h1 className='md:text-course-details-heading-large text-3xl font-semibold text-gray-800'>
            {CourseData.courseTitle}
          </h1>
          <p
            className='pt-4 md:text-base text-sm'
            dangerouslySetInnerHTML={{ __html: CourseData.courseDescription.slice(0, 200) }}
          ></p>

          {/* Review and rating */}
          <div className="flex items-center gap-2 mt-4 pt-3 pb-1 text-sm">
            <p className="text-gray-600">{calculateRating(CourseData).toFixed(1)}</p>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <img
                  key={i}
                  src={i < Math.floor(calculateRating(CourseData)) ? assets.star : assets.star_blank}
                  alt=''
                  className='w-4 h-4'
                />
              ))}
            </div>
            <p className='text-gblue-600'>
              ({CourseData.courseRatings.length}{CourseData.courseRatings.length > 1 ? ' ratings' : ' rating'})
            </p>
            <p>
              {CourseData.enrolledStudents.length}{CourseData.enrolledStudents.length > 1 ? ' students' : ' student'}
            </p>
          </div>

          <p className='text-sm'>Course by <span className='text-blue-600 underline'>GreatStack</span></p>

          {/* Course Structure */}
          <div className='pt-8 text-gray-800'>
            <h2 className='text-xl font-semibold'>Course Structure</h2>
            <div className='pt-5'>
              {CourseData.courseContent.map((chapter, index) => (
                <div className='border border-gray-300 bg-white mb-2 rounded' key={index}>
                  <div
                    className='flex items-center justify-between px-4 py-3 cursor-pointer select-none'
                    onClick={() => toggleSection(index)}
                  >
                    <div className='flex items-center gap-2'>
                      <img
                        className={`transform transition-transform ${openSection[index] ? 'rotate-180' : ''}`}
                        src={assets.down_arrow_icon}
                        alt="arrow icon"
                      />
                      <p className='font-medium md:text-base text-sm'>{chapter.chapterTitle}</p>
                    </div>
                    <p className='text-sm md:text-base'>
                      {chapter.chapterContent.length} lectures - {calculateChapterTime(chapter)}
                    </p>
                  </div>

                  {/* Lectures inside chapter */}
                  <div className={`overflow-hidden transition-all duration-300 ${openSection[index] ? 'max-h-96' : 'max-h-0'}`}>
                    <ul className="list-disc list-inside md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300 text-sm">
                      {chapter.chapterContent.map((lecture, i) => (
                        <li key={i} className='flex items-start gap-2 py-1'>
                          <img src={assets.play_icon} alt="play icon" className='w-4 h-4 mt-1' />
                          <div className='flex items-center justify-between w-full text-gray-800 text-sm'>
                            <p>{lecture.lectureTitle}</p>
                            <div className='flex gap-2'>
                              {lecture.isPreviewFree && (
                                <p
                                  onClick={() => setPlayerData({
                                    videoId: lecture.lectureUrl.split('/').pop()
                                  })}
                                  className='text-blue-500 cursor-pointer'
                                >
                                  Preview
                                </p>
                              )}
                              <p>{humanizeDuration(lecture.lectureDuration * 60 * 1000, { units: ['h', 'm'] })}</p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Course Description */}
          <div className='py-20 text-sm md:text-base'>
            <h3 className='text-xl font-semibold text-gray-800'>Course Description</h3>
            <p
              className='pt-3 rich-text'
              dangerouslySetInnerHTML={{ __html: CourseData.courseDescription }}
            ></p>
          </div>
        </div>

        {/* Right column */}
        <div className="max-w-md z-10 shadow-md rounded-t-lg md:rounded-none overflow-hidden bg-white min-w-[300px] sm:min-w-[420px]">
          <div className="w-full">
            {playerData ? (
              <YouTube
                videoId={playerData.videoId}
                opts={{ playerVars: { autoplay: 1 } }}
                iframeClassName='w-full aspect-video'
              />
            ) : (
              <img src={CourseData.courseThumbnail} alt="Course Thumbnail" className='w-full' />
            )}
          </div>

          <div className='p-5'>
            {/* Only this clock with '5 days left' */}
            <div className='flex items-center gap-2'>
              <img className='w-3.5' src={assets.time_left_clock_icon} alt="time left clock icon" />
              <p className='text-red-500'>
                <span className='font-medium'>5 days</span> left at this price!
              </p>
            </div>

            {/* Price Section */}
            <div className='flex gap-3 items-center pt-2'>
              <p className='text-gray-800 md:text-4xl text-2xl font-semibold'>
                {currency} {(CourseData.coursePrice - CourseData.discount * CourseData.coursePrice / 100).toFixed(2)}
              </p>
              <p className='md:text-ld text-gray-500 line-through'>
                {currency}{CourseData.coursePrice}
              </p>
              <p className='md:text-lg text-gray-500'>{CourseData.discount}% off</p>
            </div>

            {/* Course Highlights */}
            <div className='flex items-center text-sm md:text-default gap-4 pt-2 md:pt-4 text-gray-500'>
              <div className='flex items-center gap-1'>
                <img src={assets.star} alt="star icon" />
                <p>{calculateRating(CourseData)}</p>
              </div>

              <div className='h-4 w-px bg-gray-500/40'></div>

              <div className='flex items-center gap-1'>
                <img src={assets.time_clock_icon} alt="clock icon" />
                <p>{calculateCourseDuration(CourseData)}</p>
              </div>

              <div className='h-4 w-px bg-gray-500/40'></div>

              <div className='flex items-center gap-1'>
                <img src={assets.lesson_icon} alt="lesson icon" />
                <p>{calculateNoOfLectures(CourseData)} lessons</p>
              </div>
            </div>

            {/* Enroll Button */}
            <button className='md:mt-6 mt-4 w-full py-3 rounded bg-blue-600 text-white font-medium'>
              {isAlreadyEnrolled ? 'Already Enrolled' : 'Enroll Now'}
            </button>

            {/* What's Included */}
            <div className='pt-6'>
              <p className='md:text-xl text-lg font-medium text-gray-800'>What's in the course?</p>
              <ul className='ml-4 pt-2 text-sm md:text-default list-disc text-gray-500'>
                <li>Lifetime access with free updates.</li>
                <li>Step-by-step, hands on project guidance.</li>
                <li>Downloadable resources and source code.</li>
                <li>Quizzes to test your knowledge.</li>
                <li>Certificate of completion.</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
      <Footer />
    </>
  ) : (
    <Loading />
  );
};

export default Coursedetails;
