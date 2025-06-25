// app/create-app/page.js
'use client';

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
    const [architecture, setArchitecture] = useState("Native");
    const [tags, setTags] = useState([]);
    const [isPaid, setIsPaid] = useState(false);
    const [price, setPrice] = useState(0);
    const [thumbnail, setThumbnail] = useState([]);
    const [downloadLink, setDownloadLinks] = useState(["no", "no", "no", "no", "no", "no"]);
    const [size, setSize] = useState("");
    const [unit, setUnit] = useState('MB');
    const [category, setCategory] = useState("");
    const [coverImg, setCoverImg] = useState(null);
    const [systemRequirements, setSystemRequirements] = useState({
        os: "",
        processor: "",
        memory: "",
        graphics: "",
        storage: "",
        additionalNotes: ""
    });
    const [loading, setLoading] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [showTagSelector, setShowTagSelector] = useState(false);

    useEffect(() => {
        const checkAdminStatus = () => {
            try {
                const role = localStorage.getItem('role');
                if (!role || role !== 'ADMIN') {
                    toast.error('Unauthorized access. Redirecting to home page...');
                    setTimeout(() => router.push('/'), 2000);
                } else {
                    setIsAdmin(true);
                }
            } catch (error) {
                console.error('Error checking admin status:', error);
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

    const handleCoverImg = (e) => {
        setCoverImg(e.target.files[0]);
    };

    const handleDownloadLinkChange = (index, value) => {
        const newLinks = [...downloadLink];
        newLinks[index] = value;
        setDownloadLinks(newLinks);
    };

    const handleSystemRequirementChange = (field, value) => {
        setSystemRequirements(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const toggleTag = (tag) => {
        setTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const role = localStorage.getItem('role');
        if (!role || role !== 'ADMIN') {
            toast.error('Unauthorized access. Only admins can create apps.');
            setTimeout(() => router.push('/'), 2000);
            setLoading(false);
            return;
        }

        const filteredDownloadLink = downloadLink.filter(link => link.trim() !== "");

        if (filteredDownloadLink.length === 0) {
            toast.error("Please provide at least one download link!");
            setLoading(false);
            return;
        }

        if (tags.length === 0) {
            toast.error("Please select at least one tag!");
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('platform', platform);
        formData.append('architecture', architecture);
        formData.append('tags', tags.join(','));
        formData.append('isPaid', isPaid);
        formData.append('price', price);
        formData.append('size', `${size} ${unit}`);
        formData.append('category', category);

        // Format system requirements as backend expects
        formData.append('systemRequirements', JSON.stringify({
            os: systemRequirements.os,
            processor: systemRequirements.processor,
            memory: systemRequirements.memory,
            graphics: systemRequirements.graphics,
            storage: systemRequirements.storage,
            additionalNotes: systemRequirements.additionalNotes
        }));

        // Append files
        if (coverImg) formData.append('coverImg', coverImg);
        thumbnail.forEach(file => formData.append('thumbnail', file));

        // Append download links correctly
        filteredDownloadLink.forEach(link => {
            formData.append('downloadLink[]', link);
        });

        try {
            const token = localStorage.getItem('token');
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://toxicgames.in';

            await axios.post(`${apiUrl}/api/apps/admin/create`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                    'X-Auth-Token': process.env.NEXT_PUBLIC_API_TOKEN,
                },
            });

            toast.success("App created successfully!");

            // Hard refresh the page
            setTimeout(() => {
                window.location.reload();
            }, 1500);

        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error("Error creating app! " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const predefinedTags = [
        "2D", "3D", "Action", "Adventure", "Agriculture", "Anime", "Apps", "Arcade",
        "Artificial Intelligence", "Assassin", "Atmospheric", "Automation", "Blood",
        "Building", "Cartoon", "Casual", "Character Customization", "Cinematic", "Classic",
        "Co-Op", "Colony Sim", "Colorful", "Combat", "Comedy", "Comic Book", "Competitive",
        "Controller", "Crafting", "Crime", "Cute", "Cyberpunk", "Dark Humor", "Difficult",
        "Dragons", "Driving", "Early Access", "eSport", "Exploration", "Family Friendly",
        "Fantasy", "Farming Sim", "Fast-Paced", "Female Protagonist", "Fighting",
        "First-Person", "Fishing", "Flight", "FPS", "Funny", "Gore", "Great Soundtrack",
        "Hack and Slash", "History", "Horror", "Hunting", "Idler", "Illuminati",
        "Immersive Sim", "Indie", "LEGO", "Life Sim", "Loot", "Management", "Mature",
        "Memes", "Military", "Modern", "Multiplayer", "Mystery", "Nudity", "Open World",
        "Parkour", "Physics", "Pixel Graphics", "Post-apocalyptic", "Puzzle", "PvP",
        "Racing", "Realistic", "Relaxing", "Resource Management", "RPG", "Sandbox",
        "Sci-fi", "Science", "Science Fiction", "Sexual Content", "Shooters", "Simulation",
        "Singleplayer", "Sports", "Stealth Game", "Story Rich", "Strategy", "Superhero",
        "Surreal", "Survival", "Tactical", "Tanks", "Team-Based", "Third Person",
        "Third-Person-Shooter", "Thriller", "Tower Defense", "Trading", "Turn-Based",
        "Underwater", "Utilities", "Violent", "VR", "War", "Wargame", "Zombie"
    ];

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

    const architectures = [
        "Native", "ARM", "Wineskin", "Port"
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

                                {/* Architecture */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Architecture
                                    </label>
                                    <select
                                        value={architecture}
                                        onChange={(e) => setArchitecture(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-300"
                                    >
                                        {architectures.map((arch) => (
                                            <option key={arch} value={arch}>{arch}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Tags Selector */}
                                <div className="col-span-full relative">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Tags (Select at least one)
                                    </label>

                                    {/* Selected tags display */}
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {tags.map(tag => (
                                            <span
                                                key={tag}
                                                className="px-3 py-1 bg-purple-700 rounded-full text-xs font-medium flex items-center"
                                            >
                                                {tag}
                                                <button
                                                    type="button"
                                                    onClick={() => toggleTag(tag)}
                                                    className="ml-2 text-gray-300 hover:text-white"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setShowTagSelector(!showTagSelector)}
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 text-left text-gray-300"
                                    >
                                        {tags.length > 0 ? `${tags.length} tags selected` : "Select tags..."}
                                    </button>

                                    {/* Tag selector dropdown */}
                                    {showTagSelector && (
                                        <div className="absolute z-10 mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                            <div className="p-2">
                                                <input
                                                    type="text"
                                                    placeholder="Search tags..."
                                                    className="w-full px-3 py-2 mb-2 bg-gray-700 text-gray-300 rounded"
                                                    onChange={(e) => {
                                                        const search = e.target.value.toLowerCase();
                                                        const tagList = document.getElementById('tagList');
                                                        Array.from(tagList.children).forEach(tag => {
                                                            const tagText = tag.textContent.toLowerCase();
                                                            tag.style.display = tagText.includes(search) ? 'block' : 'none';
                                                        });
                                                    }}
                                                />
                                                <div id="tagList" className="flex flex-wrap gap-2">
                                                    {predefinedTags.map(tag => (
                                                        <button
                                                            key={tag}
                                                            type="button"
                                                            onClick={() => toggleTag(tag)}
                                                            className={`px-3 py-1 rounded-full text-xs font-medium ${tags.includes(tag)
                                                                ? 'bg-purple-600 text-white'
                                                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                                                }`}
                                                        >
                                                            {tag}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
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
                                        required
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
                                        required
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
                                                min="0"
                                                step="0.01"
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
                                            min="0"
                                            step="0.1"
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

                                {/* System Requirements - Fixed Fields */}
                                <div className="col-span-full space-y-4">
                                    <h3 className="text-sm font-medium text-gray-300">
                                        System Requirements
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs text-gray-400 mb-1">OS</label>
                                            <input
                                                type="text"
                                                placeholder="e.g., Windows 10"
                                                value={systemRequirements.os}
                                                onChange={(e) => handleSystemRequirementChange('os', e.target.value)}
                                                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-400 mb-1">Processor</label>
                                            <input
                                                type="text"
                                                placeholder="e.g., Intel i5"
                                                value={systemRequirements.processor}
                                                onChange={(e) => handleSystemRequirementChange('processor', e.target.value)}
                                                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-400 mb-1">Memory</label>
                                            <input
                                                type="text"
                                                placeholder="e.g., 8GB"
                                                value={systemRequirements.memory}
                                                onChange={(e) => handleSystemRequirementChange('memory', e.target.value)}
                                                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-400 mb-1">Graphics</label>
                                            <input
                                                type="text"
                                                placeholder="e.g., NVIDIA GTX 1060"
                                                value={systemRequirements.graphics}
                                                onChange={(e) => handleSystemRequirementChange('graphics', e.target.value)}
                                                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-400 mb-1">Storage</label>
                                            <input
                                                type="text"
                                                placeholder="e.g., 20GB"
                                                value={systemRequirements.storage}
                                                onChange={(e) => handleSystemRequirementChange('storage', e.target.value)}
                                                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-400 mb-1">Additional Notes</label>
                                            <input
                                                type="text"
                                                placeholder="Optional"
                                                value={systemRequirements.additionalNotes}
                                                onChange={(e) => handleSystemRequirementChange('additionalNotes', e.target.value)}
                                                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300"
                                            />
                                        </div>
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
                                                    required={index < 3}
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
                                        Cover Image
                                    </label>
                                    <div className="flex items-center justify-center w-full">
                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer bg-gray-800 hover:border-purple-500 transition-colors">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <svg className="w-8 h-8 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                </svg>
                                                <p className="text-sm text-gray-400">
                                                    {coverImg
                                                        ? coverImg.name
                                                        : "Click to upload cover image (required)"
                                                    }
                                                </p>
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleCoverImg}
                                                className="hidden"
                                                required
                                            />
                                        </label>
                                    </div>
                                </div>

                                {/* Thumbnail Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-3">
                                        Thumbnails (Max 20 files, required)
                                    </label>
                                    <div className="flex items-center justify-center w-full">
                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer bg-gray-800 hover:border-purple-500 transition-colors">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <svg className="w-8 h-8 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                </svg>
                                                <p className="text-sm text-gray-400">
                                                    <span className="font-semibold">Click to upload thumbnails</span> or drag and drop
                                                </p>
                                            </div>
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*,video/*"
                                                onChange={handleThumbnail}
                                                className="hidden"
                                                required
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