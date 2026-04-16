import React, { useState } from 'react'
import { SendHorizonal } from 'lucide-react'

// 1. Define the shape of a single Comment
interface IComment {
  _id: string;
  user: string; // The User ID string
  text: string;
  createdAt?: string;
}

// 2. Define the shape of the logged-in User (from Session)
interface IUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

// 3. Define the Props for the Component
interface CommentSectionProps {
  reelId: string;
  initialComment: IComment[];
  user: IUser;
}


const CommentSection = ({reelId , initialComment,user}:CommentSectionProps) => {
    const [text , setText] = useState<string>("")
    const [comments , setComments] = useState<IComment[]>(initialComment)

    const handleComment = async(e : React.FormEvent) =>{
        e.preventDefault()
        try {
      const response = await fetch("/api/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reelId, text }),
      });

      const data = await response.json();

      if (response.ok) {
        setComments(data.comment.comments)
        setText("")
      }
    } catch (error) {
      console.error("Failed to Comment:", error);
    }
    }
    const deleteComment = async(commentId : string)=>{
        try {
            const response = await fetch("/api/comment", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reelId, commentId })
      })
      if(response.ok){
        setComments((prev) => prev.filter((c) => c._id !== commentId));
      }
        } catch (error) {
            console.error("Failed to delete",error);
        }
    }
  return (
    <div className='w-96 min-h-screen'>
        <div className='flex flex-col gap-1.5'>
            <input className='bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body' type="text" placeholder='write a comment' value={text} onChange={(e)=>setText(e.target.value)} />
            <button className='text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-base text-sm px-4 py-2.5 text-center leading-5 cursor-pointer flex gap-2.5 justify-center items-center' disabled={!text} onClick={handleComment}> <p className='text-xl'>Post</p><p><SendHorizonal/></p> </button>
        </div>
        <div className='flex flex-col gap-1 items-center'>
            <p className='text-2xl'>Comments</p>
            <div className='w-full flex flex-col-reverse'>
            {comments.length > 0 ? comments.map((com)=> <div className='bg-gray-800 mt-1 p-2 flex-col flex gap-2' key={com._id}>
                <div className='text-sm'>{com.user}</div>
                <div className='text-2xl'>{com.text}</div>
                {user?.id == com.user ?
                <button onClick={()=>deleteComment(com._id)} className='text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-base text-sm px-4 py-2.5 text-center leading-5 w-fit'>Delete</button> : null
                }</div> ) : <div className='text-red-500'>No Comments..</div> }
            </div>
        </div>
    </div>
  )
}

export default CommentSection