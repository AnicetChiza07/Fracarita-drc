import { Toaster } from 'sonner';

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        // ✅ Ce conteneur force le plein écran et le fond sombre
        <div className="w-full min-h-screen bg-dark relative overflow-hidden">
            {children}
            
            <Toaster 
                position="top-right" 
                richColors 
                closeButton 
                theme="dark"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#1a1a1a',
                        color: '#fff',
                        border: '1px solid #333',
                    },
                }}
            />
        </div>
    );
}