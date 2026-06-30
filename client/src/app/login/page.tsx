"use client"; // Bắt buộc phải có dòng này ở đầu file khi dùng useState

import React, {useState} from 'react';
import Link from "next/link";
import {useRouter} from 'next/navigation';
import {useAuthStore} from '@store/authStore';
import {EyeOn, EyeOff} from "@icon";
import axiosInstance from '@/lib/axios';
import StateDebugger from '@component/StateDebugger';
import FormErrors from "@component/FormErrors";

export default function LoginPage() {
    const router = useRouter();
    const {login} = useAuthStore();

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string[]>([]);
    const isButtonDisabled = !username.trim() || !password.trim() || loading

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError([]);

        try {
            const response = await axiosInstance.post('login', {
                username: username,
                password: password
            });
            if (response.data && response.data.success == true) {
                const {user, access_token} = response.data.data;
                login(user, access_token);
                return router.push('/');
            }
            setError([response.data.message])
        } catch (err: any) {
            console.log(err, '// err')
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-[#ee4d2d] p-4 sm:p-6 md:p-8">
            <div className="w-full max-w-[420px] rounded-sm bg-white p-6 shadow-xl sm:p-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-xl sm:text-2xl text-gray-800 font-normal">Đăng nhập</h1>
                </div>

                <FormErrors error={error}/>

                {/* Form Đăng nhập */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full rounded-sm border border-gray-300 px-3 py-3 text-sm
							focus:border-gray-500 focus:outline-none placeholder-gray-400 text-gray-800"
                        />
                    </div>

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full rounded-sm border border-gray-300 px-3 py-3 pr-10 text-sm
							focus:border-gray-500 focus:outline-none placeholder-gray-400 text-gray-800"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400
							hover:text-gray-600 focus:outline-none cursor-pointer"
                        >
                            {showPassword ? <EyeOn/> : <EyeOff/>}
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={isButtonDisabled}
                        className={`w-full rounded-sm bg-[#ee4d2d] py-3 text-sm font-medium text-white shadow-sm transition-opacity
						  ${isButtonDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-85'}`
                        }
                    >
                        {loading ? (
                            <div className="flex items-center justify-center gap-2">
                                {/* Icon SVG xoay tròn sử dụng class animate-spin của Tailwind */}
                                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                            strokeWidth="4"/>
                                    <path className="opacity-75" fill="currentColor"
                                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                </svg>
                                <span>ĐANG ĐĂNG NHẬP...</span>
                            </div>
                        ) : (
                            'ĐĂNG NHẬP'
                        )}
                    </button>
                </form>

                {/* Quên mật khẩu */}
                {/*<div className="mt-3 text-right">*/}
                {/*	<a href="#" className="text-xs text-[#0055aa] hover:underline">Quên mật khẩu</a>*/}
                {/*</div>*/}

                <div className="my-5 flex items-center justify-between">
                    <span className="h-[1px] w-[40%] bg-gray-200"></span>
                    <span className="text-xs text-gray-400 uppercase font-medium">HOẶC</span>
                    <span className="h-[1px] w-[40%] bg-gray-200"></span>
                </div>

                <p className="mt-8 text-center text-sm text-gray-400">
                    Bạn mới biết đến Shopee?{' '}
                    <Link href="/register" className="text-[#ee4d2d] font-medium hover:underline">Đăng ký</Link>
                </p>

            </div>


            <StateDebugger states={{username, password, showPassword, loading, error}}/>

        </div>
    );
}
