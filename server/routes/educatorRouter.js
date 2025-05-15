import express from 'express';
import { addCourse, educatorDashboardData, getEducatorCourses, getEnrolledStudentsData, updateRoleEducator } from '../controllers/educatorController.js';
import upload from '../configs/multer.js';
import { protectEducator } from '../middlewares/authMiddleware.js';
import ensureMongoUser from '../middlewares/ensureMongoUser.js';
import { requireAuth } from '@clerk/express';

const educatorRouter = express.Router();

// Apply Clerk auth and user sync on all routes
educatorRouter.use(requireAuth);
educatorRouter.use(ensureMongoUser);

// Public routes (if any) can be here

// Protected routes - role based
educatorRouter.post('/update-role', updateRoleEducator);
educatorRouter.post('/add-course', protectEducator, upload.single('image'), addCourse);
educatorRouter.get('/courses', protectEducator, getEducatorCourses);
educatorRouter.get('/dashboard', protectEducator, educatorDashboardData);
educatorRouter.get('/enrolled-students', protectEducator, getEnrolledStudentsData);

export default educatorRouter;
