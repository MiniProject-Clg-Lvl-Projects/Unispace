import express from 'express';
import cors from 'cors';
import { connectDB } from './DBConnection.ts';
import { CourseSchema,StudentSchema,FacultySchema, UserSchema} from './courseModel.ts';
import type { ICourse, IStudent, IFaculty, ILogin,IUnit} from './types.ts';
import bcrypt from 'bcrypt';

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
export const seedUserDatabase = async (user: Partial<ILogin> = {}) => {
  try {
    await UserSchema.create(user); // Adds a new user to the database
    console.log(`Successfully inserted ${user.email} into the database!`);
  } catch (error) {
    console.error('Error seeding data:', error);
  }

};



// Use for seeding the database with initial student data.
export const seedStudentDatabase = async (student: Partial<IStudent> = {}) => {
  try {
    await StudentSchema.create(student); // Adds a new student to the database
    console.log(`Successfully inserted ${student.name} into the database!`);
  } catch (error) {
    console.error('Error seeding data:', error);
  }

};

// Use for seeding the database with initial faculty data.
export const seedFacultyDatabase = async (faculty: Partial<IFaculty> = {}) => {
  try {
    await FacultySchema.create(faculty); // Adds a new faculty member to the database
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
    const totalInserted = await seedCoursesDatabase(course);
    
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

app.patch("/api/courses/:CourseCode/units",async (req,res)=>{
  try{
    const {CourseCode} = req.params;
    const unit = req.body as IUnit;
    console.log(unit);
    const UpdateCourse = await CourseSchema.updateOne(
      {code: CourseCode},
      { $push: { units: unit } },
      {runValidators: true }
    );

    if(UpdateCourse.matchedCount ===0){
      return res.status(404).json({ message: 'Course not found' });
    }

    if (!UpdateCourse) {
      return res.status(404).json({
          message: 'Course not found'
      });
    }
    
    return res.status(200).json({
      message: 'Unit added successfully',
      course: UpdateCourse
    });
  }catch(error){
      return res.status(500).json({
            message: 'Failed to add unit' + error
      });
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

app.get('/api/FetchCourse/:CourseID', async (req, res) => {
  const {CourseID} = req.params;
  try {
    const courses = await CourseSchema.findOne({code: CourseID});
    res.json(courses);
  }catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/RegisterUser', async (req, res) => {
  const user = req.body as Partial<ILogin>; 
  const {passwordHash} = req.body as { passwordHash: string }; // Extract the password from the request body
  user.passwordHash = await bcrypt.hash(passwordHash, 10); // Hash the password before storing it
  try {
    await seedUserDatabase(user)
    res.status(201).json({ 
      success: true,
      message: `Database of the ${user.email} seeded successfully!`, 
    });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/AddFaculty', async (req, res) => {
  const faculty = req.body as Partial<IFaculty>; // Assuming faculty data is sent in the request body
  try {
    await seedFacultyDatabase(faculty);

    res.status(201).json({ 
     success: true,
      message: 'Database seeded successfully!', 
    });
  } catch (error) {
    console.error('Error adding faculty:', error);
    res.status(500).json({ message: 'Internal server error' });
  }

});

app.post('/api/AddStudent', async (req, res) => {
  const student = req.body as Partial<IStudent>; 
  const {password} = req.body as { password: string }; // Extract the password from the request body
  student.password = await bcrypt.hash(password, 10);// Hash the password before storing it
  try {
    await seedStudentDatabase(student); 
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
  const { studentEmailId } = req.params;
  const password = req.body.password as string; 
  try {

    const student = await UserSchema.findOne({
      email: studentEmailId
    }).select("+passwordHash");
    

    if (!student) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(
        password,
        student.passwordHash
    ); 
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

     return res.json({
            id: student?._id.toString(),
            name: student?.name,
            email: student?.email,
            role: "student"
        });
    
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/FetchFaculty/:facultyEmailId', async (req, res) => {
   console.log('FetchFaculty route reached!');
  const { facultyEmailId  } = req.params;
  const password = req.body.password as string; // Assuming password is sent in the request body
  try {

    const faculty = await UserSchema.findOne({
      email: facultyEmailId
    }).select("+passwordHash");
    

    if (!faculty) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(
        password,
        faculty.passwordHash
    ); 
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }


     return res.json({
            id: faculty._id.toString(),
            name: faculty.name,
            email: faculty.email,
            role: faculty.role
        });
    
  } catch (error) {
    console.error('Error fetching faculty:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

