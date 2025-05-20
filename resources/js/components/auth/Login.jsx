import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";

// Validation schema
const LoginSchema = Yup.object().shape({
    email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
});

const Login = ({ onSuccess }) => {
    const { signIn, signInWithGoogle } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            setLoading(true);
            await signIn({
                email: values.email,
                password: values.password,
            });

            toast.success("Signed in successfully");
            resetForm();
            onSuccess();
        } catch (error) {
            console.error("Login error:", error);
            toast.error(error.message || "Failed to sign in");
        } finally {
            setLoading(false);
            setSubmitting(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            setLoading(true);
            await signInWithGoogle();
            // Note: onSuccess will be triggered by the auth state change
        } catch (error) {
            console.error("Google sign-in error:", error);
            toast.error(error.message || "Failed to sign in with Google");
            setLoading(false);
        }
    };

    return (
        <div>
            <Formik
                initialValues={{ email: "", password: "" }}
                validationSchema={LoginSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form className="space-y-4">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Email address
                            </label>
                            <Field
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                            />
                            <ErrorMessage
                                name="email"
                                component="div"
                                className="mt-1 text-sm text-red-600"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Password
                            </label>
                            <Field
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                            />
                            <ErrorMessage
                                name="password"
                                component="div"
                                className="mt-1 text-sm text-red-600"
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isSubmitting || loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting || loading
                                    ? "Signing in..."
                                    : "Sign in"}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>

            <div className="mt-4">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">
                            Or continue with
                        </span>
                    </div>
                </div>

                <div className="mt-4">
                    <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                        className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                            <path
                                d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.798-1.677-4.198-2.707-6.735-2.707-5.523 0-10 4.477-10 10s4.477 10 10 10c8.837 0 10.786-8.137 9.978-11.596l-9.978-0.065z"
                                fill="#4285F4"
                            />
                        </svg>
                        Google
                    </button>
                </div>
            </div>
        </div>
    );
};
