"use client"
import { useState } from "react"
import Link from "next/link"
import toast from "react-hot-toast"

export default function RegisterPage() {

    const [user, setUser] = useState({
        email:"",
        password:"",
        username:""
    })
const [loading, setLoading] = useState(false);
   const onSignup = async ()=>{
    setLoading(true);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: user.username,
        email: user.email,
        password: user.password
      })
    }).finally(() => {
    setLoading(false);
  })

    const data = await res.json()
    if(data != null){
        toast("User Registered Successfully")
        setLoading(false);
      }else{
        toast("Error Registering User")
      }
  }

  if(loading){
    return <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">Registering User...</h1>
    </div>
  }else{
      return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2'>
      <h1 className='text-2xl font-bold pb-4'>Signup Page</h1>
      <hr />

      <label htmlFor="username">Username</label>
      <input type="text" className='bg-gray-800 text-white p-2 rounded-md'
        id='username'
        value={user.username}
        onChange = {(e) => setUser({...user, username: e.target.value})}
        placeholder='Username'
        />
        <hr />
      
      <label htmlFor="email">Email</label>
      <input type="text" className='bg-gray-800 text-white p-2 rounded-md'
        id='email'
        value={user.email}
        onChange = {(e) => setUser({...user, email: e.target.value})}
        placeholder='Email'
        /><hr />
      
      <label htmlFor="password">Password</label>
      <input type="text" className='bg-gray-800 text-white p-2 rounded-md'
        id='password'
        value={user.password}
        onChange = {(e) => setUser({...user, password: e.target.value})}
        placeholder='Password'
        />
        <button onClick={onSignup} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 my-4 px-4 rounded'>Signup</button>
        <Link href="/login"> Visit Login Page</Link>
    </div>
  )
  }
}