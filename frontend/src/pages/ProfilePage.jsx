// import React, { useState } from 'react'
// import { useNavigate } from 'react-router-dom';
// import assets from '../assets/assets';
// import { AuthContext } from '../../context/AuthContext';
// import { useContext } from 'react';

// const ProfilePage = () => {
//   const {authUser,updateProfile} = useContext(AuthContext);

//   const [selectedImage, setSelectedImage] = React.useState(null);
//   const navigate = useNavigate();
//   const[name,setName]=useState(authUser?.fullName || "");
//   const[bio,setBio]=useState(authUser?.bio || "");


//   const handleSubmit =  async(e) => {
//     e.preventDefault();
//     if(!selectedImage){
//       await updateProfile({fullName:name, bio })
//       navigate('/');
//       return;
//     }
//     const reader=new FileReader();
//     reader.readAsDataURL(selectedImage);
//     reader.onload=async()=>{
//       const base64image=reader.result;
//       await updateProfile({fullName:name, bio, profilePicture:base64image });
//       navigate('/');
//     }   
   
//   }
//   return (
//     <div className='min-h-screen bg-cover bg-no-repeat flex items-center justify-center'>
//       <div className='w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg'>
//         <form  onSubmit={handleSubmit} className='flex flex-col gap-5 p-10 flex-1' >
//           <h3 className='text-lg'>profile details</h3>
//           <label htmlFor="avatar" className='flex items-center gap-3 cursor-pointer'>
//             {/* //takes image from user and convert into url and then display to user  */}
//             <input onChange={(e)=>setSelectedImage(e.target.files[0])} type="file" id='avatar' accept='.png, .jpg ,.jpeg ' hidden />
//             <img src={selectedImage?URL.createObjectURL(selectedImage):assets.avatar_icon} alt=""  className={` w-12 h-12 ${selectedImage &&'rounded-full'}`}/>
//             upload profile picture
//           </label>
//           <input onChange={(e)=>setName(e.target.value)} value={name}
//            type="text"required placeholder='Your name' className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500' />
//           <textarea onChange={(e)=>setBio(e.target.value)} value={bio} rows={4} required placeholder='Your bio' className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500'></textarea>
//           <button type='submit' className='"bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full text-lg cursor-pointer'> Save</button>
//         </form>
//         <img src={authUser.profilePicture ||assets.logo_icon} className={`max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10 ${selectedImage && 'rounded-full'}`} alt="" />
//       </div>
      
//     </div>
//   )
// }

// export default ProfilePage



import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import assets from '../assets/assets';
import { AuthContext } from '../../context/AuthContext';

const ProfilePage = () => {
  const { authUser, updateProfile } = useContext(AuthContext); // ✅ Corrected function name

  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();
  const [name, setName] = useState(authUser?.fullName || "");
  const [bio, setBio] = useState(authUser?.bio || "");

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (!selectedImage) {
  //     await updateProfile({ fullName: name, bio });
  //     navigate('/');
  //     return;
  //   }

  //   const reader = new FileReader();
  //   reader.readAsDataURL(selectedImage);
  //   reader.onload = async () => {
  //     const base64image = reader.result;
  //     await updateProfile({ fullName: name, bio,  profilePicture: base64image }); // ✅ Use correct field name expected by backend
  //     navigate('/');
  //   };
  // };


  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!selectedImage) {
    await updateProfile({ fullName: name, bio });
    navigate("/");
    return;
  }

  const reader = new FileReader();
  reader.readAsDataURL(selectedImage);
  reader.onload = async () => {
    const base64image = reader.result;
    // use `profilePic` to match your model field
    await updateProfile({ fullName: name, bio, profilePic: base64image });
    navigate("/");
  };
};

  return (
    <div className='min-h-screen bg-cover bg-no-repeat flex items-center justify-center'>
      <div className='w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-5 p-10 flex-1'>
          <h3 className='text-lg'>Profile Details</h3>

          <label htmlFor="avatar" className='flex items-center gap-3 cursor-pointer'>
            <input
              onChange={(e) => setSelectedImage(e.target.files[0])}
              type="file"
              id='avatar'
              accept='.png, .jpg, .jpeg'
              hidden
            />
            <img
              src={selectedImage ? URL.createObjectURL(selectedImage) : assets.avatar_icon}
              alt=""
              className={`w-12 h-12 ${selectedImage && 'rounded-full'}`}
            />
            Upload profile picture
          </label>

          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            required
            placeholder='Your name'
            className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500'
          />

          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            rows={4}
            required
            placeholder='Your bio'
            className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500'
          ></textarea>

          <button
            type='submit'
            className='bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full text-lg cursor-pointer'
          >
            Save
          </button>
        </form>

        <img
          src={selectedImage ? URL.createObjectURL(selectedImage) : (authUser?.profilePicture || assets.logo_icon)}
          className='max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10'
          alt="Profile"
        />
      </div>
    </div>
  );
};

export default ProfilePage;
