import express from 'express';
import { connectDB } from './DBConnection.ts';
import { CourseSchema } from './courseModel.ts';
import {seedDatabase} from './data.ts'  
const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.json());
app.patch('/api/courses/:id/approval', async (req, res) => {
  try {
    const { approvalStatus } = req.body;

    if (!['approved', 'rejected', 'pending'].includes(approvalStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid approval status'
      });
    }

    const course = await CourseSchema.findOneAndUpdate(
      { id: req.params.id },
      {
        $set: {
          approvalStatus,
          status: approvalStatus
        }
      },
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update course approval'
    });
  }
});

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

app.get('/api/courses', async (req, res) => {
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

