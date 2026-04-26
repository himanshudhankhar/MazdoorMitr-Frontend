// import React, { useEffect, useState } from "react";
// import axiosInstance from "../axiosConfig";
// import "./ComplaintsPage.css";

// const ComplaintsPage = () => {
//   const [complaints, setComplaints] = useState([]);
//   const [selectedComplaint, setSelectedComplaint] = useState(null);
//   const [commentInput, setCommentInput] = useState("");

//   const [showForm, setShowForm] = useState(false);
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//   });

//   const fetchComplaints = async () => {
//     try {
//       const { data } = await axiosInstance.get(
//         "/api/users/protected/complaints"
//       );
//       setComplaints(data.complaints || []);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchComplaints();
//   }, []);

//   const formatDate = (millis) => {
//     if (!millis) return "";
//     return new Date(millis).toLocaleString();
//   };

//   const formatTime = (millis) => {
//     if (!millis) return "";
//     return new Date(millis).toLocaleTimeString();
//   };

//   // ✅ ADD COMMENT
//   const handleAddComment = async (e) => {
//     e.preventDefault();
//     if (!commentInput.trim()) return;

//     try {
//       const { data } = await axiosInstance.post(
//         `/api/users/protected/complaints/${selectedComplaint.id}/add-comment`,
//         { message: commentInput }
//       );

//       setCommentInput("");

//       if (data.updatedComplaint) {
//         setSelectedComplaint(data.updatedComplaint);

//         setComplaints((prev) =>
//           prev.map((c) =>
//             c.id === data.updatedComplaint.id
//               ? data.updatedComplaint
//               : c
//           )
//         );
//       } else {
//         await fetchComplaints();
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // ✅ CREATE COMPLAINT
//   const handleCreateComplaint = async (e) => {
//     e.preventDefault();

//     if (!formData.description.trim()) {
//       alert("Description required");
//       return;
//     }

//     try {
//       await axiosInstance.post(
//         "/api/users/protected/complaints",
//         formData
//       );

//       setFormData({ title: "", description: "" });
//       setShowForm(false);
//       fetchComplaints();
//     } catch (err) {
//       console.error(err);
//       alert("Failed to create complaint");
//     }
//   };

//   const handleCloseRequest = async () => {
//   try {
//     await axiosInstance.post(
//       `/api/users/protected/complaints/${selectedComplaint.id}/close`,
//       {
//         userId: localStorage.getItem("userId"),
//       }
//     );

//     alert("Complaint closed");

//     // update UI
//     const updated = {
//       ...selectedComplaint,
//       status: "RESOLVED",
//     };

//     setSelectedComplaint(updated);

//     setComplaints((prev) =>
//       prev.map((c) =>
//         c.id === updated.id ? updated : c
//       )
//     );
//   } catch (err) {
//     console.error(err);
//     alert("Failed to close complaint");
//   }
// };

//   // 🔹 DETAIL VIEW
//   if (selectedComplaint) {
//     const comments = selectedComplaint.comments || [];

//     return (
//       <div className="complaints-page-wrapper">
//         <div className="complaints-page-header">
//           <button
//             className="complaints-page-back-btn"
//             onClick={() => setSelectedComplaint(null)}
//           >
//             ← Back
//           </button>
//         </div>

//         <div className="complaints-page-main-card">
//           <div className="complaints-page-ticket-info">
//             <h1 className="complaints-page-title">
//               {selectedComplaint.title || "Complaint"}
//             </h1>
//             <span className="complaints-page-status-pill">
//               {selectedComplaint.status}
//             </span>
//           </div>

//           <p className="complaints-page-description">
//             {selectedComplaint.description}
//           </p>

//           <span className="complaints-page-timestamp">
//             Created: {formatDate(selectedComplaint.createdAtMillis)}
//           </span>
//         </div>

//         <div className="complaints-page-chat-container">
//           {comments.map((c, i) => (
//             <div
//               key={i}
//               className={`complaints-page-comment-bubble ${
//                 c.senderType === "admin" ? "admin" : ""
//               }`}
//             >
//               {c.message}
//               <span className="complaints-page-comment-time">
//                 {formatTime(c.createdAtMillis)}
//               </span>
//             </div>
//           ))}
//         </div>

//         {selectedComplaint.status !== "RESOLVED" && (
//           <form
//             className="complaints-page-input-area"
//             onSubmit={handleAddComment}
//           >
//             <input
//               type="text"
//               className="complaints-page-input"
//               placeholder="Write your reply..."
//               value={commentInput}
//               onChange={(e) => setCommentInput(e.target.value)}
//             />
//             <button type="submit" className="complaints-page-send-btn">
//               Send
//             </button>
//           </form>
//         )}
//       </div>
//     );
//   }

//   // 🔹 FORM VIEW
//   if (showForm) {
//     return (
//       <div className="complaints-list-wrapper">
//         <button
//           className="complaints-page-back-btn"
//           onClick={() => setShowForm(false)}
//         >
//           ← Back
//         </button>

//         <form className="complaint-form" onSubmit={handleCreateComplaint}>
//           <h3>Raise Complaint</h3>

//           <input
//             type="text"
//             placeholder="Title (optional)"
//             value={formData.title}
//             onChange={(e) =>
//               setFormData({ ...formData, title: e.target.value })
//             }
//           />

//           <textarea
//             placeholder="Describe your issue..."
//             value={formData.description}
//             onChange={(e) =>
//               setFormData({
//                 ...formData,
//                 description: e.target.value,
//               })
//             }
//           />

//           <button type="submit">Submit</button>
//         </form>
//       </div>
//     );
//   }

//   // 🔹 LIST VIEW
//   return (
//     <div className="complaints-list-wrapper">
//       <div className="list-header">
//         <h2>My Complaints</h2>
//         <button
//           className="raise-btn"
//           onClick={() => setShowForm(true)}
//         >
//           + Raise Complaint
//         </button>
//       </div>

//       {complaints.map((c) => (
//         <div
//           key={c.id}
//           className="complaints-list-card"
//           onClick={() => setSelectedComplaint(c)}
//         >
//           <div className="row">
//             <b>{c.title || "Complaint"}</b>
//             <span className="status-pill">{c.status}</span>
//           </div>

//           <p>{c.description}</p>
//           <small>{formatDate(c.createdAtMillis)}</small>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default ComplaintsPage;


import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import "./ComplaintsPage.css";

const ComplaintsPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [commentInput, setCommentInput] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const fetchComplaints = async () => {
    try {
      const { data } = await axiosInstance.get(
        "/api/users/protected/complaints"
      );
      setComplaints(data.complaints || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // 🔥 Auto scroll chat
  useEffect(() => {
    const el = document.querySelector(
      ".complaints-page-chat-container"
    );
    if (el) el.scrollTop = el.scrollHeight;
  }, [selectedComplaint?.comments]);

  const formatDate = (millis) =>
    millis ? new Date(millis).toLocaleString() : "";

  const formatTime = (millis) =>
    millis ? new Date(millis).toLocaleTimeString() : "";

  // ✅ ADD COMMENT
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    try {
      const { data } = await axiosInstance.post(
        `/api/users/protected/complaints/${selectedComplaint.id}/add-comment`,
        { message: commentInput }
      );

      setCommentInput("");

      if (data.updatedComplaint) {
        setSelectedComplaint(data.updatedComplaint);

        setComplaints((prev) =>
          prev.map((c) =>
            c.id === data.updatedComplaint.id
              ? data.updatedComplaint
              : c
          )
        );
      } else {
        await fetchComplaints();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ CREATE COMPLAINT
  const handleCreateComplaint = async (e) => {
    e.preventDefault();

    if (!formData.description.trim()) {
      alert("Description required");
      return;
    }

    try {
      await axiosInstance.post(
        "/api/users/protected/complaints",
        formData
      );

      setFormData({ title: "", description: "" });
      setShowForm(false);
      fetchComplaints();
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ CLOSE REQUEST
  const handleCloseRequest = async () => {
    try {
      await axiosInstance.post(
        `/api/users/protected/complaints/${selectedComplaint.id}/close`,
        {
          userId: localStorage.getItem("userId"),
        }
      );

      const updated = {
        ...selectedComplaint,
        status: "RESOLVED",
      };

      setSelectedComplaint(updated);

      setComplaints((prev) =>
        prev.map((c) =>
          c.id === updated.id ? updated : c
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to close request");
    }
  };

  // 🔹 DETAIL VIEW
  if (selectedComplaint) {
    const comments = selectedComplaint.comments || [];

    return (
      <div className="complaints-page-wrapper">
        {/* HEADER */}
        <div className="complaints-page-header">
          <button
            className="back-btn"
            onClick={() => setSelectedComplaint(null)}
          >
            ← Back
          </button>
        </div>

        {/* MAIN CARD */}
        <div className="complaints-page-main-card">
          <div className="complaints-page-ticket-info">
            <div>
              <h2>{selectedComplaint.title}</h2>
            </div>

            <div className="complaint-actions">
              <span className="status-pill">
                {selectedComplaint.status}
              </span>

              {selectedComplaint.status !== "RESOLVED" && (
                <button
                  className="close-request-btn"
                  onClick={handleCloseRequest}
                >
                  Close Request
                </button>
              )}
            </div>
          </div>

          <p>{selectedComplaint.description}</p>

          <small>
            Created: {formatDate(selectedComplaint.createdAtMillis)}
          </small>
        </div>

        {/* CHAT */}
        <div className="complaints-page-chat-container">
          {comments.map((c, i) => (
            <div
              key={i}
              className={`chat-bubble ${
                c.senderType === "admin" ? "admin" : "user"
              }`}
            >
              {c.message}
              <span>{formatTime(c.createdAtMillis)}</span>
            </div>
          ))}
        </div>

        {/* INPUT */}
        {selectedComplaint.status !== "RESOLVED" && (
          <form
            className="chat-input"
            onSubmit={handleAddComment}
          >
            <input
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="Write your reply..."
            />
            <button type="submit">Send</button>
          </form>
        )}
      </div>
    );
  }

  // 🔹 FORM VIEW
  if (showForm) {
    return (
      <div className="complaints-list-wrapper">
        <button
          className="back-btn"
          onClick={() => setShowForm(false)}
        >
          ← Back
        </button>

        <form className="complaint-form" onSubmit={handleCreateComplaint}>
          <h3>Raise Complaint</h3>

          <input
            placeholder="Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />

          <textarea
            placeholder="Describe issue"
            value={formData.description}
            onChange={(e) =>
              setFormData({
                ...formData,
                description: e.target.value,
              })
            }
          />

          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }

  // 🔹 LIST VIEW
  return (
    <div className="complaints-list-wrapper">
      <div className="list-header">
        <h2>My Complaints</h2>
        <button
          className="raise-btn"
          onClick={() => setShowForm(true)}
        >
          + Raise Complaint
        </button>
      </div>

      {complaints.map((c) => (
        <div
          key={c.id}
          className="complaints-list-card"
          onClick={() => setSelectedComplaint(c)}
        >
          <div className="row">
            <b>{c.title}</b>
            <span className="status-pill">{c.status}</span>
          </div>

          <p>{c.description}</p>
          <small>{formatDate(c.createdAtMillis)}</small>
        </div>
      ))}
    </div>
  );
};

export default ComplaintsPage;