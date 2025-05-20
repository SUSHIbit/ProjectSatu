import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { adminAPI } from "@/services/api";
import toast from "react-hot-toast";
import {
    Bars3Icon,
    XMarkIcon,
    MusicalNoteIcon,
    PhotoIcon,
    TagIcon,
    ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { Disclosure, Menu, Transition } from "@headlessui/react";

const navigation = [
    { name: "Songs", href: "/songs", icon: MusicalNoteIcon },
    { name: "Wallpapers", href: "/wallpapers", icon: PhotoIcon },
    { name: "Genres", href: "/genres", icon: TagIcon },
];

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is authenticated
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await adminAPI.getUser();
                setUser(response.data);
            } catch (error) {
                console.error("Authentication error:", error);
                toast.error("Please login to access the admin panel");
                navigate("/login");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [navigate]);

    const handleLogout = async () => {
        try {
            await adminAPI.logout();
            toast.success("Logged out successfully");
            navigate("/login");
        } catch (error) {
            console.error("Logout error:", error);
            toast.error("Failed to logout");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Disclosure as="nav" className="bg-primary-800">
                {({ open }) => (
                    <>
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="flex h-16 items-center justify-between">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <Link
                                            to="/"
                                            className="flex items-center"
                                        >
                                            <img
                                                className="h-8 w-auto"
                                                src="/assets/logo.svg"
                                                alt="Pomodoro Music"
                                            />
                                            <span className="ml-2 text-white font-semibold text-lg">
                                                Admin
                                            </span>
                                        </Link>
                                    </div>
                                    <div className="hidden md:block">
                                        <div className="ml-10 flex items-baseline space-x-4">
                                            {navigation.map((item) => {
                                                const isActive =
                                                    location.pathname ===
                                                    item.href;
                                                return (
                                                    <Link
                                                        key={item.name}
                                                        to={item.href}
                                                        className={`
                              ${
                                  isActive
                                      ? "bg-primary-900 text-white"
                                      : "text-gray-300 hover:bg-primary-700 hover:text-white"
                              }
                              px-3 py-2 rounded-md text-sm font-medium flex items-center
                            `}
                                                    >
                                                        <item.icon className="h-5 w-5 mr-2" />
                                                        {item.name}
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                                <div className="hidden md:block">
                                    <div className="ml-4 flex items-center md:ml-6">
                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className="flex items-center rounded-md bg-primary-700 px-3 py-2 text-sm font-medium text-white hover:bg-primary-600"
                                        >
                                            <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-1" />
                                            Logout
                                        </button>
                                    </div>
                                </div>
                                <div className="-mr-2 flex md:hidden">
                                    {/* Mobile menu button */}
                                    <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-primary-800 p-2 text-primary-400 hover:bg-primary-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-800">
                                        <span className="sr-only">
                                            Open main menu
                                        </span>
                                        {open ? (
                                            <XMarkIcon
                                                className="block h-6 w-6"
                                                aria-hidden="true"
                                            />
                                        ) : (
                                            <Bars3Icon
                                                className="block h-6 w-6"
                                                aria-hidden="true"
                                            />
                                        )}
                                    </Disclosure.Button>
                                </div>
                            </div>
                        </div>

                        <Disclosure.Panel className="md:hidden">
                            <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
                                {navigation.map((item) => {
                                    const isActive =
                                        location.pathname === item.href;
                                    return (
                                        <Link
                                            key={item.name}
                                            to={item.href}
                                            className={`
                        ${
                            isActive
                                ? "bg-primary-900 text-white"
                                : "text-gray-300 hover:bg-primary-700 hover:text-white"
                        }
                        block px-3 py-2 rounded-md text-base font-medium flex items-center
                      `}
                                        >
                                            <item.icon className="h-5 w-5 mr-2" />
                                            {item.name}
                                        </Link>
                                    );
                                })}
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="mt-3 flex w-full items-center justify-center rounded-md bg-primary-700 px-3 py-2 text-base font-medium text-white hover:bg-primary-600"
                                >
                                    <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2" />
                                    Logout
                                </button>
                            </div>
                        </Disclosure.Panel>
                    </>
                )}
            </Disclosure>

            <header className="bg-white shadow">
                <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-bold text-gray-900">
                        {navigation.find(
                            (item) => location.pathname === item.href
                        )?.name || "Admin Panel"}
                    </h1>
                </div>
            </header>

            <main>
                <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
