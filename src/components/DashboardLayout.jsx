import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
    LayoutDashboard,
    ShoppingCart,
    Package,
    DollarSign,
    ClipboardList,
    LogOut,
    Menu,
    X,
    Moon,
    Sun,
    User,
    Settings as SettingsIcon,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';

const DashboardLayout = () => {
    const { currentUser, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const menuItems = [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/transactions', icon: ShoppingCart, label: 'Transaksi' },
        { path: '/finance', icon: DollarSign, label: 'Keuangan' },
        { path: '/inventory', icon: Package, label: 'Stok Barang' },
        { path: '/stock-opname', icon: ClipboardList, label: 'Stock Opname' },
        { path: '/settings', icon: SettingsIcon, label: 'Pengaturan' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Mobile menu button */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md"
            >
                {sidebarOpen ? (
                    <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                ) : (
                    <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                )}
            </button>

            {/* Sidebar */}
            <aside
                className={`
          fixed top-0 left-0 z-40 h-screen bg-white dark:bg-gray-800 shadow-lg
          transform transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
          ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'}
        `}
            >
                <div className="flex flex-col h-full">
                    {/* Logo & Toggle */}
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div className={`flex items-center space-x-3 ${sidebarCollapsed ? 'lg:hidden' : ''}`}>
                                <div className="bg-primary-600 p-2 rounded-lg">
                                    <ShoppingCart className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                                        Kasir POS
                                    </h1>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Sistem Pencatatan
                                    </p>
                                </div>
                            </div>

                            {/* Collapsed logo */}
                            <div className={`bg-primary-600 p-2 rounded-lg ${sidebarCollapsed ? 'lg:block' : 'lg:hidden'} hidden`}>
                                <ShoppingCart className="w-6 h-6 text-white" />
                            </div>

                            {/* Desktop toggle button */}
                            <button
                                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                                className="hidden lg:block p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                {sidebarCollapsed ? (
                                    <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                                ) : (
                                    <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                        {menuItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={() => setSidebarOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center ${sidebarCollapsed ? 'lg:justify-center' : 'space-x-3'} px-4 py-3 rounded-lg transition-colors ${isActive
                                        ? 'bg-primary-600 text-white'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`
                                }
                                title={sidebarCollapsed ? item.label : ''}
                            >
                                <item.icon className="w-5 h-5 flex-shrink-0" />
                                <span className={`font-medium ${sidebarCollapsed ? 'lg:hidden' : ''}`}>
                                    {item.label}
                                </span>
                            </NavLink>
                        ))}
                    </nav>

                    {/* User profile & actions */}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                        {/* User info */}
                        {!sidebarCollapsed && (
                            <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg lg:block">
                                <div className="bg-primary-600 p-2 rounded-full">
                                    <User className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                        {currentUser?.name}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                        {currentUser?.email}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Collapsed user icon */}
                        {sidebarCollapsed && (
                            <div className="hidden lg:flex justify-center px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div className="bg-primary-600 p-2 rounded-full">
                                    <User className="w-4 h-4 text-white" />
                                </div>
                            </div>
                        )}

                        {/* Theme toggle */}
                        <button
                            onClick={toggleTheme}
                            className={`w-full flex items-center ${sidebarCollapsed ? 'lg:justify-center' : 'space-x-3'} px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
                            title={sidebarCollapsed ? (theme === 'light' ? 'Mode Gelap' : 'Mode Terang') : ''}
                        >
                            {theme === 'light' ? (
                                <>
                                    <Moon className="w-5 h-5 flex-shrink-0" />
                                    <span className={`font-medium ${sidebarCollapsed ? 'lg:hidden' : ''}`}>Mode Gelap</span>
                                </>
                            ) : (
                                <>
                                    <Sun className="w-5 h-5 flex-shrink-0" />
                                    <span className={`font-medium ${sidebarCollapsed ? 'lg:hidden' : ''}`}>Mode Terang</span>
                                </>
                            )}
                        </button>

                        {/* Logout */}
                        <button
                            onClick={handleLogout}
                            className={`w-full flex items-center ${sidebarCollapsed ? 'lg:justify-center' : 'space-x-3'} px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors`}
                            title={sidebarCollapsed ? 'Logout' : ''}
                        >
                            <LogOut className="w-5 h-5 flex-shrink-0" />
                            <span className={`font-medium ${sidebarCollapsed ? 'lg:hidden' : ''}`}>Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Backdrop for mobile */}
            {sidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main content */}
            <main className={`min-h-screen transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
                <div className="p-4 lg:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
