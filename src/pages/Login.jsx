import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import { ShoppingCart, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        if (errors[e.target.name]) {
            setErrors({
                ...errors,
                [e.target.name]: '',
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!formData.email) newErrors.email = 'Email harus diisi';
        if (!formData.password) newErrors.password = 'Password harus diisi';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        try {
            await login(formData.email, formData.password);
            navigate('/dashboard');
        } catch (error) {
            setErrors({ submit: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
            <button
                onClick={toggleTheme}
                className="fixed top-4 right-4 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow"
            >
                {theme === 'light' ? (
                    <Moon className="w-5 h-5 text-gray-700" />
                ) : (
                    <Sun className="w-5 h-5 text-yellow-400" />
                )}
            </button>

            <div className="w-full max-w-md">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                    {/* Logo */}
                    <div className="flex justify-center mb-6">
                        <div className="bg-primary-600 p-4 rounded-full">
                            <ShoppingCart className="w-8 h-8 text-white" />
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">
                        Selamat Datang
                    </h1>
                    <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
                        Login untuk melanjutkan
                    </p>

                    {errors.submit && (
                        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg text-sm">
                            {errors.submit}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={errors.email}
                            placeholder="nama@email.com"
                        />

                        <Input
                            label="Password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            error={errors.password}
                            placeholder="Masukkan password"
                        />

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? 'Login...' : 'Login'}
                        </Button>
                    </form>

                    <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
                        Belum punya akun?{' '}
                        <Link
                            to="/register"
                            className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
                        >
                            Daftar di sini
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
