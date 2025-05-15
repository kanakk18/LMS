import express from 'express';
import { addCourse, educatorDashboardData ,getEducatorCourses, getEnrolledStudentsData, updateRoleEducator } from '../controllers/educatorController.js';
import upload from '../configs/multer.js';
import { protectEducator } from '../middlewares/authMiddleware.js';


const educatorRouter = express.Router();

// Clerk webhook route - changed GET to POST for webhooks
educatorRouter.post('/update-role', updateRoleEducator);

// Add course route - moved protectEducator to be before upload for better security
educatorRouter.post('/add-course', protectEducator, upload.single('image'), addCourse);


educatorRouter.get('/courses', protectEducator, getEducatorCourses)

educatorRouter.get('/dashboard', protectEducator, educatorDashboardData)
educatorRouter.get('/enrolled-students', protectEducator, getEnrolledStudentsData)

export default educatorRouter;
