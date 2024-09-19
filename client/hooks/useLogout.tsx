'use client'
import {useState} from 'react';
import {useAuth} from '../context/AuthContext';
import {config} from '../config/config';
import {useRouter} from 'next/navigation';
import {toast} from 'react-hot-toast'


const useLogout = ():[() => Promise<void>] => {
    const {setAuthUser, setIsAuthenticated} = useAuth();
    const router = useRouter();

    const logout = async () => {
        //put axios call here to logout
        setAuthUser(null);
        localStorage.removeItem('app-user');
        setIsAuthenticated(false);
        toast.success('Successfully logged out!');
        router.push('/');
    } 

    return [logout];
}