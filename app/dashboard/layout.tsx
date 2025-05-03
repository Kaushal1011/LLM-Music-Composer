export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <section className="h-[calc(100vh-3rem)] grid grid-cols-[300px_1fr]">
            {children}
        </section>
    );
}
