import React, { useState, useEffect } from "react";

interface Post {
  id: number;
  date: string;
  time: string;
  content: string;
  picture: string;
  userId: number;
  userName: string;
}

const Feed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState<string>("");
  const [newPostPicture, setNewPostPicture] = useState<string>("");
  const [newPostUserId, setNewPostUserId] = useState<number>(1); // Mock user ID
  const [editingPostId, setEditingPostId] = useState<number | null>(null); // To track the post being edited
  const [editingContent, setEditingContent] = useState<string>("");
  const [editingPicture, setEditingPicture] = useState<string>("");

  // Fetch posts from backend
  const fetchPosts = async () => {
    try {
      const response = await fetch("http://localhost:8081/posts");
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  // Create a new post
  const createPost = async () => {
    if (newPostContent.trim()) {
      try {
        const response = await fetch("http://localhost:8081/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: newPostContent,
            picture: newPostPicture,
            userId: newPostUserId,
          }),
        });
        const newPost = await response.json();
        setPosts([newPost, ...posts]); // Prepend new post to the feed
        setNewPostContent("");
        setNewPostPicture("");
      } catch (error) {
        console.error("Error creating post:", error);
      }
    }
  };

  // Edit an existing post
  const editPost = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8081/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: editingContent,
          picture: editingPicture,
        }),
      });
      const updatedPost = await response.json();
      setPosts(posts.map((post) => (post.id === id ? updatedPost : post)));
      setEditingPostId(null); // Close the edit form
      setEditingContent("");
      setEditingPicture("");
    } catch (error) {
      console.error("Error editing post:", error);
    }
  };

  // Delete a post
  const deletePost = async (id: number) => {
    try {
      await fetch(`http://localhost:8081/posts/${id}`, {
        method: "DELETE",
      });
      setPosts(posts.filter((post) => post.id !== id));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Žvejybos Įrašai</h1>

      {/* Create Post Section */}
      <div style={{ marginBottom: "20px" }}>
        <h2>Sukurti Įrašą</h2>
        <textarea
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          rows={3}
          style={{ width: "100%", padding: "10px", fontSize: "16px" }}
          placeholder="Parašykite savo įrašą"
        />
        <input
          type="text"
          value={newPostPicture}
          onChange={(e) => setNewPostPicture(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            margin: "10px 0",
            fontSize: "16px",
          }}
          placeholder="Nuotraukos nuoroda (neprivaloma)"
        />
        <button
          onClick={createPost}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Paskelbti
        </button>
      </div>

      {/* Posts Section */}
      <div>
        {posts.length === 0 ? (
          <p>Nėra įrašų. Būk pirmas!</p>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "5px",
              }}
            >
              <p>
                <strong>{post.userName}</strong> - {post.date} {post.time}
              </p>
              {editingPostId === post.id ? (
                <div>
                  <textarea
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                    rows={3}
                    style={{ width: "100%", padding: "10px", fontSize: "16px" }}
                    placeholder="Edit your post"
                  />
                  <input
                    type="text"
                    value={editingPicture}
                    onChange={(e) => setEditingPicture(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px",
                      margin: "10px 0",
                      fontSize: "16px",
                    }}
                    placeholder="Edit picture URL"
                  />
                  <button
                    onClick={() => editPost(post.id)}
                    style={{
                      padding: "10px 20px",
                      fontSize: "16px",
                      backgroundColor: "#007bff",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Išsaugoti
                  </button>
                  <button
                    onClick={() => setEditingPostId(null)}
                    style={{
                      padding: "10px 20px",
                      fontSize: "16px",
                      backgroundColor: "#dc3545",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                      marginLeft: "10px",
                    }}
                  >
                    Atšaukti
                  </button>
                </div>
              ) : (
                <>
                  <p>{post.content}</p>
                  {post.picture && (
                    <img
                      src={post.picture}
                      alt="Post"
                      style={{ maxWidth: "100%", marginTop: "10px" }}
                    />
                  )}
                  <button
                    onClick={() => {
                      setEditingPostId(post.id);
                      setEditingContent(post.content);
                      setEditingPicture(post.picture);
                    }}
                    style={{
                      padding: "5px 10px",
                      fontSize: "14px",
                      backgroundColor: "#007bff",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                      marginTop: "10px",
                    }}
                  >
                    Redaguoti
                  </button>
                  <button
                    onClick={() => deletePost(post.id)}
                    style={{
                      padding: "5px 10px",
                      fontSize: "14px",
                      backgroundColor: "#dc3545",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                      marginLeft: "10px",
                    }}
                  >
                    Ištrinti
                  </button>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Feed;
