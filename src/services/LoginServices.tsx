import type { IStudent,IFaculty, IUser, ILogin} from '../types.ts';

export const getStudentData = async (studentEmailId: string, password: string): Promise<ILogin> => {
    // Fetch student data from the server using the provided email ID
    // Encrypt the email ID before sending it to the server for security purposes
    const response = await fetch(`http://localhost:3000/api/FetchStudent/${encodeURIComponent(studentEmailId)}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
    }) 

    const responseText = await response.text();

    if (!response.ok) {
            throw new Error(
          `HTTP ${response.status}: ${responseText}`
    );
    }

  return JSON.parse(responseText) as ILogin;
};

export const RegisterUser = async (user: Partial<ILogin>) => {
  // Might be used to register a new user in the system. This function sends a POST request to the server with the user data.
  // Make sure to encrpyt the user data after sending it to the server for security purposes.
  const response = await fetch('http://localhost:3000/api/RegisterUser', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  }); 
  if (!response.ok) {
    const error = await response.text();
    console.error('API error:', response.status, error);
    throw new Error(`Failed to create user: ${response.status}`);
  }
  return response.json(); 
};

export const RegisterStudentData = async (student: Partial<IStudent>) => {
  const response = await fetch('http://localhost:3000/api/AddStudent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(student),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('API error:', response.status, error);
    throw new Error(`Failed to create faculty: ${response.status}`);
  }
  return response.json();
};

export const RegisterFacultyData = async (faculty: Partial<IFaculty>) => {
  
  const response = await fetch('http://localhost:3000/api/AddFaculty', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(faculty),
  });
  if (!response.ok) {
    const error = await response.text();
    console.error('API error:', response.status, error);
    throw new Error(`Failed to create faculty: ${response.status}`);
  }
  return response.json();
};

