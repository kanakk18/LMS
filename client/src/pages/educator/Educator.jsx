import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '../../components/educator/NavBar';
import Sidebar from '../../components/educator/sidebar';
import Footer from '../../components/students/Footer';
import Temp from './temp';

const Educator = () => {
  return (
    <div className='flex flex-col min-h-screen'>
      <NavBar />
      <div className='flex flex-1'>
        <Sidebar />
        <div className='flex-1 p-4 bg-gray-50'>
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Educator;
