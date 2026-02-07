import React, { useState, useEffect } from 'react';
import { FiMic, FiMail, FiLock, FiUser, FiGlobe, FiInfo } from 'react-icons/fi';

const RegisterPage = ({ onRegister, onNavigateToLogin }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'consultant'
    });
    const [activeVoiceField, setActiveVoiceField] = useState(null);

    // Keyboard shortcut Alt+V to toggle voice
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.altKey && e.key === 'v') {
                // Toggle voice for name by default or cycle
                toggleVoice('name');
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const toggleVoice = (field) => {
        setActiveVoiceField(field);
        // Mocking voice input
        setTimeout(() => {
            const mocks = {
                name: 'Mohamed Aziz',
                email: 'aziz@tili.tn',
                password: 'password123'
            };
            if (mocks[field]) {
                setFormData(prev => ({ ...prev, [field]: mocks[field] }));
            }
            setActiveVoiceField(null);
        }, 2000);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onRegister(formData);
    };

    return (
        <div className="min-h-screen bg-[#4a5568] flex items-center justify-center p-4 font-sans">
            {/* Sidebar for Auth Pages (as seen in screenshot) */}
            <div className="fixed left-0 top-0 h-full w-64 bg-[#3d4654] border-r border-[#4e5a6b] hidden lg:block">
                <div className="p-8">
                    <h1 className="text-white text-2xl font-bold tracking-widest font-serif">TILI</h1>
                    <p className="text-gray-400 text-xs mt-1">Plateforme de Gestion</p>
                </div>
                <nav className="mt-10 px-4 space-y-2">
                    <button
                        onClick={onNavigateToLogin}
                        className="w-full text-left px-4 py-3 rounded-lg text-gray-400 hover:bg-[#4e5a6b] hover:text-white transition-colors text-sm font-medium"
                    >
                        Connexion
                    </button>
                    <button
                        className="w-full text-left px-4 py-3 rounded-lg bg-white text-gray-800 shadow-lg text-sm font-bold"
                    >
                        Inscription
                    </button>
                </nav>

                {/* Floating Assistant Card */}
                <div className="absolute bottom-10 left-4 right-4 bg-white rounded-xl p-4 shadow-2xl">
                    <div className="flex gap-2">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0">
                            <FiInfo className="w-4 h-4" />
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-gray-800">Assistant Vocal</h4>
                            <p className="text-[10px] text-gray-500 leading-tight mt-1">Cliquez pour démarrer une conversation guidée par la voix</p>
                            <button type="button" className="mt-2 w-full bg-[#10b981] text-white text-[10px] py-2 rounded-lg font-bold hover:bg-[#059669] transition-colors">
                                🎙️ Tester la voix
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Registration Form Card */}
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg p-10 relative overflow-hidden">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-gray-800">Créer un compte</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Field */}
                    <div className="space-y-1">
                        <label className="block text-sm font-bold text-gray-700">Nom complet <span className="text-red-500">*</span></label>
                        <div className={`flex items-center border-2 rounded-xl transition-all ${activeVoiceField === 'name' ? 'border-blue-500 ring-4 ring-blue-50' : 'border-gray-100 hover:border-gray-200'}`}>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="flex-1 px-4 py-3 outline-none text-gray-700 placeholder-gray-300 rounded-l-xl"
                                placeholder="Votre nom complet"
                            />
                            <div className="flex items-center gap-2 pr-2 border-l border-gray-100 py-1">
                                <div className="flex items-center text-[10px] text-gray-500 bg-gray-50 px-2 py-1 rounded">
                                    تـونسي TN <FiGlobe className="ml-1" />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => toggleVoice('name')}
                                    className={`p-2 rounded-lg transition-colors ${activeVoiceField === 'name' ? 'bg-red-500 text-white animate-pulse' : 'bg-[#3b82f6] text-white hover:bg-blue-600'}`}
                                >
                                    <FiMic className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        <p className="text-[10px] text-blue-600 font-medium font-arabic">تـونسي Langua: للكتابة بـالصوت Alt + V اضغط</p>
                    </div>

                    {/* Email Field */}
                    <div className="space-y-1">
                        <label className="block text-sm font-bold text-gray-700">Email <span className="text-red-500">*</span></label>
                        <div className={`flex items-center border-2 rounded-xl transition-all ${activeVoiceField === 'email' ? 'border-blue-500 ring-4 ring-blue-50' : 'border-gray-100 hover:border-gray-200'}`}>
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="flex-1 px-4 py-3 outline-none text-gray-700 placeholder-gray-300 rounded-l-xl"
                                placeholder="votre@email.com"
                            />
                            <div className="flex items-center gap-2 pr-2 border-l border-gray-100 py-1">
                                <div className="flex items-center text-[10px] text-gray-500 bg-gray-50 px-2 py-1 rounded">
                                    تـونسي TN <FiGlobe className="ml-1" />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => toggleVoice('email')}
                                    className={`p-2 rounded-lg transition-colors ${activeVoiceField === 'email' ? 'bg-red-500 text-white animate-pulse' : 'bg-[#3b82f6] text-white hover:bg-blue-600'}`}
                                >
                                    <FiMic className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        <p className="text-[10px] text-blue-600 font-medium font-arabic">تـونسي Langua: للكتابة بـالصوت Alt + V اضغط</p>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-1">
                        <label className="block text-sm font-bold text-gray-700">Mot de passe <span className="text-red-500">*</span></label>
                        <div className={`flex items-center border-2 rounded-xl transition-all ${activeVoiceField === 'password' ? 'border-blue-500 ring-4 ring-blue-50' : 'border-gray-100 hover:border-gray-200'}`}>
                            <input
                                type="password"
                                name="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="flex-1 px-4 py-3 outline-none text-gray-700 placeholder-gray-300 rounded-l-xl"
                                placeholder="********"
                            />
                            <div className="flex items-center gap-2 pr-2 border-l border-gray-100 py-1">
                                <div className="flex items-center text-[10px] text-gray-500 bg-gray-50 px-2 py-1 rounded">
                                    تـونسي TN <FiGlobe className="ml-1" />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => toggleVoice('password')}
                                    className={`p-2 rounded-lg transition-colors ${activeVoiceField === 'password' ? 'bg-red-500 text-white animate-pulse' : 'bg-[#3b82f6] text-white hover:bg-blue-600'}`}
                                >
                                    <FiMic className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        <p className="text-[10px] text-blue-600 font-medium font-arabic">تـونسي Langua: للكتابة بـالصوت Alt + V اضغط</p>
                    </div>

                    {/* Role Selection */}
                    <div className="space-y-1">
                        <label className="block text-sm font-bold text-gray-700">Rôle <span className="text-red-500">*</span></label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl outline-none focus:border-blue-500 transition-colors bg-white text-gray-700 font-medium"
                        >
                            <option value="consultant">Consultant</option>
                            <option value="chef_projet">Chef de projet</option>
                            <option value="responsable">Responsable</option>
                        </select>
                    </div>

                    {/* Role Descriptions (from screenshot) */}
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                        <div className="space-y-1">
                            <p className="text-[10px] text-blue-800"><span className="font-bold">Consultant:</span> Accès limité en lecture</p>
                            <p className="text-[10px] text-blue-800"><span className="font-bold">Chef de projet:</span> Peut gérer les utilisateurs</p>
                            <p className="text-[10px] text-blue-800"><span className="font-bold">Responsable:</span> Accès complet</p>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#1e293b] text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 mt-4"
                    >
                        Créer le compte
                    </button>
                </form>
            </div>

            {/* Floating Design Elements (from screenshot) */}
            <button type="button" className="fixed top-8 right-8 w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-white shadow-lg hover:rotate-12 transition-transform">
                <span className="text-lg">♫</span>
            </button>

            <div className="fixed bottom-8 right-8 flex flex-col gap-4">
                <button type="button" className="w-12 h-12 rounded-full bg-pink-500 flex items-center justify-center text-white shadow-lg">
                    <FiMic className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};

export default RegisterPage;
