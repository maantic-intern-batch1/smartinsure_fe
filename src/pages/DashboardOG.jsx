// import React from 'react'
// import ViewClaim from '../components/ViewClaim'
// import axios from 'axios'

// function Dashboard() {

//   const claimsData = [
//     { id: 1, createdAt: '2024-08-11', approved: 'NO' },
//     { id: 2, createdAt: '2024-08-10', approved: null },
//     { id: 3, createdAt: '2024-08-09', approved: 'YES' },
//     { id: 4, createdAt: '2024-08-08', approved: null },
//     { id: 5, createdAt: '2024-08-07', approved: 'YES' },
//     { id: 6, createdAt: '2024-08-06', approved: null },
//     { id: 7, createdAt: '2024-08-05', approved: 'NO' }

//   ];


//   let data = []
//   const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJDTEFJTV9BU1NFU1NPUiIsImlhdCI6MTcyMjYzNjk4MX0.zwo4uDncZDgN3ikBNtzjZHm4-dth5bGNNdwQny3R6uc';

//   axios.get('http://localhost:3000/claim/user/4', {
//     headers: {
//       Authorization: `Bearer ${token}`
//     }
//   })
//     .then(response => {
//       console.log(response.data);
//     })
//     .catch(error => {
//       console.error(error);
//     });


//    //replace with code to get claims data



//   return (
//     <div className="mt-20">
//       <button className=' text-white px-4 py-2 hover:bg-color-blue bg-color-dark rounded-lg mb-10'>Back to Profile Page</button>
//       <div className="flex flex-row flex-wrap justify-center lg:justify-around">
//         {claimsData.map(claim => (<ViewClaim id={claim.id} createdAt={claim.createdAt} approved={claim.approved} />))}
//       </div>

//     </div>
//   )
// }

// export default Dashboard