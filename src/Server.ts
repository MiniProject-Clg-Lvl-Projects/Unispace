import express from 'express';
import cors from 'cors';
import { connectDB } from './DBConnection.ts';
import { CourseSchema,StudentSchema,FacultySchema, UserSchema} from './courseModel.ts';
import type { ICourse, IStudent, IFaculty, ILogin } from './types.ts';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); 

connectDB();

// Use for seeding the database with initial course data.
export const seedCoursesDatabase = async (course: Partial<ICourse> = {}) => {
  try {
    CourseSchema.create(course); // Adds a new course to the database
    console.log(`Successfully inserted ${course.title} into the database!`);
  } catch (error) {
    console.error('Error seeding data:', error);
  }

};

// Use for seeding the database with initial User data.
export const seedRegisterDatabase = async (user: Partial<ILogin> = {}) => {
  try {
    UserSchema.create(user); // Adds a new user to the database
    console.log(`Successfully inserted ${user.email} into the database!`);
  } catch (error) {
    console.error('Error seeding data:', error);
  }

};



// Use for seeding the database with initial student data.
export const seedStudentDatabase = async (student: Partial<IStudent> = {}) => {
  try {
    StudentSchema.create(student); // Adds a new student to the database
    console.log(`Successfully inserted ${student.name} into the database!`);
  } catch (error) {
    console.error('Error seeding data:', error);
  }

};

// Use for seeding the database with initial faculty data.
export const seedFacultyDatabase = async (faculty: Partial<IFaculty> = {}) => {
  try {
    FacultySchema.create(faculty); // Adds a new faculty member to the database
    console.log(`Successfully inserted ${faculty.name} into the database!`);
  } catch (error) {
    console.error('Error seeding data:', error);
  }

};


app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running smoothly!');
});

// Required for Faculty to seed the database with initial courses.
app.post("/api/AddCourses", async (req, res) => {
  try {
    const course = req.body as Partial<ICourse>;
    console.log('Course ID:', course.id)
    console.log('Full request body:', req.body)
    // TODO Need to pass a course object to seedCoursesDatabase function. 
    const totalInserted = await seedCoursesDatabase(course); // Assuming ICourse is the course you want to seed
    
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

app.post('/api/AddFaculty', async (req, res) => {
  const faculty = req.body as Partial<IFaculty>; // Assuming faculty data is sent in the request body
  try {
    const newFaculty = await seedFacultyDatabase(faculty);


    res.status(201).json({ 
     success: true,
      message: 'Database seeded successfully!', 
    });
  } catch (error) {
    console.error('Error adding faculty:', error);
    res.status(500).json({ message: 'Internal server error' });
  }

});

app.post('/api/RegisterUser', async (req, res) => {
  const user = req.body as Partial<ILogin>; // Assuming user data is sent in the request body
  try {
    const newUser = await seedRegisterDatabase(user); // Assuming user data is sent in the request body
    res.status(201).json({ 
      success: true,
      message: `Database of the ${user.email} seeded successfully!`, 
    });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/AddStudent', async (req, res) => {
  const student = req.body as Partial<IStudent>; // Assuming student data is sent in the request body
  try {
    const newStudent = await seedStudentDatabase(student); // Assuming student data is sent in the request body
    res.status(201).json({ 
      success: true,
      message: 'Database seeded successfully!', 
    });
  } catch (error) {
    console.error('Error adding student:', error);
    res.status(500).json({ message: 'Internal server error' });
  }

});


app.post('/api/FetchStudent/:studentEmailId', async (req, res) => {
   console.log('FetchStudent route reached!');
  const { studentEmailId } = req.params;
  const password = req.body.password as string; // Assuming password is sent in the request body
  try {

    const student = await UserSchema.findOne({
      email: studentEmailId
    }).select("+passwordHash");
    

    if (!student) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = student.passwordHash === password; // Replace with actual password validation logic
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }


     return res.json({
            id: student._id.toString(),
            email: student.email,
            role: student.role
        });
    
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

