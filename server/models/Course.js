import mongoose from 'mongoose';

const lectureSchema = new mongoose.Schema({
    lecturerId: { type: String, required: true },
    lectureDuration: { type: Number, required: true },
    lectureTitle: { type: String, required: true },
    lectureUrl: { type: String, required: true },
    lectureOrder: { type: Number, required: true },
    isPreviewFree: { type: Boolean, required: true },
}, { _id: true }); // Kept _id for individual reference if necessary

const chapterSchema = new mongoose.Schema({
    chapterId: { type: String, required: true },
    chapterOrder: { type: Number, required: true },
    chapterTitle: { type: String, required: true },
    chapterContent: [lectureSchema],
}, { _id: true }); // Kept _id for individual reference

const courseSchema = new mongoose.Schema({
    courseTitle: { type: String, required: true },
    courseDescription: { type: String, required: true },
    courseThumbnail: { type: String },
    coursePrice: { type: Number, required: true, min: 0 }, // Added minimum price validation
    isPublished: { type: Boolean, required: true },
    discount: { type: Number, required: true, min: 0, max: 100 },
    courseContent: [chapterSchema],
    courseRatings: [
        { 
            UserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
            rating: { type: Number, min: 1, max: 5 } 
        }
    ],
    educator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    enrolledStudents: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    ],
}, { timestamps: true, minimize: false });

const Course = mongoose.model('Course', courseSchema);

export default Course;
