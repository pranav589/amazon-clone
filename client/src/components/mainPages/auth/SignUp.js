import React,{useState} from 'react'
import {useHistory} from 'react-router-dom'
import '../../../styles/auth.css'
import axios from 'axios'

function SignUp() {
    const history=useHistory()
    const [user,setUser]=useState({
        name:"",
        email:"",
        password:""
    })

    const onChangeInput=e=>{
        const {name,value}=e.target
        setUser({...user,[name]:value})
    }

    const registerSubmit=async e=>{
        e.preventDefault()
        try {
            await axios.post('/user/register',{...user})
            localStorage.setItem('firstLogin',true)
            window.location.href='/'
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    return (
        <div className='auth'>
      <div className='auth__container'>
        <h1>Sign Up</h1>
        <form onSubmit={registerSubmit}>
          <h5>Username</h5>
          <input
            name='name'
            type='text'
            required 
            onChange={onChangeInput}
            placeholder="Name"
          />
          <h5>Email</h5>
          <input
            name='email'
            type='email'
            required 
            onChange={onChangeInput}
            placeholder="Email"
          />
          <h5>Password</h5>
          <input
            name='password'
            type='password'
            required 
            onChange={onChangeInput}
            placeholder="Password"
          />

          <button type='submit' className='auth__signInButton'>
            Sign Up
          </button>
        </form>

        <p>
          By continuing, you agree to Amazon's Conditions of Use and Privacy
          Notice.
        </p>
        <button
          onClick={() => history.push('/login')}
          className='auth__registerButton'
        >
          Sign Into your Account
        </button>
      </div>
    </div>
    )
}

export default SignUp
