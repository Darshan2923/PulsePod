import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { HiOutlineHashtag, HiOutlineHome, HiOutlineMenu, HiOutlinePhotograph, HiOutlineUserGroup } from 'react-icons/hi';
import { RiCloseLine } from 'react-icons/ri';
import { FaUpload, FaSignInAlt, FaHeart } from 'react-icons/fa';

import logo from '../assets/logo_brand.png';

const links = [
    { name: 'Discover', to: '/', icon: HiOutlineHome },
    { name: 'Around You', to: '/search', icon: HiOutlinePhotograph },
    { name: 'Favourites', to: '/favourites', icon: FaHeart },
    // { name: 'Upload', to: '/', icon: FaUpload },
    // { name: 'Login', to: '/', icon: FaSignInAlt },
    // { name: 'Top Charts', to: '/top-charts', icon: HiOutlineHashtag },
];

const NavLinks = ({ handleClick }) => (
    <div className="mt-10">
        {links.map((item) => (
            <NavLink
                key={item.name}
                to={item.to}
                className="flex flex-row justify-start items-center my-2 md:pl-[20px] p-[20px] text-3xl font-medium text-gray-400 hover:bg-custpurple"
                onClick={() => handleClick && handleClick()}
            >
                <item.icon className="w-8 h-8 mr-4" />
                {item.name}
            </NavLink>
        ))}
    </div>
);

const Sidebar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
            {/* Navbar at top */}
            <nav className="fixed w-full">
                <div className="flex justify-end items-center px-12 py-10">
                    <div className="space-x-8">
                        <button>
                            <i className="fas fa-bell text-cust2purple text-3xl"></i>
                        </button>
                        <button>
                            <i className="fas fa-user text-cust2purple text-3xl"></i>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Sidebar stuff */}
            <div className="md:flex hidden h-[100vh] flex-col w-[240px] pb-10 pt-6 px-4 bg-black z-10 fixed">
                <img src={logo} alt="logo" className="w-full h-17 object-cover mb-[-15px] p-[-20px]" />
                <NavLinks />
                <div className="h-[1px] bg-gray-500 "></div>
                <NavLink className="flex flex-row justify-start items-center my-4 md:pl-[20px] p-[20px] text-3xl font-medium text-gray-400 hover:bg-custpurple" onClick={() => handleClick && handleClick()}>
                    <FaUpload className="w-8 h-8 mr-4" />
                    Upload
                </NavLink>
                <NavLink className="flex flex-row justify-start items-center md:pl-[20px] p-[20px] text-3xl font-medium text-gray-400 hover:bg-custpurple" onClick={() => handleClick && handleClick()}>
                    <FaSignInAlt className="w-8 h-8 mr-4" />
                    Login
                </NavLink>
            </div>

            {/* Mobile sidebar */}
            <div className="absolute md:hidden block top-6 left-3">
                {!mobileMenuOpen ? (
                    <HiOutlineMenu className="w-6 h-6 mr-2 text-white" onClick={() => setMobileMenuOpen(true)} />
                ) : (
                    <RiCloseLine className="w-6 h-6 mr-2 text-white" onClick={() => setMobileMenuOpen(false)} />
                )}
            </div>

            <div className={`absolute top-0 h-screen w-2/3 bg-gradient-to-tl from-white/10 to-[#483D8B] backdrop-blur-lg z-10 p-6 md:hidden smooth-transition ${mobileMenuOpen ? 'left-0' : '-left-full'}`}>
                <img src={logo} alt="logo" className="w-full h-14 object-contain" />
                <NavLinks handleClick={() => setMobileMenuOpen(false)} />
            </div>
        </>
    );
};

export default Sidebar;