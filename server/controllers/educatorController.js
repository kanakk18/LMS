import { clerkClient } from '@clerk/express';
import Course from '../models/Course.js';
import Purchases from '../models/Purchases.js';
import { v2 as cloudinary } from 'cloudinary';
import User from '../models/User.js'; // Ensure User model is imported

// Update role to educator
const updateRoleEducator = async (req, res) => {
    try {
        const userId = req.auth.userId;
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
        const educatorId = req.auth.userId;

        if (!imageFile) {
            return res.status(400).json({ success: false, message: 'Thumbnail not attached.' });
        }

        const parsedCourseData = typeof courseData === 'string' ? JSON.parse(courseData) : courseData;
        parsedCourseData.educator = educatorId;

        const newCourse = await Course.create(parsedCourseData);

        const imageUpload = await cloudinary.uploader.upload(imageFile.path);
        newCourse.courseThumbnail = imageUpload.secure_url;
        await newCourse.save();

        res.json({ success: true, message: 'Course added successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get educator courses
const getEducatorCourses = async (req, res) => {
    try {
        const educatorId = req.auth.userId;
        const courses = await Course.find({ educator: educatorId });

        res.json({ success: true, courses });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Educator dashboard data
const educatorDashboardData = async (req, res) => {
    try {
        const educatorId = req.auth.userId;
        const courses = await Course.find({ educator: educatorId });
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

// Get enrolled students data with purchase details
const getEnrolledStudentsData = async (req, res) => {
    try {
        const educatorId = req.auth.userId;
        const courses = await Course.find({ educator: educatorId });
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
