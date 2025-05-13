import Course from "../models/Course.js"; // Ensure Course.js exists in models folder

// ✅ Get all published courses (excluding course content and enrolled students)
export const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find({ isPublished: true })
            .select(['-courseContent', '-enrolledStudents']) // Exclude courseContent and enrolledStudents
            .populate({ path: 'educator' }); // Ensure 'educator' is a reference in the model

        res.status(200).json({ success: true, courses }); // Return HTTP 200 OK
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(500).json({ success: false, message: error.message }); // Return HTTP 500 Server Error
    }
};

// ✅ Get course by ID and hide lectureUrl if preview is not free
export const getCourseId = async (req, res) => {
    const { id } = req.params;

    try {
        const courseData = await Course.findById(id).populate({ path: 'educator' });

        if (!courseData) {
            return res.status(404).json({ success: false, message: "Course not found" }); // 404 if not found
        }

        // Remove lectureUrl if isPreviewFree is false
        courseData.courseContent.forEach(chapter => {
            chapter.chapterContent.forEach(lecture => {
                if (!lecture.isPreviewFree) {
                    lecture.lectureUrl = ""; // Remove the lecture URL if not free
                }
            });
        });

        res.status(200).json({ success: true, courseData }); // Return HTTP 200 OK
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(500).json({ success: false, message: error.message }); // Return HTTP 500 Server Error
    }
};
