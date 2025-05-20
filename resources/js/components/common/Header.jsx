import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "@/components/auth/AuthModal";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const Header = () => {
    const { user, signOut, loading } = useAuth();
    const [showAuthModal, setShowAuthModal] = useState(false);

    const handleAuthClick = () => {
        if (!user) {
            setShowAuthModal(true);
        }
    };

    return (
        <header className="w-full bg-transparent">
            <Disclosure as="nav" className="px-4 py-2">
                {({ open }) => (
                    <>
                        <div className="relative flex items-center justify-between">
                            {/* Logo */}
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <img
                                        className="h-10 w-auto"
                                        src="/assets/logo.svg"
                                        alt="Pomodoro Music"
                                    />
                                </div>
                                <h1 className="ml-2 text-xl font-bold text-white">
                                    Pomodoro Music
                                </h1>
                            </div>

                            {/* User Menu */}
                            <div className="flex items-center">
                                {loading ? (
                                    <div className="animate-pulse h-8 w-24 bg-white bg-opacity-20 rounded"></div>
                                ) : user ? (
                                    <Menu as="div" className="relative ml-3">
                                        <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                            <span className="sr-only">
                                                Open user menu
                                            </span>
                                            <div className="h-8 w-8 rounded-full bg-primary-700 flex items-center justify-center text-white">
                                                {user.user_metadata
                                                    ?.full_name?.[0] ||
                                                    user.email?.[0] ||
                                                    "?"}
                                            </div>
                                        </Menu.Button>
                                        <Transition
                                            enter="transition ease-out duration-100"
                                            enterFrom="transform opacity-0 scale-95"
                                            enterTo="transform opacity-100 scale-100"
                                            leave="transition ease-in duration-75"
                                            leaveFrom="transform opacity-100 scale-100"
                                            leaveTo="transform opacity-0 scale-95"
                                        >
                                            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                <Menu.Item>
                                                    <div className="block px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                                                        <p className="font-medium">
                                                            {user.user_metadata
                                                                ?.full_name ||
                                                                "User"}
                                                        </p>
                                                        <p className="text-gray-500 truncate">
                                                            {user.email}
                                                        </p>
                                                    </div>
                                                </Menu.Item>
                                                <Menu.Item>
                                                    <button
                                                        onClick={signOut}
                                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    >
                                                        Sign out
                                                    </button>
                                                </Menu.Item>
                                            </Menu.Items>
                                        </Transition>
                                    </Menu>
                                ) : (
                                    <button
                                        onClick={handleAuthClick}
                                        className="rounded-md bg-primary-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                                    >
                                        Sign in
                                    </button>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </Disclosure>

            {/* Auth Modal */}
            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                onSuccess={() => setShowAuthModal(false)}
            />
        </header>
    );
};

export default Header;
