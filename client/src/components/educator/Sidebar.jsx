import React, { useContext } from 'react';
import { assets } from '../../assets/assets';
import { AppContext } from '../../context/appcontext';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const { isEducator } = useContext(AppContext);
  
  const menuItems = [
    { name: 'Dashboard', path: '/educator', icon: assets.home_icon },
    { name: 'Add Course', path: '/educator/add-course', icon: assets.add_icon },
    { name: 'My Course', path: '/educator/my-course', icon: assets.my_course_icon },
    { name: 'Students Enrolled', path: '/educator/student-enrolled', icon: assets.person_tick_icon },
  ];

  return isEducator && (
    <div className='bg-white border-r border-gray-300 min-h-screen w-16 md:w-64 flex flex-col p-2'>
      {menuItems.map((item) => (
        <NavLink
          to={item.path}
          key={item.name}
          className="flex flex-col items-center md:flex-row md:items-center p-2 hover:bg-gray-100 rounded transition"
        >
          <img src={item.icon} alt="" className="w-6 h-6" />
          <p className="hidden md:block ml-2">{item.name}</p>
        </NavLink>
      ))}
    </div>
  );
};

export default Sidebar;
