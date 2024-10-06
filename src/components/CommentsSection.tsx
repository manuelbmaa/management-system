import React, { useState } from "react";
import axios from "axios";

interface Comment {
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
}

interface CommentsSectionProps {
  projectId: string;
  currentUser: {
    _id: string;
    fullname: string;
  } | null;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ projectId, currentUser }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [message, setMessage] = useState("");

  const handleAddComment = async () => {
    if (!currentUser) {
      console.error("No hay usuario autenticado");
      return;
    }

    const newComment: Comment = {
      userId: currentUser._id,
      userName: currentUser.fullname,
      message,
      timestamp: new Date(),
    };

    try {
      const response = await axios.put(`/api/projects`, {
        id: projectId,
        comment: newComment,
      });
      if (response.status === 200) {
        setComments([...comments, newComment]);
        setMessage("");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="bg-gray mt-4">
      <h4>Comentarios y Actualizaciones</h4>
      {comments.map((comment, index) => (
        <div key={index} className="border-b py-2">
          <p>
            <strong>{comment.userName}:</strong> {comment.message}
          </p>
          <small>{comment.timestamp.toLocaleString()}</small>
        </div>
      ))}
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Añadir comentario"
        className="p-2 border w-full mt-2"
      />
      <button
        onClick={handleAddComment}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
      >
        Añadir Comentario
      </button>
    </div>
  );
};

export default CommentsSection;
