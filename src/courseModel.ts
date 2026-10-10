import { Schema, model } from 'mongoose';
import type { IContentItem,IUnit,ICourse, IStudent, ILogin, IFaculty} from './types.ts'

const userSchema = new Schema<ILogin>(
  {
    email: {type: String,required: true,unique: true,lowercase: true,trim: true},
    passwordHash: {type: String,required: true,select: false},
    role: {type: String,enum: ['student', 'faculty', 'admin'],required: true},
    isActive: { type: Boolean,default: true}
  },{timestamps: true}
);

const facultySchema = new Schema<IFaculty >({
  id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  facultyId: { type: String, required: true }
},{_id: false });

const studentSchema = new Schema<IStudent>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  studentId: { type: String, required: true }
},{_id: false });

const contentSchema = new Schema<IContentItem>({
  id: { type: String, required: true },
  title:{ type: String, required: true },
  type: { type: String, required: true },
  content: { type: String, required: true }
},{ _id: false });

const unitSchema = new Schema<IUnit>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  content: [contentSchema]
},{ _id: false });

const courseSchema = new Schema<ICourse>({
  id: { type: String, required: true },
  title:{ type: String, required: true },
  code: { type: String, required: true },
  description: { type: String, required: true },
  faculty: { type: String, required: true },
  facultyId: { type: String, required: true },
  category: { type: String, required: true },
  level: { type: String, required: true },
  status: { type: String, required: true },
  units: [unitSchema]
});

export const UserSchema = model<ILogin>('users', userSchema);
export const StudentSchema = model<IStudent>('students', studentSchema);
export const FacultySchema = model<IFaculty>('faculties', facultySchema);
export const CourseSchema = model<ICourse>('courses', courseSchema);