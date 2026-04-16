"use client";

import { useRouter } from "next/navigation";


const DeleteBtn = ({fileId} : {fileId : string}) => {
   const router = useRouter()
const handleDelete = async (file: string) => {
  const res = await fetch("/api/delete-video", {
    method: "POST",
    body: JSON.stringify({file}),
  });

  if (res.ok) {
    router.push("/profile")
  }
};
  return (
    <button onClick={()=>handleDelete(fileId)} className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-base text-sm px-4 py-2.5 text-center leading-5">Delete</button>
  )
}

export default DeleteBtn