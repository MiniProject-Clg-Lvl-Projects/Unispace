import { Schema, model } from 'mongoose';
import type { IContentItem,IUnit,ICourse} from './types.ts'

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
  approvalStatus: { type: String, required: true },
  units: [unitSchema]
});

export const CourseSchema = model<ICourse>('Course', courseSchema);