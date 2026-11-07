'use client';

import { LogOut } from 'lucide-react';

export default function LogoutButton() {
    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        window.location.href = '/admin/login';
    };

    return (
        <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 border border-white/10"
        >
            <LogOut size={18} />
            Se déconnecter
        </button>
    );
}