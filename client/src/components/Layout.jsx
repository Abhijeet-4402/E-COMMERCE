import Navbar from './Navbar';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
                {children}
            </main>
            <footer className="bg-dark text-white text-center py-4 mt-auto">
                <p>&copy; {new Date().getFullYear()} E-Commerce App. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Layout;
