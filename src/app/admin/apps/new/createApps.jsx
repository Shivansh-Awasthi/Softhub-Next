// app/create-app/page.js
'use client'; // Mark this as a Client Component since we need interactivity

import axios from 'axios';
import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';

const CreateApps = () => {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [platform, setPlatform] = useState("");
    const [isPaid, setIsPaid] = useState(false);
    const [price, setPrice] = useState(0);
    const [thumbnail, setThumbnail] = useState([]);
    const [downloadLink, setDownloadLinks] = useState(["no", "no", "no", "no", "no", "no"]);
    const [size, setSize] = useState("");
    const [unit, setUnit] = useState('MB');
    const [category, setCategory] = useState("");
    const [coverImg, setCoverImg] = useState("");
    const [loading, setLoading] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    // Check if user is admin when component mounts
    useEffect(() => {
        const checkAdminStatus = () => {
            try {
                const role = localStorage.getItem('role');

                if (!role || role !== 'ADMIN') {
                    toast.error('Unauthorized access. Redirecting to home page...', {
                        position: "top-right",
                        autoClose: 2000,
                    });

                    // Redirect to home page after 2 seconds
                    setTimeout(() => {
                        router.push('/');
                    }, 2000);
                } else {
                    setIsAdmin(true);
                }
            } catch (error) {
                console.error('Error checking admin status:', error);
                // If there's an error (e.g., localStorage not available), redirect to home
                router.push('/');
            }
        };

        checkAdminStatus();
    }, [router]);

    const handleThumbnail = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + thumbnail.length > 20) {
            toast.error("You can only upload up to 20 images/videos.");
            e.target.value = "";
            return;
        }
        setThumbnail((prevFiles) => [...prevFiles, ...files]);
    };

    const handleDownloadLinkChange = (index, value) => {
        const newLinks = [...downloadLink];
        newLinks[index] = value;
        setDownloadLinks(newLinks);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Check if user is admin before proceeding
        const role = localStorage.getItem('role');
        if (!role || role !== 'ADMIN') {
            toast.error('Unauthorized access. Only admins can create apps.', {
                position: "top-right",
                autoClose: 3000,
            });
            setLoading(false);

            // Redirect to home page after 2 seconds
            setTimeout(() => {
                router.push('/');
            }, 2000);
            return;
        }

        const filteredDownloadLink = downloadLink.filter(link => link.trim() !== "");

        if (filteredDownloadLink.length === 0) {
            toast.error("Please provide at least one download link!");
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('platform', platform);
        formData.append('isPaid', isPaid);
        formData.append('price', price);
        formData.append('size', `${size} ${unit}`);
        formData.append('category', category);
        formData.append("coverImg", coverImg);

        filteredDownloadLink.forEach((link) => {
            formData.append('downloadLink[]', link);
        });

        thumbnail.forEach(file => {
            formData.append('thumbnail', file);
        });

        try {
            // Log form data for debugging (commented out for production)
            /*
            console.log("Form data being submitted:");
            for (let [key, value] of formData.entries()) {
                if (value instanceof File) {
                    console.log(`${key}: File - ${value.name} (${value.size} bytes)`);
                } else {
                    console.log(`${key}: ${value}`);
                }
            }
            */

            // For testing, simulate a successful response
            // console.log("SIMULATING SUCCESSFUL API RESPONSE FOR TESTING");

            // Show success message
            // toast.success("App created successfully!", {
            //     position: "top-right",
            //     autoClose: 5000
            // });

            // Reset form
            setTitle("");
            setDescription("");
            setPlatform("");
            setIsPaid(false);
            setPrice(0);
            setThumbnail([]);
            setDownloadLinks(["no", "no", "no", "no", "no", "no"]);
            setSize("");
            setUnit("MB");
            setCategory("");
            setCoverImg("");

            // Uncomment this to make a real API call
            const token = localStorage.getItem('token');
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://toxicgames.in';
            // console.log(`Making API call to: ${apiUrl}/api/apps/admin/create`);

            // Make the API call
            await axios.post(`${apiUrl}/api/apps/admin/create`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                    'X-Auth-Token': process.env.NEXT_PUBLIC_API_TOKEN,
                },
            });

            toast.success("App created successfully!");

        } catch (error) {
            console.error("Error submitting form:", error.response?.data || error.message);
            toast.error("Error creating app! Please try again.", {
                position: "top-right",
                autoClose: 5000
            });
        } finally {
            setLoading(false);
        }
    };

    const categories = [
        { value: "pc", label: "PC Games" },
        { value: "spc", label: "PC Softwares" },
        { value: "mac", label: "Mac Games" },
        { value: "smac", label: "Mac Softwares" },
        { value: "android", label: "Android Games" },
        { value: "sandroid", label: "Android Softwares" },
        { value: "ppsspp", label: "PPSSPP Iso" },
        { value: "ps2", label: "PS2 Iso" },
        { value: "ps3", label: "PS3 Iso" },
        { value: "ps4", label: "Mac Exclusive Games" },
    ];

    const downloadLinkLabelsAndPlaceholders = [
        { label: "Viking File (Mac) // VikingFile (PC)", placeholder: "Enter the VikingFile link" },
        { label: "OneDrive (Mac) // Buzzheavier (PC)", placeholder: "Enter the Buzzheavier link" },
        { label: "Torrent (Mac) // FuckingFast (PC)", placeholder: "Enter the Torrent link" },
        { label: "BuzzHeavier (Mac) // Bzzhr.co (PC)", placeholder: "Enter other download link" },
        { label: "MediaFire Link (Mac) // Buzzheavier (PC)", placeholder: "Enter Mediafire link" },
        { label: "Akira Box Link (Mac, PC)", placeholder: "Enter AkiraBox link" }
    ];

    return (
        <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
            <ToastContainer position="bottom-right" />
            <div className="max-w-4xl mx-auto">
                {isAdmin ? (
                    <form onSubmit={handleSubmit} className="space-y-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 shadow-xl ring-1 ring-purple-500/20">
                        {/* Header Section */}
                        <div className="border-b border-gray-700 pb-6">
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                Add New Application
                            </h1>
                            <p className="mt-2 text-gray-400">Fill in the details below to add a new application/game</p>
                        </div>

                        {/* Main Form Content */}
                        <div className="space-y-6">
                            {/* Basic Information Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Application Title
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter application name"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-300 placeholder-gray-500"
                                        required
                                    />
                                </div>

                                {/* Description Textarea */}
                                <div className="col-span-full">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        rows="4"
                                        placeholder="Enter detailed description about the application..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-300 placeholder-gray-500 resize-none"
                                        required
                                    />
                                </div>

                                {/* Platform Selector */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Platform
                                    </label>
                                    <select
                                        value={platform}
                                        onChange={(e) => setPlatform(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-300"
                                    >
                                        <option value="">Select Platform</option>
                                        <option value="PC">PC</option>
                                        <option value="Mac">Mac</option>
                                        <option value="Android">Android</option>
                                        <option value="Playstation">Playstation</option>
                                    </select>
                                </div>

                                {/* Category Selector */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Category
                                    </label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-300 appearance-none"
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map((cat) => (
                                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Pricing Section */}
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                checked={isPaid}
                                                onChange={(e) => setIsPaid(e.target.checked)}
                                                className="form-checkbox h-5 w-5 text-purple-500 bg-gray-800 border-gray-700 rounded focus:ring-purple-500"
                                            />
                                            <span className="text-gray-300">Paid Application</span>
                                        </label>
                                    </div>
                                    {isPaid && (
                                        <div>
                                            <input
                                                type="number"
                                                placeholder="Price in USD"
                                                value={price}
                                                onChange={(e) => setPrice(e.target.value)}
                                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-300"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        File Size
                                    </label>
                                    <div className="flex rounded-lg overflow-hidden border border-gray-700 focus-within:ring-2 focus-within:ring-purple-500">
                                        <input
                                            type="number"
                                            placeholder="Enter size"
                                            value={size}
                                            onChange={(e) => setSize(e.target.value)}
                                            className="flex-1 px-4 py-3 bg-gray-800 text-gray-300 focus:outline-none"
                                        />
                                        <select
                                            value={unit}
                                            onChange={(e) => setUnit(e.target.value)}
                                            className="bg-gray-800 border-l border-gray-700 text-gray-300 px-4 py-3 focus:outline-none hover:bg-gray-750 transition-colors"
                                        >
                                            <option value="GB">GB</option>
                                            <option value="MB">MB</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Download Links Section */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-200 border-l-4 border-purple-500 pl-3">
                                    Download Links
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {downloadLink.map((link, index) => (
                                        <div key={index} className="relative">
                                            <label className="block text-sm font-medium text-gray-400 mb-1">
                                                {downloadLinkLabelsAndPlaceholders[index]?.label || `Link ${index + 1}`}
                                                <span className="ml-2 text-xs text-purple-400">
                                                    ({index < 3 ? 'Required' : 'Optional'})
                                                </span>
                                            </label>
                                            <div className="flex items-center">
                                                <span className="absolute left-3 text-gray-500">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                                    </svg>
                                                </span>
                                                <input
                                                    type="text"
                                                    placeholder={downloadLinkLabelsAndPlaceholders[index]?.placeholder}
                                                    value={link}
                                                    onChange={(e) => handleDownloadLinkChange(index, e.target.value)}
                                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-300 placeholder-gray-500"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Media Upload Section */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-200 border-l-4 border-purple-500 pl-3">
                                    Media Uploads
                                </h3>

                                {/* Cover Image */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Cover Image URL
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter cover image URL"
                                        value={coverImg}
                                        onChange={(e) => setCoverImg(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-300"
                                    />
                                </div>

                                {/* Thumbnail Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-3">
                                        Thumbnails (Max 20 files)
                                    </label>
                                    <div className="flex items-center justify-center w-full">
                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer bg-gray-800 hover:border-purple-500 transition-colors">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <svg className="w-8 h-8 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                </svg>
                                                <p className="text-sm text-gray-400">
                                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                                </p>
                                            </div>
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*,video/*"
                                                onChange={handleThumbnail}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                    {thumbnail.length > 0 && (
                                        <p className="mt-2 text-sm text-gray-400">
                                            Selected files: {thumbnail.length}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 px-6 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 rounded-lg font-semibold text-white transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Uploading...
                                    </span>
                                ) : (
                                    'Publish Application'
                                )}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="flex flex-col items-center justify-center min-h-[50vh] bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 shadow-xl ring-1 ring-purple-500/20">
                        <svg className="w-16 h-16 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <h2 className="text-2xl font-bold text-white mb-2">Unauthorized Access</h2>
                        <p className="text-gray-400 text-center mb-6">You do not have permission to access this page. Only administrators can create new applications.</p>
                        <button
                            onClick={() => router.push('/')}
                            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 rounded-lg font-semibold text-white transition-all"
                        >
                            Return to Home
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateApps;