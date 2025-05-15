import { clerkClient } from '@clerk/express';
import Course from '../models/Course.js';
import Purchases from '../models/Purchase.js';
import { v2 as cloudinary } from 'cloudinary';
import User from '../models/User.js'; 
import Educator from '../models/Educator.js'; // Make sure you have this model

// Update role to educator
const updateRoleEducator = async (req, res) => {
    try {
        const userId = req.auth.userId;

        // ✅ Ensure Educator document is created with Clerk ID
        const existing = await Educator.findOne({ clerkId: userId });
        if (!existing) {
            await Educator.create({ clerkId: userId });
        }

        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                role: 'educator',
            },
        });
        res.json({ success: true, message: 'You can now publish a course.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Add new course
const addCourse = async (req, res) => {
  try {
    const { courseData } = req.body;
    const imageFile = req.file;
    const clerkUserId = req.auth.userId;

    if (!imageFile) {
      return res.status(400).json({ success: false, message: 'Thumbnail not attached.' });
    }

    // ✅ Find Educator by Clerk ID
    const educator = await Educator.findOne({ clerkId: clerkUserId });
    if (!educator) {
      return res.status(404).json({ success: false, message: 'Educator not found.' });
    }

    // ✅ Parse and Assign MongoDB ObjectId as educator
    const parsedCourseData = typeof courseData === 'string' ? JSON.parse(courseData) : courseData;
    parsedCourseData.educator = educator._id;

    // ✅ Set isPublished default if schema requires
    if (!parsedCourseData.isPublished) parsedCourseData.isPublished = false;

    const newCourse = await Course.create(parsedCourseData);

    // ✅ Upload image to Cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path);
    newCourse.courseThumbnail = imageUpload.secure_url;
    await newCourse.save();

    res.json({ success: true, message: 'Course added successfully.', course: newCourse });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Other controller methods (unchanged)...

const getEducatorCourses = async (req, res) => {
    try {
        const clerkUserId = req.auth.userId;
        const educator = await Educator.findOne({ clerkId: clerkUserId });
        const courses = await Course.find({ educator: educator._id });

        res.json({ success: true, courses });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const educatorDashboardData = async (req, res) => {
    try {
        const educator = await Educator.findOne({ clerkId: req.auth.userId });
        const courses = await Course.find({ educator: educator._id });
        const totalCourses = courses.length;
        const courseIds = courses.map(course => course._id);

        const purchases = await Purchases.find({
            courseId: { $in: courseIds },
            status: 'completed'
        });

        const totalEarnings = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);

        const enrolledStudentsData = [];
        for (const course of courses) {
            const students = await User.find({
                _id: { $in: course.enrolledStudents }
            }, 'name imageUrl');

            students.forEach(student => {
                enrolledStudentsData.push({
                    courseTitle: course.courseTitle,
                    student
                });
            });
        }

        res.json({
            success: true,
            dashboardData: { totalEarnings, enrolledStudentsData, totalCourses }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getEnrolledStudentsData = async (req, res) => {
    try {
        const educator = await Educator.findOne({ clerkId: req.auth.userId });
        const courses = await Course.find({ educator: educator._id });
        const courseIds = courses.map(course => course._id);

        const purchases = await Purchases.find({
            courseId: { $in: courseIds },
            status: 'completed'
        }).populate('userId', 'name imageUrl').populate('courseId', 'courseTitle');

        const enrolledStudents = purchases.map(purchase => ({
            student: purchase.userId,
            courseTitle: purchase.courseId.courseTitle,
            purchaseDate: purchase.createdAt
        }));

        res.json({ success: true, enrolledStudents });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export {
    updateRoleEducator,
    addCourse,
    getEducatorCourses,
    educatorDashboardData,
    getEnrolledStudentsData,
};
