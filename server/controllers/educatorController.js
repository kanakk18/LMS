import { clerkClient } from '@clerk/express';
import Course from '../models/Course.js';
import Purchases from '../models/Purchase.js';
import { v2 as cloudinary } from 'cloudinary';
import User from '../models/User.js';

// ✅ Update role to educator
const updateRoleEducator = async (req, res) => {
    try {
        const userId = req.auth.userId;

        // Ensure user exists in DB
        const existingUser = await User.findById(userId);
        if (!existingUser) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        // Update Clerk metadata
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

// ✅ Add new course
const addCourse = async (req, res) => {
    try {


        console.log("🚀 addCourse hit!");

        // Debug data received
        console.log("Body:", req.body);
        console.log("File:", req.file);

        const { courseData } = req.body;
        const imageFile = req.file;
        const clerkUserId = req.auth.userId;

        if (!imageFile) {
            return res.status(400).json({ success: false, message: 'Thumbnail not attached.' });
        }

        // Find educator (user)
        const educator = await User.findById(clerkUserId);
        if (!educator) {
            return res.status(404).json({ success: false, message: 'Educator not found.' });
        }

        // Parse JSON if string
        const parsedCourseData = typeof courseData === 'string' ? JSON.parse(courseData) : courseData;

        // Set educator reference (User._id which is Clerk ID string)
        parsedCourseData.educator = educator._id;

        // Default publish status
        if (parsedCourseData.isPublished === undefined) {
            parsedCourseData.isPublished = false;
        }

        // Create course
        const newCourse = await Course.create(parsedCourseData);

        // Upload thumbnail
        const imageUpload = await cloudinary.uploader.upload(imageFile.path);
        newCourse.courseThumbnail = imageUpload.secure_url;
        await newCourse.save();

        res.json({ success: true, message: 'Course added successfully.', course: newCourse });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ Get educator's courses
const getEducatorCourses = async (req, res) => {
    try {
        const educator = await User.findById(req.auth.userId);
        if (!educator) {
            return res.status(404).json({ success: false, message: 'Educator not found.' });
        }

        const courses = await Course.find({ educator: educator._id });
        res.json({ success: true, courses });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ Educator dashboard data
const educatorDashboardData = async (req, res) => {
    try {
        const educator = await User.findById(req.auth.userId);
        if (!educator) {
            return res.status(404).json({ success: false, message: 'Educator not found.' });
        }

        const courses = await Course.find({ educator: educator._id });
        const totalCourses = courses.length;
        const courseIds = courses.map(course => course._id);

        const purchases = await Purchases.find({
            courseId: { $in: courseIds },
            status: 'completed'
        });

        const totalEarnings = purchases.reduce((sum, p) => sum + p.amount, 0);

        const enrolledStudentsData = [];
        for (const course of courses) {
            const students = await User.find(
                { _id: { $in: course.enrolledStudents } },
                'name imageUrl'
            );

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

// ✅ Get enrolled students (for all educator's courses)
const getEnrolledStudentsData = async (req, res) => {
    try {
        const educator = await User.findById(req.auth.userId);
        if (!educator) {
            return res.status(404).json({ success: false, message: 'Educator not found.' });
        }

        const courses = await Course.find({ educator: educator._id });
        const courseIds = courses.map(course => course._id);

        const purchases = await Purchases.find({
            courseId: { $in: courseIds },
            status: 'completed'
        }).populate('userId', 'name imageUrl').populate('courseId', 'courseTitle');

        const enrolledStudents = purchases.map(p => ({
            student: p.userId,
            courseTitle: p.courseId.courseTitle,
            purchaseDate: p.createdAt
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
