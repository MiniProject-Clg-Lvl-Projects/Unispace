import { useState, useEffect } from 'react'
import type {IStudent,ILogin,IFaculty} from '../types.ts'
import { getStudentData,getFacultyData,RegisterUser,RegisterStudentData,RegisterFacultyData,} from './LoginServices.tsx'


export async function VerifyStudentData(studentEmailId: string, password: string) : Promise<IStudent> {
    try{
        const data = await getStudentData(studentEmailId, password);
        
        return data;
    }catch (error) {
        console.error('Error in VerifyStudentData:', error);
        throw error;
    }
    
};

export async function VerifyFacultyData(facultyEmailId: string, password: string) : Promise<IFaculty> {
    try{
        const data = await getFacultyData(facultyEmailId, password);
        return data;
    }catch (error) {
        console.error('Error in VerifyFacultyData:', error);
        throw error;
    }
    
};


export async function AddFacultyData(User: Partial<IFaculty>) {
  try {
    const data = await RegisterFacultyData(User);

    return data;
  } catch (error) {
    console.error('Error registering faculty:', error);
    throw error;
  }
}

export async function AddStudentData(student: Partial<IStudent>) {
  try {
    const data = await RegisterStudentData(student);
    return data;
  } catch (error) {
    console.error('Error registering student:', error);
    throw error;
  }
}

export async function AddUserData(User: Partial<ILogin>) {
  try {
    const data = await RegisterUser(User);
    console.log('User registered successfully:', data);
    return data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
}
