"use client";

import { getSession, signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {

    const [user, setUser] = useState({
        email: "",
        password: "",
        username: ""
    })

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    async function handleLogin() {
        setError("");
        setLoading(true);

        const email = user.email;
        const password = user.password;

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false
        });

        if (res?.error) {
            console.error("Login failed:", res.error);
            setError(res.error || "Login failed");
            setLoading(false);
            return;
        }

        // Wait a moment for the session to be updated
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const session = await getSession();

        if (session?.user?.role === "ADMIN") {
            router.push("/dashboard/admin");
        } else if (session?.user?.role === "STAFF") {
            router.push("/dashboard/staff");
        } else if (session?.user?.role === "USER") {
            router.push("/dashboard/user");
        } else {
            setError("Unable to determine user role");
            setLoading(false);
        }
    }   

    return (
        <div className='flex flex-col items-center justify-center min-h-screen py-2'>
            <h1 className='text-2xl font-bold pb-4'>Login Page</h1>
            <hr />

            {error && (
                <div className='bg-red-500 text-white p-3 rounded-md mb-4 w-80 text-center'>
                    {error}
                </div>
            )}

            <label htmlFor="username">Username</label>
            <input type="text" className='bg-gray-800 text-white p-2 rounded-md'
                id='username'
                value={user.username}
                onChange={(e) => setUser({ ...user, username: e.target.value })}
                placeholder='Username'
            />
            <hr />

            <label htmlFor="email">Email</label>
            <input type="text" className='bg-gray-800 text-white p-2 rounded-md'
                id='email'
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                placeholder='Email'
            /><hr />

            <label htmlFor="password">Password</label>
            <input type="password" className='bg-gray-800 text-white p-2 rounded-md'
                id='password'
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                placeholder='Password'
            />
            <button 
                onClick={handleLogin} 
                disabled={loading}
                className='bg-blue-500 hover:bg-blue-700 disabled:bg-gray-500 text-white font-bold py-2 my-4 px-4 rounded'
            >
                {loading ? "Logging in..." : "Login"}
            </button>
            <Link href="/register"> Dont Have Account? Go to Signup </Link>
        </div>
    )
}