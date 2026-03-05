// import React, { useState } from 'react';
// import { Search, Bell, ChevronDown, Menu, LogOut, User as UserIcon } from 'lucide-react';
// import { NotificationCenter } from '@/app/components/NotificationCenter';
// import { useAuth } from '@/app/context/AuthContext';
// import { useNavigate } from 'react-router-dom';

// interface HeaderProps {
//   onToggleSidebar: () => void;
// }

// export const Header = ({ onToggleSidebar }: HeaderProps) => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [showProfileMenu, setShowProfileMenu] = useState(false);

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   return (
//     <>
//       <header className="h-20 px-4 md:px-8 flex items-center justify-between bg-white/40 backdrop-blur-md border-b border-white/20 sticky top-0 z-40 transition-all">
//         {/* Left Section: Menu Toggle + Search */}
//         <div className="flex items-center gap-4 flex-1 max-w-xl">
//           <button
//             onClick={onToggleSidebar}
//             className="p-2 -ml-2 text-gray-600 hover:bg-white/50 rounded-lg md:hidden"
//           >
//             <Menu size={24} />
//           </button>

//           <div className="relative group w-full max-w-md hidden sm:block">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
//             <input
//               type="text"
//               placeholder="Search for students, teachers, documents..."
//               className="w-full pl-10 pr-4 py-2.5 bg-white/50 border border-white/30 rounded-full text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all shadow-sm"
//             />
//           </div>
//         </div>

//         {/* Right Actions */}
//         <div className="flex items-center gap-2 md:gap-6">
//           <button className="sm:hidden p-2 text-gray-500">
//              <Search size={20} />
//           </button>

//           <button
//             onClick={() => setShowNotifications(true)}
//             className="relative p-2 rounded-full hover:bg-white/50 transition-colors text-gray-500 hover:text-indigo-600"
//           >
//             <Bell size={22} />
//             <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
//           </button>

//           <div className="flex items-center gap-3 pl-2 md:pl-6 border-l border-gray-200/50 relative">
//             <div className="text-right hidden md:block">
//               <p className="text-sm font-semibold text-gray-800">{user?.name || 'Guest User'}</p>
//               <p className="text-xs text-gray-500 capitalize">{user?.role || 'Guest'}</p>
//             </div>
//             <button
//               onClick={() => setShowProfileMenu(!showProfileMenu)}
//               className="flex items-center gap-2 group"
//             >
//               <div className="w-8 h-8 md:w-10 md:h-10 rounded-full p-0.5 bg-gradient-to-tr from-indigo-500 to-purple-500">
//                   <img
//                       src={user?.avatar || "https://images.unsplash.com/photo-1610387694365-19fafcc86d86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHBvcnRyYWl0JTIwYnVzaW5lc3N8ZW58MXx8fHwxNzY5ODE2OTM2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"}
//                       alt={user?.name || 'User'}
//                       className="w-full h-full rounded-full object-cover border-2 border-white"
//                   />
//               </div>
//               <ChevronDown size={16} className="text-gray-400 group-hover:text-gray-600 hidden md:block" />
//             </button>

//             {/* Profile Dropdown */}
//             {showProfileMenu && (
//               <div className="absolute top-full right-0 mt-2 w-56 bg-white/90 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 py-2 z-50">
//                 <div className="px-4 py-3 border-b border-gray-100">
//                   <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
//                   <p className="text-xs text-gray-500">{user?.email}</p>
//                 </div>
//                 <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-indigo-50 flex items-center gap-3">
//                   <UserIcon size={16} />
//                   My Profile
//                 </button>
//                 <button
//                   onClick={handleLogout}
//                   className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
//                 >
//                   <LogOut size={16} />
//                   Logout
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </header>

//       <NotificationCenter
//         isOpen={showNotifications}
//         onClose={() => setShowNotifications(false)}
//       />
//     </>
//   );
// };