"use client"
import React, { useState, useEffect } from "react";
import { FaHome, FaShoppingCart, FaEnvelope, FaPlus, FaTimes, FaStar, FaHeart, FaRegStar } from "react-icons/fa";
import { HashRouter as Router, Routes, Route, Link} from "react-router-dom";

import Panel from './Panel';
import Landing from './Landing';

const Sidebar = () => {
  const Menus = [
    { name: "Yıldız", icon: <FaStar />, link: "/#", dis: "translate-x-0" },
    { name: "Mağaza", icon: <FaShoppingCart />, link: "/panel", dis: "translate-x-16" },
    { name: "Remote", icon: <FaHome />, link: "/#", dis: "translate-x-32" },
    { name: "İletişim", icon: <FaEnvelope />, link: "/#", dis: "translate-x-48" },
    { name: "Kalp", icon: <FaHeart />, link: "/#", dis: "translate-x-64" },
    { name: "Favoriler", icon: <FaRegStar />, link: "/#", dis: "translate-x-80" },
  ];
  const [active, setActive] = useState(2);
  const [isOpen, setIsOpen] = useState(false);
  const selectedMenu = Menus[active];

  return (
    <Router>
      <div className={`fixed inset-x-0 bottom-0 bg-teal-50 max-w-md mx-auto px-6 py-1 rounded-full z-10 transition-all duration-500 transform ${isOpen ? 'translate-y-0 mb-1.5 max-h-12' : 'translate-y-full'}`}>
        <ul className={`flex relative ${isOpen ? 'opacity-100 transition-opacity duration-2000' : 'opacity-0'}`}>
          <span
            className={`duration-500 ${selectedMenu.dis} border-3 border-pink-500 mb-7 h-12 w-12 absolute
           -top-5 rounded-full flex items-center justify-center transition-all ease-in-out`}
            style={{ background: 'linear-gradient(to right, #FFE5E5, #E0AED0, #AC87C5)' }}>
            {isOpen ? <FaTimes className="cursor-pointer" onClick={() => setIsOpen(false)} /> : selectedMenu.icon}
          </span>
          {Menus.map((menu, i) => (
            <li key={i} className="w-12 h-12 mb-4 mt-4 m-2 pb-5 flex justify-center items-center">
              <Link
                to={menu.link}
                className={`text-xs font-thin flex flex-col items-center justify-center ${
                  i === active ? 'text-white' : 'text-black'
                }`}
                onClick={() => setActive(i)}
              >
                <span className="text-xl cursor-pointer duration-500">
                  {menu.icon}
                </span>
                <span
                  className={`${
                    active === i
                      ? "translate-y-0 duration-700 opacity-100"
                      : "opacity-0 translate-y-1"
                  } `}
                >
                  {menu.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <Routes>
        <Route path="/panel" element={<Panel />} />
        <Route path="/" element={<Landing />} />
      </Routes>
      <div className="fixed right-0 bottom-0 m-4 bg-blue-300 text-white rounded-full p-2 transition-transform duration-500"
          onClick={() => setIsOpen(!isOpen)}>
        {!isOpen ? <FaPlus className="transition-transform duration-500" /> : null}
      </div>
    </Router>
  );
};

export default Sidebar;