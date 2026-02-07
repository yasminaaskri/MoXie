import React, { useState } from 'react';
import { FiUsers, FiSearch, FiFilter, FiEdit, FiTrash2, FiPlus, FiUser, FiShield, FiBriefcase, FiMonitor } from 'react-icons/fi';

const UsersPage = () => {
    const [filterRole, setFilterRole] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Mock users data
    const users = [
        { id: 1, name: 'Mohamed Aziz', email: 'aziz@tili.tn', role: 'Responsable', date: '2026-02-01', avatar: 'M', color: 'bg-purple-500' },
        { id: 2, name: 'Sarra Ben Ali', email: 'sarra@tili.tn', role: 'Chef de projet', date: '2026-02-03', avatar: 'S', color: 'bg-indigo-500' },
        { id: 3, name: 'Karim Zouari', email: 'karim@tili.tn', role: 'Consultant', date: '2026-02-05', avatar: 'K', color: 'bg-blue-500' },
        { id: 4, name: 'Ines Hammami', email: 'ines@tili.tn', role: 'Consultant', date: '2026-01-20', avatar: 'I', color: 'bg-emerald-500' },
        { id: 5, name: 'Youssef Mansour', email: 'youssef@tili.tn', role: 'Responsable', date: '2026-01-15', avatar: 'Y', color: 'bg-rose-500' },
        { id: 6, name: 'Amel Ghozzi', email: 'amel@tili.tn', role: 'Consultant', date: '2026-01-10', avatar: 'A', color: 'bg-amber-500' },
        { id: 7, name: 'Walid Trabelsi', email: 'walid@tili.tn', role: 'Consultant', date: '2026-02-07', avatar: 'W', color: 'bg-cyan-500' },
        { id: 8, name: 'Leila Karray', email: 'leila@tili.tn', role: 'Consultant', date: '2026-01-05', avatar: 'L', color: 'bg-fuchsia-500' },
        { id: 9, name: 'Omar Belhassine', email: 'omar@tili.tn', role: 'Consultant', date: '2026-02-02', avatar: 'O', color: 'bg-violet-500' },
        { id: 10, name: 'Hela Dridi', email: 'hela@tili.tn', role: 'Consultant', date: '2026-01-25', avatar: 'H', color: 'bg-teal-500' },
    ];

    // Stats calculation
    const stats = {
        responsables: users.filter(u => u.role === 'Responsable').length,
        chefs: users.filter(u => u.role === 'Chef de projet').length,
        consultants: users.filter(u => u.role === 'Consultant').length,
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        return matchesSearch && matchesRole;
    });

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'Responsable': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'Chef de projet': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
            default: return 'bg-blue-100 text-blue-800 border-blue-200';
        }
    };

    return (
        <div className="space-y-6 animate-fade-in p-2">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 font-serif">Gestion des Utilisateurs</h1>
                    <p className="text-sm text-gray-500">Gérez les comptes et les permissions de l'association TILI</p>
                </div>
                <button className="flex items-center justify-center gap-2 bg-slate-800 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-slate-700 transition-all shadow-lg text-sm">
                    <FiPlus /> Ajouter un utilisateur
                </button>
            </div>

            {/* Row of Statistics per Role */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-purple-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-purple-600 uppercase tracking-wider">Responsables</p>
                        <h3 className="text-3xl font-bold text-slate-800">{stats.responsables}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-500">
                        <FiShield className="w-6 h-6" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-indigo-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Chefs de projet</p>
                        <h3 className="text-3xl font-bold text-slate-800">{stats.chefs}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500">
                        <FiBriefcase className="w-6 h-6" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Consultants</p>
                        <h3 className="text-3xl font-bold text-slate-800">{stats.consultants}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                        <FiMonitor className="w-6 h-6" />
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Rechercher un utilisateur..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-slate-500 transition-all text-sm"
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <FiFilter className="text-gray-400" />
                    <select
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        className="flex-1 md:flex-none py-2 px-4 bg-gray-50 border border-gray-200 rounded-lg outline-none text-sm font-medium"
                    >
                        <option value="all">Tous les rôles</option>
                        <option value="Responsable">Responsables</option>
                        <option value="Chef de projet">Chefs de projet</option>
                        <option value="Consultant">Consultants</option>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center w-20">Utilisateur</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Info</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Rôle</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date de création</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className={`w-10 h-10 rounded-full ${user.color} flex items-center justify-center text-white font-bold mx-auto shadow-sm`}>
                                            {user.avatar}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <h4 className="font-bold text-slate-800 text-sm">{user.name}</h4>
                                            <p className="text-xs text-gray-500">{user.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRoleBadgeColor(user.role)}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                                        {new Date(user.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Modifier">
                                                <FiEdit className="w-5 h-5" />
                                            </button>
                                            <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Supprimer">
                                                <FiTrash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredUsers.length === 0 && (
                    <div className="p-20 text-center">
                        <FiUsers className="w-16 h-16 text-gray-100 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-gray-800">Aucun utilisateur trouvé</h3>
                        <p className="text-sm text-gray-500">Essayez d'ajuster vos filtres de recherche</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UsersPage;
