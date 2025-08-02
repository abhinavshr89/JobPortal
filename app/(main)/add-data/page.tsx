// import React from 'react';
// import data from '@/data/data.json';
// import db from '@/lib/prisma';

// const employmentTypes = ["full_time", "part_time", "contract", "internship"];
// const jobTypes = ["onsite", "remote", "hybrid"];

// function getRandomElement(arr: string[]) {
//     return arr[Math.floor(Math.random() * arr.length)];
// }

// const newData = data.map((item) => ({
//   title: item.job_title,
//   description: item.job_description,
//   location: item.job_location,
//   salary: (Math.floor(Math.random() * (100 - 70 + 1)) + 70) * 1000,
//   employment_type: getRandomElement(employmentTypes),
//   job_type: getRandomElement(jobTypes),
// }));

// // Server action to add all jobs
// async function addAllJobs() {
//     "use server";
//     await db.job.createMany({
//         data: newData,
//     });
// }

// function AddData() {
//     return (
//         <form action={addAllJobs}>
//             <button
//                 type="submit"
//                 className="px-4 py-2 mt-[200px] bg-blue-600 text-white rounded"
//             >
//                 Add All Jobs to Database
//             </button>
            
//         </form>
//     );
// }

// export default AddData;