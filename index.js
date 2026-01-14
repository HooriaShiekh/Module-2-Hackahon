import { auth, db, storage } from "./firebase.config.js";
import { collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc, query, orderBy } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-storage.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  addDoc, collection, doc, deleteDoc,
  updateDoc, onSnapshot, query, where
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import {
  ref, uploadBytes, getDownloadURL, deleteObject
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// DOM
const authBox = document.getElementById("authBox");
const blogForm = document.getElementById("blogForm");
// const blogList = document.getElementById("blogList");
const logoutBtn = document.getElementById("logoutBtn");

// AUTH
signupBtn.onclick = () =>
  createUserWithEmailAndPassword(auth, email.value, password.value);

loginBtn.onclick = () =>
  signInWithEmailAndPassword(auth, email.value, password.value);

logoutBtn.onclick = () => signOut(auth);

// AUTH UI toggle



// DOM Elements
const blogList = document.getElementById("blogList");
const categoryFilter = document.getElementById("categoryFilter");

// Add Blog
addBlogBtn.onclick = async () => {
  if(!auth.currentUser){ alert("Login first!"); return; }

  const file = image.files[0];
  let url = "";

  if(file){
    const imgRef = ref(storage, `blogs/${Date.now()}-${file.name}`);
    await uploadBytes(imgRef,file);
    url = await getDownloadURL(imgRef);
  }

  await addDoc(collection(db,"blogs"),{
    title: title.value,
    content: content.value,
    category: category.value || "Other",
    imageURL: url,
    userId: auth.currentUser.uid,
    createdAt: new Date()
  });

  title.value = "";
  content.value = "";
  category.value = "";
  image.value = "";
};

// Realtime Feed + Filter + Owner Only Edit/Delete
const renderBlogs = snapshot => {
  blogList.innerHTML = "";
  snapshot.forEach(post=>{
    const data = post.data();
    const isOwner = auth.currentUser && auth.currentUser.uid === data.userId;

    if(categoryFilter.value && data.category !== categoryFilter.value) return;

    blogList.innerHTML += `
      <div class="blog">
        <h3 contenteditable="${isOwner}" id="t-${post.id}">${data.title}</h3>
        <p contenteditable="${isOwner}" id="c-${post.id}">${data.content}</p>
        <p><strong>Category:</strong> ${data.category}</p>
        ${data.imageURL ? `<img src="${data.imageURL}">` : ""}
        ${isOwner ? `
          <button onclick="editBlog('${post.id}')">Edit</button>
          <button onclick="deleteBlog('${post.id}','${data.imageURL}')">Delete</button>
        `: ""}
      </div>
    `;
  });
};

// Snapshot
onSnapshot(query(collection(db,"blogs"), orderBy("createdAt","desc")), snapshot => renderBlogs(snapshot));

// Filter change
categoryFilter.addEventListener("change", ()=>{
  onSnapshot(query(collection(db,"blogs"), orderBy("createdAt","desc")), snapshot => renderBlogs(snapshot));
});

// Edit Blog
window.editBlog = async id => {
  const t = document.getElementById(`t-${id}`).innerText;
  const c = document.getElementById(`c-${id}`).innerText;
  await updateDoc(doc(db,"blogs",id), {title:t, content:c});
};

// Delete Blog
window.deleteBlog = async (id,url) => {
  if(url) await deleteObject(ref(storage,url));
  await deleteDoc(doc(db,"blogs",id));
};
