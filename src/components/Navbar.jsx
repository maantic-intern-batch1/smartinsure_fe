import React from 'react'
import { removeUser } from '../store/userSlice'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';

function Navbar() {
  const navigate = useNavigate()
  const userState = useSelector(state => state.user)
  const dispatch = useDispatch()

  function logout() {
    dispatch(removeUser())
    localStorage.removeItem('authToken')
    return navigate('/')
  }

  return (

    <div>
      <div className='flex bg-color-blue h-14 justify-end' >
        <ul className='flex flex-row justify-end text-white'>

          <li><button className='py-4 px-8 bg-transparent hover:bg-color-dark'
            onClick={() => navigate(`/`)}
            key={"home"}>Home</button></li>

          <li><button className='py-4 px-8 bg-transparent hover:bg-color-dark'
            onClick={() => navigate(`/my-profile`)}
            key={"dashboard"}>My Profile</button></li>

          {/* <li><button className='p-4 bg-transparent hover:bg-color-dark'
            onClick={() => navigate(`/my-profile`)}
            key={"profile"}>Profile</button></li> */}

          {userState.role === "CLAIM_ASSESSOR" &&
            <li><button className='py-4 px-8 bg-transparent hover:bg-color-dark'
              onClick={() => navigate(`/view-all-users`)}>All users</button></li>}

          {userState.authToken ?
            <li><button className='py-4 px-8 bg-transparent hover:bg-color-dark'
              onClick={logout}>Log Out</button></li>
            : <div>
              <button className='py-4 px-8 bg-transparent hover:bg-color-dark'
                onClick={() => navigate(`/login`)}>Log In</button>
              <button className='py-4 px-8 bg-transparent hover:bg-color-dark'
                onClick={() => navigate("/signup")}
                key={"signup"}>Sign Up</button>
            </div>}
          {/* {!userState.authToken?
          <li>
            :null}  */}

        </ul>
      </div>
    </div>
  )
}

export default Navbar

//<li><button className='p-4 bg-transparent hover:bg-color-dark'
//onClick={logout}>Log Out</button></li>
//<button className='p-4 bg-transparent hover:bg-color-dark'
//                onClick={navigate("/home")}>Sign Up</button>