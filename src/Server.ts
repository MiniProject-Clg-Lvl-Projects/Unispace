import express from 'express';
import cors from 'cors';
import { connectDB } from './DBConnection.ts';
import { CourseSchema,StudentSchema,FacultySchema, UserSchema} from './courseModel.ts';
import type { ICourse, IStudent, IFaculty, ILogin,IUnit,IEnrolledCourse} from './types.ts';
import bcrypt from 'bcrypt';
import { resourceUsage } from 'process';

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

// Required for Faculty to seed the database with initial courses.
app.post('/api/AddCourses', async (req, res) => {
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

app.patch('/api/courses/:CourseCode/units',async (req,res)=>{
  try{
    const {CourseCode} = req.params;
    const unit = req.body as IUnit;

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


app.get('/api/FectchStundentDetail/:studentID',async (req,res)=>{
    const {studentID} = req.params;
    try{
      
      const student = await StudentSchema.findOne({studentId:studentID });
      res.json(student);
    }catch(error){
      console.error('Error fetching student:', error);
      res.status(500).json({ message: 'Internal server error' });
    }


})

app.get('/api/FetchCourses', async (req, res) => {
  try {
    const courses = await CourseSchema.find();
    res.json(courses);
  }catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.patch('/api/UpdateLearningStatus/:courseCode',async (req,res)=>{  
  const {courseCode} = req.params;
  const {studentId,status} = req.body;
  try{
      const updatedStudent = await StudentSchema.updateOne(
        {studentId: studentId,
          "enrolledCourses.course" : courseCode
        },
        {$set: {
          "enrolledCourses.$.status" :status
        }}
      );

    if(updatedStudent.matchedCount === 0){
      return res.status(404).json({ message: 'couldnt update the status' });
    }

    if (!updatedStudent) {
      return res.status(404).json({
          message: 'student not found'
      });
    }

  }catch(error){
      return res.status(500).json({
            message: 'Failed to Upodate status' + error
      });
  }


});

app.patch('/api/UpdateLearningProgress/:courseCode',async (req,res)=>{
  const {courseCode} = req.params;
  const {studentId,progress,itemId} = req.body;
  try{
    const updatedStudent = await StudentSchema.updateOne(
      {studentId: studentId,
        "enrolledCourses.course" : courseCode
      },{
        $set:{
          "enrolledCourses.$.progress" : progress
        },
        $addToSet:{
          "enrolledCourses.$.completedItems": itemId
        }
      }
    )

    if(updatedStudent.matchedCount === 0){
      return res.status(404).json({ message: 'couldnt update the progress' });
    }

    if (!updatedStudent) {
      return res.status(404).json({
          message: 'student not found'
      });
    }

  }catch(error){
      return res.status(500).json({
            message: 'Failed to Update progress' + error
      });
  }


});

app.get('/api/FetchCompletedItemIds/:courseCode',async (req,res)=>{
  const {courseCode} = req.params;
  const studentId = req.query.studentId as string;
  try{
    const FetchedStudent = await StudentSchema.findOne({ studentId: studentId });
    const enrollment = FetchedStudent?.enrolledCourses.find(e => e.course === courseCode);

    res.status(200).json({ completedItems: enrollment?.completedItems || [] });
  }catch(error){
      return res.status(500).json({
            message: 'Failed to fetch items' + error
      });
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
  const faculty = req.body as Partial<IFaculty>; 
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

app.patch('/api/EnrollCourse/:studentId',async (req,res) =>{
  const {studentId } =  req.params;
  const course = req.body as IEnrolledCourse;
  try{

    const EnrollCourse = await StudentSchema.updateOne(
      {studentId: studentId},
      { $push: { enrolledCourses: course } },
      {runValidators: true }
    );
    if(EnrollCourse.matchedCount ===0){
      return res.status(404).json({ message: 'Course not found' });
    }

    if (!EnrollCourse) {
      return res.status(404).json({
          message: 'Course not found'
      });
    }
    
    return res.status(200).json({
      message: 'Enrolled successfully',
      course: EnrollCourse
    });
  }catch(error){
      return res.status(500).json({
            message: 'Failed to add unit' + error
      });
  }
});

app.get('/api/FetchStudentEnrolledCourses/:StudentId',async(req,res)=>{
      const {StudentId} = req.params;

      try{
        const student = await StudentSchema.findOne({studentId : StudentId});
        
        if(!student){
          return res.status(404).json({ message: 'Student not found' });
        }
        
        return res.status(200).json({
              message: 'Enrolled successfully',
              courses: student.enrolledCourses 
        });


      }catch(error){
          return res.status(500).json({
            message: 'Failed to Fetch enrolled courses' + error
        });
      }

});

app.post('/api/FetchFacultyEnrolledCourses/:FacultyId',async(req,res)=>{
      const {FacultyId} = req.params;

      try{
        const faculty = await StudentSchema.findOne({studentId : FacultyId});
        
        if(!faculty){
          return res.status(404).json({ message: 'Student not found' });
        }
        
        return res.status(200).json({
              message: 'Enrolled successfully',
              courses: faculty.enrolledCourses as IEnrolledCourse[]
        });


      }catch(error){
          return res.status(500).json({
            message: 'Failed to Fetch enrolled courses' + error
        });
      }

});

app.post('/api/FetchStudent/:studentEmailId', async (req, res) => {
  const { studentEmailId } = req.params;
  const password = req.body.password as string; 
  try {

    const user = await UserSchema.findOne({
      email: studentEmailId
    }).select("+passwordHash");
    
    const student = await StudentSchema.findOne({
      email: studentEmailId
    });

    if (!user || !student) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(
        password,
        user.passwordHash
    ); 
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

     return res.json({
            id: user._id.toString(),
            name: student?.name,
            email: student?.email,
            studentId: student?.studentId,
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
  const password = req.body.password as string; 
  try {

    const user = await UserSchema.findOne({
      email: facultyEmailId
    }).select("+passwordHash");
    
    const faculty = await FacultySchema.findOne({
      email: facultyEmailId
    });

    if (!user || !faculty) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const isPasswordValid = await bcrypt.compare(
        password,
        user.passwordHash
    ); 
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }


     return res.json({
            id: faculty._id.toString(),
            name: faculty.name,
            email: faculty.email,
            facultyId: faculty.facultyId,
            role: 'faculty'
        });
    
  } catch (error) {
    console.error('Error fetching faculty:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

