import React, { useState, useEffect } from "react";
import { wallpaperAPI } from "@/services/api";
import { storage } from "@/services/supabase";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import {
    PlusIcon,
    PencilIcon,
    TrashIcon,
    PhotoIcon,
} from "@heroicons/react/24/outline";

// Validation schema for wallpaper form
const WallpaperSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
});

const AdminWallpapers = () => {
    const [wallpapers, setWallpapers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedWallpaper, setSelectedWallpaper] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    // Fetch wallpapers on component mount
    useEffect(() => {
        const fetchWallpapers = async () => {
            try {
                setLoading(true);
                const response = await wallpaperAPI.getAll();
                setWallpapers(response.data);
            } catch (error) {
                console.error("Error fetching wallpapers:", error);
                toast.error("Failed to load wallpapers");
            } finally {
                setLoading(false);
            }
        };

        fetchWallpapers();
    }, []);

    // Open form for creating a new wallpaper
    const handleAddNew = () => {
        setSelectedWallpaper(null);
        setImageFile(null);
        setPreviewUrl(null);
        setIsFormOpen(true);
    };

    // Open form for editing an existing wallpaper
    const handleEdit = (wallpaper) => {
        setSelectedWallpaper(wallpaper);
        setImageFile(null);
        setPreviewUrl(wallpaper.image_url);
        setIsFormOpen(true);
    };

    // Handle form submission
    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const formData = new FormData();
            formData.append("name", values.name);

            if (imageFile) {
                formData.append("image_file", imageFile);
            } else if (selectedWallpaper) {
                // If editing and no new file is selected, use the existing URL
                formData.append("image_url", selectedWallpaper.image_url);
            }

            let response;
            if (selectedWallpaper) {
                // Update existing wallpaper
                response = await wallpaperAPI.update(
                    selectedWallpaper.id,
                    formData
                );

                // Update the wallpapers list
                setWallpapers(
                    wallpapers.map((wallpaper) =>
                        wallpaper.id === selectedWallpaper.id
                            ? response.data
                            : wallpaper
                    )
                );

                toast.success("Wallpaper updated successfully");
            } else {
                // Create new wallpaper
                if (!imageFile && !values.image_url) {
                    throw new Error("Please upload an image file");
                }

                response = await wallpaperAPI.create(formData);

                // Add new wallpaper to the list
                setWallpapers([...wallpapers, response.data]);

                toast.success("Wallpaper created successfully");
            }

            // Close form and reset
            setIsFormOpen(false);
            resetForm();
            setSelectedWallpaper(null);
            setImageFile(null);
            setPreviewUrl(null);
        } catch (error) {
            console.error("Error saving wallpaper:", error);
            toast.error(error.message || "Failed to save wallpaper");
        } finally {
            setSubmitting(false);
        }
    };

    // Handle wallpaper deletion
    const handleDelete = async (wallpaperId) => {
        if (
            !window.confirm(
                "Are you sure you want to delete this wallpaper? This may affect songs using it."
            )
        ) {
            return;
        }

        try {
            await wallpaperAPI.delete(wallpaperId);

            // Update the wallpapers list
            setWallpapers(
                wallpapers.filter((wallpaper) => wallpaper.id !== wallpaperId)
            );

            toast.success("Wallpaper deleted successfully");
        } catch (error) {
            console.error("Error deleting wallpaper:", error);
            toast.error("Failed to delete wallpaper");
        }
    };

    // Handle image file selection
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImageFile(file);

            // Create preview URL
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);

            // Clean up preview URL when component unmounts
            return () => URL.revokeObjectURL(url);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    return (
        <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">
                    Manage Wallpapers
                </h2>
                <button
                    type="button"
                    onClick={handleAddNew}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                    <PlusIcon
                        className="-ml-1 mr-2 h-5 w-5"
                        aria-hidden="true"
                    />
                    Add New
                </button>
            </div>

            {isFormOpen && (
                <div className="p-6 bg-gray-50 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        {selectedWallpaper
                            ? "Edit Wallpaper"
                            : "Add New Wallpaper"}
                    </h3>

                    <Formik
                        initialValues={{
                            name: selectedWallpaper?.name || "",
                        }}
                        validationSchema={WallpaperSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form className="space-y-4">
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Name
                                    </label>
                                    <Field
                                        id="name"
                                        name="name"
                                        type="text"
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                    />
                                    <ErrorMessage
                                        name="name"
                                        component="div"
                                        className="mt-1 text-sm text-red-600"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="image_file"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Image File{" "}
                                        {selectedWallpaper
                                            ? "(Leave empty to keep current file)"
                                            : ""}
                                    </label>
                                    <input
                                        id="image_file"
                                        name="image_file"
                                        type="file"
                                        accept="image/jpeg,image/png,image/gif,image/jpg"
                                        onChange={handleFileChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                    />
                                </div>

                                {previewUrl && (
                                    <div className="mt-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Preview
                                        </label>
                                        <div className="relative h-64 w-full overflow-hidden rounded-lg">
                                            <img
                                                src={previewUrl}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsFormOpen(false);
                                            setSelectedWallpaper(null);
                                            setPreviewUrl(null);
                                        }}
                                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting
                                            ? "Saving..."
                                            : selectedWallpaper
                                            ? "Update"
                                            : "Create"}
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            )}

            <div className="p-6">
                {wallpapers.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        <PhotoIcon className="h-12 w-12 mx-auto text-gray-400" />
                        <p className="mt-2 text-lg">No wallpapers found</p>
                        <p className="text-sm">
                            Click "Add New" to create your first wallpaper
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {wallpapers.map((wallpaper) => (
                            <div
                                key={wallpaper.id}
                                className="bg-gray-50 rounded-lg overflow-hidden shadow-sm"
                            >
                                <div className="h-48 w-full relative">
                                    <img
                                        src={wallpaper.image_url}
                                        alt={wallpaper.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-2 right-2 flex space-x-2">
                                        <button
                                            onClick={() =>
                                                handleEdit(wallpaper)
                                            }
                                            className="p-1 bg-white rounded-full text-primary-600 hover:text-primary-900 shadow"
                                        >
                                            <PencilIcon className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDelete(wallpaper.id)
                                            }
                                            className="p-1 bg-white rounded-full text-red-600 hover:text-red-900 shadow"
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="text-lg font-medium text-gray-900">
                                        {wallpaper.name}
                                    </h3>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminWallpapers;
