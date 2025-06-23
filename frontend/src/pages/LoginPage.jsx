import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User } from 'lucide-react'
import { Link } from 'react-router-dom';
import AuthImagePattern from '../components/AuthImagePattern';
import { toast } from "react-hot-toast";

const LoginPage = () => {
  const { isLoggingIn, login } = useAuthStore()

  const [showPassword, setShowPassword] = useState(false)

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  // function validateForm() {

  //   return true
  // }
  function handleSubmit(e) {
    e.preventDefault()
    const emailRegex = /^[^\s@]+@[a-zA-Z]+(\.[a-zA-Z]{2,})+$/;
    if (!emailRegex.test(formData.email))
      return toast.error("Please enter a valid email");
    login(formData)
  }
  return (
    <div className='min-h-screen grid lg:grid-cols-2'>
      <div className='flex flex-col justify-center items-center p-6 sm:p-12'>
        <div className='w-full max-w-md space-y-8'>

          {/* logo */}
          <div className='text-center mb-8'>
            <div className='flex flex-col items-center gap-2 group'>
              <div className='size-12 rounded-xl bg-primary/15 flex items-center justify-center group-hover:bg-primary/25 transition-colors'>
                <MessageSquare className='size-6 text-primary' />
              </div>
              <h1 className='text-2xl font-bold mt-2'>Welcome Back</h1>
              <p className='text-base-content/60'>Sign in to your account</p>
            </div>
          </div>

          {/* form */}
          <form onSubmit={handleSubmit} className='space-y-6'>

            <div className='form-control'>
              <label className='label'>
                <span className='label-text font-medium'>Email</span>
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center z-50'>
                  <Mail className='size-5 text-base-content/40' />
                </div>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input input-bordered w-full pl-10"
                />
              </div>
            </div>

            <div className='form-control'>
              <label className='label'>
                <span className='label-text font-medium'>Password</span>
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center z-50'>
                  <Lock className='size-5 text-base-content/40' />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input input-bordered w-full pl-10"
                />
                <button type='button' className='absolute inset-y-0 right-0 pr-3 flex items-center ' onClick={() => setShowPassword(!showPassword)}>
                  {
                    showPassword ?
                      <EyeOff className='size-5 text-base-content/40' /> : <Eye className='size-5 text-base-content/40' />
                  }
                </button>
              </div>
            </div>
            <button type='submit' className='btn btn-primary w-full' disabled={isLoggingIn}>
              {
                isLoggingIn ?
                  (<><Loader2 className='size-5 animate-spin' />Loading</>)
                  : ("Sign in")
              }
            </button>
          </form>
          <div className='text-center'>
            <p className='text-base-content/60'>
              Don't have an account?{" "}
              <Link className='link link-primary' to='/signup'>Create account</Link>
            </p>
          </div>
        </div>
      </div>
      {/* Right side */}
      <AuthImagePattern
        title="Join our community"
        subtitle="Connect with friends, share moments and stay in touch with your loved ones."
      />
    </div>
  )
}

export default LoginPage 