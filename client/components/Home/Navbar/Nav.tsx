"use client";

import React from "react";
import Link from "next/link";
import { HiBars3BottomRight } from "react-icons/hi2";

import axios from "axios";
import { useRouter } from "next/navigation"; // Import useRouter

// import SearchBar from '@/components/Helper/SearchBar'; // Import SearchBar
// import Profile from '@/components/Helper/Profile'; // Import Profile
import {
  navLinks1,
  navLinks2,
  getDataFromLocalStorage,
} from "@/constant/constant";
import Profile from "@/components/Helper/Profile";
import { axiosInstance } from "@/config/axiosInstnace";


type Props = {
  openNav: () => void;
  openSignIn: () => void;
};


const Nav = ({ openNav, openSignIn }: Props) => {
  const router = useRouter()
  const handleLogout =()=>{
    localStorage.removeItem('user-plans')
    localStorage.removeItem('app-user')
    axiosInstance.post('/api/auth/logout')
    router.push('/')
  }
  return (
    // Sticky navigation bar at the top
    <div className="fixed top-0 bg-custom-green-dark w-full z-[1000]">
      {/* Navigation container without any unnecessary margin or padding */}
      <div className="flex items-center h-[12vh] justify-between w-[90%] xl:w-[80%] mx-auto">
        {/* Logo */}
        <h2 className="font-extrabold text-white text-[2rem]">EduPlus</h2>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-10">
          {getDataFromLocalStorage() ? (
            <>
              {navLinks1.map((link) => (
                <Link key={link.id} href={link.url}>
                  <p className="nav__link text-white">{link.label}</p>
                </Link>
              ))}

              <button onClick={handleLogout}>logout</button>
  <Profile />
              {/* router.push("/Profile"); // Navigate to the Daily Study page */}

            </>
          ) : (
            <>
              {navLinks2.map((link) => (
                <Link key={link.id} href={link.url}>
                  <p className="nav__link text-white">{link.label}</p>
                </Link>
              ))}

              <button
                onClick={openSignIn}
                className="px-4 py-1 text-white font-semibold text-sm bg-green-500 hover:bg-green-600 transition-all rounded-lg md:px-8 md:py-2 md:text-base md:font-semibold"
              >
                Get Started
              </button>
            </>
          )}
        </div>

        {/* Hamburger Menu */}
        <HiBars3BottomRight
          onClick={openNav}
          className="w-8 h-8 cursor-pointer text-white lg:hidden"
        />
      </div>
    </div>
  );
};

export default Nav;
