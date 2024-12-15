import axios from "axios";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";

export default function Comment(props) {
  console.log(props);
  const lakeId = props.lakeId;
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`/comment/${lakeId}`);
        setComments(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();

    const intervalId = setInterval(fetchComments, 2000); // Vyksta pollinimas kas 2 sekundes, resursu svaistymas, socketu implementacija reikalinga

    return () => clearInterval(intervalId);
  }, [lakeId]);

  const handleInputChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newComment.trim() !== "") {
      try {
        await axios.post(`/comment`, {
          message: newComment,
          lakeId: lakeId,
        });

        const response = await axios.get(`/comment/${lakeId}`);
        setComments(response.data);
      } catch (error) {
        console.error("Error posting comment:", error);
      }
      setNewComment("");
    }
  };

  return (
    <div className="comment-container bg-white rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Komentarai</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={newComment}
          onChange={handleInputChange}
          placeholder="Komentaras..."
          className="w-full bg-gray-100 border border-gray-300 rounded-lg p-2 mb-4"
          rows={4}
        />

        <Button type="submit" onClick={handleSubmit}>
          Komentuoti
        </Button>
      </form>
      <div className="comments-list mt-4">
        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <div
              key={index}
              className="comment-card bg-gray-100 rounded-lg p-4 mb-4"
            >
              <div className="flex items-center mb-2">
                <img
                  src={`data:image/png;base64,${comment.imageBlob}`}
                  alt="Profile"
                  className="w-8 h-8 mr-2 rounded-full"
                />
                <p className="font-bold">{comment.username}</p>
              </div>
              <p className="text-gray-800">{comment.message}</p>
            </div>
          ))
        ) : (
          <p>Komentarų nėra</p>
        )}
      </div>
    </div>
  );
}
