import React, { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Login from "./Login";
import Register from "./Register";

const AuthModal = ({ isOpen, onClose, onSuccess }) => {
    const [mode, setMode] = useState("login"); // 'login' or 'register'

    const handleSuccess = () => {
        onSuccess();
        onClose();
    };

    const toggleMode = () => {
        setMode(mode === "login" ? "register" : "login");
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <div className="absolute top-0 right-0 pt-4 pr-4">
                                    <button
                                        type="button"
                                        className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                                        onClick={onClose}
                                    >
                                        <span className="sr-only">Close</span>
                                        <XMarkIcon
                                            className="h-6 w-6"
                                            aria-hidden="true"
                                        />
                                    </button>
                                </div>

                                <Dialog.Title
                                    as="h3"
                                    className="text-center text-lg font-medium leading-6 text-gray-900 mt-2"
                                >
                                    {mode === "login"
                                        ? "Sign in to your account"
                                        : "Create a new account"}
                                </Dialog.Title>

                                <div className="mt-4">
                                    {mode === "login" ? (
                                        <Login onSuccess={handleSuccess} />
                                    ) : (
                                        <Register onSuccess={handleSuccess} />
                                    )}

                                    <div className="mt-4 text-center text-sm">
                                        <button
                                            type="button"
                                            onClick={toggleMode}
                                            className="text-primary-600 hover:text-primary-500 font-medium"
                                        >
                                            {mode === "login"
                                                ? "Don't have an account? Sign up"
                                                : "Already have an account? Sign in"}
                                        </button>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default AuthModal;
