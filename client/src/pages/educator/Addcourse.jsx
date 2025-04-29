import React, { useRef, useState, useEffect } from 'react';
import uniqid from 'uniqid';
import Quill from 'quill';
import { assets } from '../../assets/assets'; // Adjust if your assets path is different

const Addcourse = () => {
  const quillRef = useRef(null);
  const editorRef = useRef(null);

  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [coursePrice, setCoursePrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [image, setImage] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState(null);
  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: '',
    lectureDuration: '',
    lectureUrl: '',
    isPreviewFree: false,
  });

  // Initialize Quill
  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, { theme: 'snow' });

      quillRef.current.on('text-change', () => {
        setCourseDescription(quillRef.current.root.innerHTML);
      });
    }
  }, []);

  // Add, Remove, Toggle Chapter
  const handleChapter = (action, chapterId) => {
    if (action === 'add') {
      const title = prompt('Enter Chapter Name:');
      if (title) {
        const newChapter = {
          chapterId: uniqid(),
          chapterTitle: title,
          chapterContent: [],
          collapsed: false,
          chapterOrder: chapters.length > 0 ? chapters.slice(-1)[0].chapterOrder + 1 : 1,
        };
        setChapters([...chapters, newChapter]);
      }
    } else if (action === 'remove') {
      setChapters(chapters.filter((chapter) => chapter.chapterId !== chapterId));
    } else if (action === 'toggle') {
      setChapters(
        chapters.map((chapter) =>
          chapter.chapterId === chapterId ? { ...chapter, collapsed: !chapter.collapsed } : chapter
        )
      );
    }
  };

  // Add lecture to chapter
  const handleAddLecture = () => {
    if (!lectureDetails.lectureTitle || !lectureDetails.lectureDuration || !lectureDetails.lectureUrl) {
      alert('Please fill all lecture fields!');
      return;
    }

    const updatedChapters = chapters.map((chapter) => {
      if (chapter.chapterId === currentChapterId) {
        return {
          ...chapter,
          chapterContent: [...chapter.chapterContent, lectureDetails],
        };
      }
      return chapter;
    });

    setChapters(updatedChapters);
    setLectureDetails({ lectureTitle: '', lectureDuration: '', lectureUrl: '', isPreviewFree: false });
    setShowPopup(false);
  };

  // Submit Course
  const handleSubmit = (e) => {
    e.preventDefault();
    const courseData = {
      title: courseTitle,
      description: courseDescription,
      price: coursePrice,
      discount,
      thumbnail: image,
      chapters,
    };
    console.log('Course Data:', courseData);

    // Later, you can send this to your backend using fetch/axios
    // Example:
    // axios.post('/api/courses', courseData)
    //   .then(res => console.log(res))
    //   .catch(err => console.error(err));

    alert('Course submitted successfully!');
  };

  return (
    <div className='h-screen overflow-scroll flex flex-col items-start justify-between md:px-8 md:pb-0 p-4 pt-8 pb-0'>
      <form className='flex flex-col gap-4 max-w-md w-full text-gray-500' onSubmit={handleSubmit}>
        {/* Course Title */}
        <div className='flex flex-col gap-1'>
          <p>Course Title</p>
          <input
            onChange={e => setCourseTitle(e.target.value)}
            value={courseTitle}
            type='text'
            placeholder='Type here'
            className='outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500'
            required
          />
        </div>

        {/* Course Description */}
        <div className='flex flex-col gap-1 mt-4'>
          <p>Course Description</p>
          <div ref={editorRef} className="border border-gray-300 rounded-md min-h-[150px] p-2"></div>
        </div>

        {/* Price, Thumbnail, Discount */}
        <div className='flex items-center justify-between flex-wrap gap-4'>
          <div className='flex flex-col gap-1'>
            <p>Course Price</p>
            <input
              onChange={e => setCoursePrice(Number(e.target.value))}
              value={coursePrice}
              type='number'
              placeholder='0'
              className='outline-none md:py-2.5 py-2 w-28 px-3 rounded border border-gray-500'
              required
            />
          </div>

          <div className='flex flex-col gap-1'>
            <p>Discount %</p>
            <input
              type="number"
              onChange={e => setDiscount(Number(e.target.value))}
              value={discount}
              placeholder='0'
              min={0}
              max={100}
              className='outline-none md:py-2.5 py-2 w-28 px-3 rounded border border-gray-500'
              required
            />
          </div>

          <div className='flex flex-col gap-1'>
            <p>Course Thumbnail</p>
            <label htmlFor="thumbnailImage" className='flex items-center gap-3 cursor-pointer'>
              <img src={assets.file_upload_icon} alt="Upload" className='p-3 bg-blue-500 rounded' />
              <input
                type="file"
                id='thumbnailImage'
                onChange={e => setImage(e.target.files[0])}
                accept='image/*'
                hidden
              />
              {image && <img src={URL.createObjectURL(image)} alt="thumbnail" className='max-h-10' />}
            </label>
          </div>
        </div>

        {/* Chapters and Lectures */}
        <div className='w-full'>
          {chapters.map((chapter, chapterIndex) => (
            <div key={chapter.chapterId} className='bg-white border rounded-lg mb-4'>
              <div className='flex justify-between items-center p-4 border-b'>
                <div className='flex items-center'>
                  <img
                    src={assets.dropdown_icon}
                    alt=""
                    width={14}
                    className={`mr-2 cursor-pointer transition-all ${chapter.collapsed && "-rotate-90"}`}
                    onClick={() => handleChapter('toggle', chapter.chapterId)}
                  />
                  <span className='font-semibold'>{chapterIndex + 1}. {chapter.chapterTitle}</span>
                </div>
                <span className='text-gray-500'>{chapter.chapterContent.length} Lectures</span>
                <img
                  src={assets.cross_icon}
                  alt=""
                  className='cursor-pointer'
                  onClick={() => handleChapter('remove', chapter.chapterId)}
                />
              </div>

              {!chapter.collapsed && (
                <div className='p-4'>
                  {chapter.chapterContent.map((lecture, lectureIndex) => (
                    <div key={lectureIndex} className='flex justify-between items-center mb-2'>
                      <span>{lectureIndex + 1}. {lecture.lectureTitle} - {lecture.lectureDuration} mins - 
                        <a href={lecture.lectureUrl} target="_blank" rel="noopener noreferrer" className='text-blue-500 ml-1'>Link</a> 
                        - {lecture.isPreviewFree ? 'Free Preview' : 'Paid'}
                      </span>
                    </div>
                  ))}
                  <div
                    className='inline-flex bg-gray-100 p-2 rounded cursor-pointer mt-2'
                    onClick={() => {
                      setCurrentChapterId(chapter.chapterId);
                      setShowPopup(true);
                    }}
                  >
                    + Add Lecture
                  </div>
                </div>
              )}
            </div>
          ))}
          <div
            className='flex justify-center items-center bg-blue-100 p-2 rounded-lg cursor-pointer'
            onClick={() => handleChapter('add')}
          >
            + Add Chapter
          </div>
        </div>

        {/* Submit Button */}
        <button type='submit' className='bg-black text-white w-max py-2.5 px-8 rounded my-4'>
          ADD
        </button>
      </form>

      {/* Popup for adding Lecture */}
      {showPopup && (
        <div className='fixed inset-0 flex items-center justify-center z-50'>
          <div className='bg-white text-gray-700 p-4 rounded relative w-full max-w-80 shadow-lg'>
            <h2 className='text-lg font-semibold mb-4'>Add Lecture</h2>

            <div className='mb-2'>
              <p>Lecture Title</p>
              <input
                type="text"
                className='mt-1 block w-full border rounded py-1 px-2'
                value={lectureDetails.lectureTitle}
                onChange={(e) => setLectureDetails({ ...lectureDetails, lectureTitle: e.target.value })}
              />
            </div>

            <div className='mb-2'>
              <p>Duration (minutes)</p>
              <input
                type="number"
                className='mt-1 block w-full border rounded py-1 px-2'
                value={lectureDetails.lectureDuration}
                onChange={(e) => setLectureDetails({ ...lectureDetails, lectureDuration: e.target.value })}
              />
            </div>

            <div className='mb-2'>
              <p>Lecture URL</p>
              <input
                type="text"
                className='mt-1 block w-full border rounded py-1 px-2'
                value={lectureDetails.lectureUrl}
                onChange={(e) => setLectureDetails({ ...lectureDetails, lectureUrl: e.target.value })}
              />
            </div>

            <div className='flex gap-2 my-4'>
              <p>Is Preview Free?</p>
              <input
                type="checkbox"
                checked={lectureDetails.isPreviewFree}
                onChange={(e) => setLectureDetails({ ...lectureDetails, isPreviewFree: e.target.checked })}
              />
            </div>

            <button
              type='button'
              className='w-full bg-blue-400 text-white px-4 py-2 rounded'
              onClick={handleAddLecture}
            >
              Add
            </button>

            <img
              src={assets.cross_icon}
              alt=""
              className='absolute top-4 right-4 w-4 cursor-pointer'
              onClick={() => setShowPopup(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Addcourse;
