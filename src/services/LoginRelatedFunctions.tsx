import { useState, useEffect } from 'react'
import type {IStudent,ILogin} from '../types.ts'
import { getStudentData,RegisterUser } from './LoginServices.tsx'


export async function VerifyStudentData(studentEmailId: string, password: string) : Promise<ILogin> {

    try{
        const data = await getStudentData(studentEmailId, password);
        return data;

    }catch (error) {
        console.error('Error in VerifyStudentData:', error);
        throw error;
    }
    
};

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
