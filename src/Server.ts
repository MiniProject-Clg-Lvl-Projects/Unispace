import express from 'express';
import cors from 'cors';
import { connectDB } from './DBConnection.ts';
import { CourseSchema } from './courseModel.ts';
import type { ICourse } from './types.ts';
import { initialCourses } from './data.ts';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); 

connectDB();

export const seedDatabase = async (course: Partial<ICourse> = {}) => {
  try {
    const result = await CourseSchema.insertMany(initialCourses); // change insertMany to insertOne if you want to insert a single course
    console.log(`Successfully inserted ${course.title} into the database!`);
  } catch (error) {
    console.error('Error seeding data:', error);
  }

};

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running smoothly!');
});

app.get("/api/seed", async (req, res) => {
  try {

    const totalInserted = await seedDatabase(); // Assuming ICourse is the course you want to seed
    
    res.status(201).json({ 
      success: true,
      message: 'Database seeded successfully!', 
      count: totalInserted 
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    res.status(500).json({ success: false, message: (error as Error).message });
  }
});

app.get('/api/FetchCourses', async (req, res) => {
  try {

    const courses = await CourseSchema.find();
    res.json(courses);
  }catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

