import React, { useState } from 'react';

interface Post {
  id: number;
  content: string;
  fish: string[];
  lake: string;
}

const Feed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState<string>('');
  const [newPostFish, setNewPostFish] = useState<string[]>(['eserys']);
  const [newPostLake, setNewPostLake] = useState<string>('kauno marios');
  const [isCreatePopupOpen, setCreatePopupOpen] = useState<boolean>(false);
  const [isEditPopupOpen, setEditPopupOpen] = useState<boolean>(false);
  const [isDeletePopupOpen, setDeletePopupOpen] = useState<boolean>(false);
  const [postToDelete, setPostToDelete] = useState<number | null>(null); // Store the post to be deleted
  const [editPostId, setEditPostId] = useState<number | null>(null);
  const [editPostContent, setEditPostContent] = useState<string>('');
  const [editPostFish, setEditPostFish] = useState<string[]>(['eserys']);
  const [editPostLake, setEditPostLake] = useState<string>('kauno marios');

  // Create a new post
  const createPost = () => {
    if (newPostContent.trim()) {
      setPosts([
        ...posts,
        {
          id: Date.now(),
          content: newPostContent,
          fish: newPostFish,
          lake: newPostLake,
        },
      ]);
      setNewPostContent('');
      setNewPostFish(['eserys']);
      setNewPostLake('kauno marios');
      closeCreatePopup(); // Close the popup after posting
    }
  };

  // Open edit popup
  const startEditing = (id: number) => {
    const postToEdit = posts.find((post) => post.id === id);
    if (postToEdit) {
      setEditPostId(postToEdit.id);
      setEditPostContent(postToEdit.content);
      setEditPostFish(postToEdit.fish);
      setEditPostLake(postToEdit.lake);
      setEditPopupOpen(true);
    }
  };

  // Save edited post
  const savePost = () => {
    if (editPostId !== null && editPostContent.trim()) {
      setPosts(
        posts.map((post) =>
          post.id === editPostId
            ? { ...post, content: editPostContent, fish: editPostFish, lake: editPostLake }
            : post
        )
      );
      closeEditPopup();
    }
  };

  // Delete post
  const deletePost = () => {
    if (postToDelete !== null) {
      setPosts(posts.filter((post) => post.id !== postToDelete));
      setPostToDelete(null);
      closeDeletePopup(); // Close delete popup
    }
  };

  // Open delete confirmation popup
  const openDeletePopup = (id: number) => {
    setPostToDelete(id);
    setDeletePopupOpen(true);
  };

  // Close edit popup
  const closeEditPopup = () => {
    setEditPopupOpen(false);
    setEditPostId(null);
    setEditPostContent('');
    setEditPostFish(['eserys']);
    setEditPostLake('kauno marios');
  };

  // Close create post popup
  const closeCreatePopup = () => {
    setCreatePopupOpen(false);
    setNewPostContent('');
    setNewPostFish(['eserys']);
    setNewPostLake('kauno marios');
  };

  // Close delete confirmation popup
  const closeDeletePopup = () => {
    setDeletePopupOpen(false);
    setPostToDelete(null);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Žvejybos Įrašai</h1>

      {/* Create Post Button */}
      <button
        onClick={() => setCreatePopupOpen(true)}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Sukurti Įrašą
      </button>

      {/* Posts Section */}
      <div>
        {posts.length === 0 ? (
          <p>Nėra įrašų. Būk pirmas!</p>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              style={{
                border: '1px solid #ccc',
                padding: '10px',
                marginBottom: '10px',
                borderRadius: '5px',
              }}
            >
              <p><strong>Žuvis:</strong> {post.fish.join(', ')}</p>
              <p><strong>Ūkis:</strong> {post.lake}</p>
              <p style={{ margin: 0 }}>{post.content}</p>
              <button
                onClick={() => startEditing(post.id)}
                style={{
                  marginTop: '10px',
                  padding: '5px 10px',
                  fontSize: '14px',
                  backgroundColor: '#ffc107',
                  color: 'black',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Redaguoti
              </button>
              <button
                onClick={() => openDeletePopup(post.id)}
                style={{
                  marginTop: '10px',
                  padding: '5px 10px',
                  fontSize: '14px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  marginLeft: '10px',
                }}
              >
                Ištrinti
              </button>
            </div>
          ))
        )}
      </div>

      {/* Edit Post Popup */}
      {isEditPopupOpen && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '10px',
            padding: '20px',
            zIndex: 1000,
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          }}
        >
          <h2>Redaguoti Įrašą</h2>
          <textarea
            value={editPostContent}
            onChange={(e) => setEditPostContent(e.target.value)}
            rows={3}
            style={{ width: '100%', padding: '10px', fontSize: '16px' }}
          />
          <div style={{ margin: '10px 0' }}>
            <label>
              Kokia žuvis:
              <select
                multiple
                value={editPostFish}
                onChange={(e) => setEditPostFish(Array.from(e.target.selectedOptions, option => option.value))}
                style={{ marginLeft: '10px', padding: '5px' }}
              >
                <option value="eserys">Ešerys</option>
                <option value="lydeka">Lydeka</option>
                <option value="karosas">Karosas</option>
              </select>
            </label>
          </div>
          <div style={{ margin: '10px 0' }}>
            <label>
              Koks ežeras:
              <select
                value={editPostLake}
                onChange={(e) => setEditPostLake(e.target.value)}
                style={{ marginLeft: '10px', padding: '5px' }}
              >
                <option value="kauno marios">Kauno Marios</option>
                <option value="ezeras">Ežeras</option>
              </select>
            </label>
          </div>
          <button
            onClick={savePost}
            style={{
              marginTop: '10px',
              padding: '5px 10px',
              fontSize: '14px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Išsaugoti
          </button>
          <button
            onClick={closeEditPopup}
            style={{
              marginLeft: '10px',
              padding: '5px 10px',
              fontSize: '14px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Atšaukti
          </button>
        </div>
      )}

      {/* Create Post Popup */}
      {isCreatePopupOpen && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '10px',
            padding: '20px',
            zIndex: 1000,
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          }}
        >
          <h2>Sukurti Įrašą</h2>
          <textarea
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            rows={3}
            style={{ width: '100%', padding: '10px', fontSize: '16px' }}
          />
          <div style={{ margin: '10px 0' }}>
            <label>
              Kokia žuvis:
              <select
                multiple
                value={newPostFish}
                onChange={(e) => setNewPostFish(Array.from(e.target.selectedOptions, option => option.value))}
                style={{ marginLeft: '10px', padding: '5px' }}
              >
                <option value="eserys">Ešerys</option>
                <option value="lydeka">Lydeka</option>
                <option value="karosas">Karosas</option>
              </select>
            </label>
          </div>
          <div style={{ margin: '10px 0' }}>
            <label>
              Koks ežeras:
              <select
                value={newPostLake}
                onChange={(e) => setNewPostLake(e.target.value)}
                style={{ marginLeft: '10px', padding: '5px' }}
              >
                <option value="kauno marios">Kauno Marios</option>
                <option value="ezeras">Ežeras</option>
              </select>
            </label>
          </div>
          <button
            onClick={createPost}
            style={{
              marginTop: '10px',
              padding: '5px 10px',
              fontSize: '14px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Paskelbti
          </button>
          <button
            onClick={closeCreatePopup}
            style={{
              marginLeft: '10px',
              padding: '5px 10px',
              fontSize: '14px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Atšaukti
          </button>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {isDeletePopupOpen && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '10px',
            padding: '20px',
            zIndex: 1000,
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          }}
        >
          <h2>Ar tikrai norite ištrinti šį įrašą?</h2>
          <button
            onClick={deletePost}
            style={{
              marginTop: '10px',
              padding: '5px 10px',
              fontSize: '14px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Ištrinti
          </button>
          <button
            onClick={closeDeletePopup}
            style={{
              marginLeft: '10px',
              padding: '5px 10px',
              fontSize: '14px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Atšaukti
          </button>
        </div>
      )}
    </div>
  );
};

export default Feed;
