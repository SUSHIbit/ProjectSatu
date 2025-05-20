import React, { useState, useEffect } from "react";
import { genreAPI, songAPI } from "@/services/api";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import {
    PlusIcon,
    PencilIcon,
    TrashIcon,
    TagIcon,
    MusicalNoteIcon,
} from "@heroicons/react/24/outline";

// Validation schema for genre form
const GenreSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
});

const AdminGenres = () => {
    const [genres, setGenres] = useState([]);
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [showSongs, setShowSongs] = useState(false);

    // Fetch genres and songs on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [genresResponse, songsResponse] = await Promise.all([
                    genreAPI.getAll(),
                    songAPI.getAll(),
                ]);

                setGenres(genresResponse.data);
                setSongs(songsResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Failed to load data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Open form for creating a new genre
    const handleAddNew = () => {
        setSelectedGenre(null);
        setIsFormOpen(true);
    };

    // Open form for editing an existing genre
    const handleEdit = (genre) => {
        setSelectedGenre(genre);
        setIsFormOpen(true);
    };

    // Handle form submission
    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            let response;
            if (selectedGenre) {
                // Update existing genre
                response = await genreAPI.update(selectedGenre.id, values);

                // Update the genres list
                setGenres(
                    genres.map((genre) =>
                        genre.id === selectedGenre.id ? response.data : genre
                    )
                );

                toast.success("Genre updated successfully");
            } else {
                // Create new genre
                response = await genreAPI.create(values);

                // Add new genre to the list
                setGenres([...genres, response.data]);

                toast.success("Genre created successfully");
            }

            // Close form and reset
            setIsFormOpen(false);
            resetForm();
            setSelectedGenre(null);
        } catch (error) {
            console.error("Error saving genre:", error);
            toast.error(error.message || "Failed to save genre");
        } finally {
            setSubmitting(false);
        }
    };

    // Handle genre deletion
    const handleDelete = async (genreId) => {
        // Check if there are songs using this genre
        const songsWithGenre = songs.filter(
            (song) => song.genre_id === genreId
        );

        if (songsWithGenre.length > 0) {
            toast.error(
                `Cannot delete: ${songsWithGenre.length} song(s) are using this genre`
            );
            return;
        }

        if (!window.confirm("Are you sure you want to delete this genre?")) {
            return;
        }

        try {
            await genreAPI.delete(genreId);

            // Update the genres list
            setGenres(genres.filter((genre) => genre.id !== genreId));

            toast.success("Genre deleted successfully");
        } catch (error) {
            console.error("Error deleting genre:", error);
            toast.error("Failed to delete genre");
        }
    };

    // Get count of songs for each genre
    const getSongCount = (genreId) => {
        return songs.filter((song) => song.genre_id === genreId).length;
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
                    Manage Genres
                </h2>
                <div className="flex space-x-2">
                    <button
                        type="button"
                        onClick={() => setShowSongs(!showSongs)}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                        <MusicalNoteIcon
                            className="-ml-1 mr-2 h-5 w-5"
                            aria-hidden="true"
                        />
                        {showSongs ? "Hide Songs" : "Show Songs"}
                    </button>
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
            </div>

            {isFormOpen && (
                <div className="p-6 bg-gray-50 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        {selectedGenre ? "Edit Genre" : "Add New Genre"}
                    </h3>

                    <Formik
                        initialValues={{
                            name: selectedGenre?.name || "",
                        }}
                        validationSchema={GenreSchema}
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

                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsFormOpen(false);
                                            setSelectedGenre(null);
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
                                            : selectedGenre
                                            ? "Update"
                                            : "Create"}
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            )}

            <div className="overflow-x-auto">
                {genres.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        <TagIcon className="h-12 w-12 mx-auto text-gray-400" />
                        <p className="mt-2 text-lg">No genres found</p>
                        <p className="text-sm">
                            Click "Add New" to create your first genre
                        </p>
                    </div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Name
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Songs Count
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {genres.map((genre) => (
                                <React.Fragment key={genre.id}>
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">
                                                {getSongCount(genre.id)}{" "}
                                                {getSongCount(genre.id) === 1
                                                    ? "song"
                                                    : "songs"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() =>
                                                    handleEdit(genre)
                                                }
                                                className="text-primary-600 hover:text-primary-900 mr-3"
                                            >
                                                <PencilIcon className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(genre.id)
                                                }
                                                className={`text-red-600 hover:text-red-900 ${
                                                    getSongCount(genre.id) > 0
                                                        ? "opacity-50 cursor-not-allowed"
                                                        : ""
                                                }`}
                                                disabled={
                                                    getSongCount(genre.id) > 0
                                                }
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        </td>
                                    </tr>

                                    {/* Songs related to this genre */}
                                    {showSongs &&
                                        getSongCount(genre.id) > 0 && (
                                            <tr className="bg-gray-50">
                                                <td
                                                    colSpan="3"
                                                    className="px-6 py-2"
                                                >
                                                    <div className="text-sm text-gray-500 ml-6">
                                                        <h4 className="font-medium mb-2">
                                                            Songs in this genre:
                                                        </h4>
                                                        <ul className="list-disc ml-6 space-y-1">
                                                            {songs
                                                                .filter(
                                                                    (song) =>
                                                                        song.genre_id ===
                                                                        genre.id
                                                                )
                                                                .map((song) => (
                                                                    <li
                                                                        key={
                                                                            song.id
                                                                        }
                                                                    >
                                                                        {
                                                                            song.title
                                                                        }
                                                                    </li>
                                                                ))}
                                                        </ul>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AdminGenres;
