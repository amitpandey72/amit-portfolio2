import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";

import {
  getFirestore,
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCLaf4nJAZ5tL4T2Nm5knwjxHFXF32lbac",
  authDomain: "amit-portfolio-a7228.firebaseapp.com",
  projectId: "amit-portfolio-a7228",
  storageBucket: "amit-portfolio-a7228.firebasestorage.app",
  messagingSenderId: "322182335931",
  appId: "1:322182335931:web:f0c18449c6d2456644889e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Check auth state
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const q = query(
      collection(db, "pending_users"),
      where("uid", "==", user.uid)
    );
    const querySnapshot = await getDocs(q);

    let name = "User";
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      name = data.name || "User";
    });

    const welcomeEl = document.getElementById("welcomeText");
    if (welcomeEl) {
      welcomeEl.textContent = `Welcome, ${name}!`;
    }

  } else {
    // User not logged in
    window.location.href = "login.html";
  }
});

// Logout
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      await signOut(auth);
      window.location.href = "login.html";
    });
  }
});

// Dummy files array with your provided links
const files = [
  {
    name: "Document 1.pdf",
    url: "https://drive.google.com/uc?export=download&id=1utEl-jE7hu5lhE-l6Y44j6MdqzPEeNxC"
  },
  {
    name: "Document 2.pdf",
    url: "https://drive.google.com/uc?export=download&id=1Q4LC6a0LPIGpx3k4797ieLDx4k619heP"
  }
];

// Populate table
document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.querySelector("#filesTable tbody");

  if (tableBody) {
    files.forEach(file => {
      const row = document.createElement("tr");

      const nameCell = document.createElement("td");
      nameCell.textContent = file.name;

      const linkCell = document.createElement("td");
      const link = document.createElement("a");
      link.href = file.url;
      link.textContent = "Download";
      link.target = "_blank";
      link.style.color = "#007bff";
      link.style.textDecoration = "none";

      linkCell.appendChild(link);

      row.appendChild(nameCell);
      row.appendChild(linkCell);

      tableBody.appendChild(row);
    });
  }
});

// Loader hide
window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  if (preloader) {
    preloader.style.display = "none";
  }
});
