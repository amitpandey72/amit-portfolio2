// ========== IMPORTS ==========
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";

// ========== CONFIG ==========
const firebaseConfig = {
  apiKey: "AIzaSyCLaf4nJAZ5tL4T2Nm5knwjxHFXF32lbac",
  authDomain: "amit-portfolio-a7228.firebaseapp.com",
  projectId: "amit-portfolio-a7228",
  storageBucket: "amit-portfolio-a7228.firebasestorage.app",
  messagingSenderId: "322182335931",
  appId: "1:322182335931:web:f0c18449c6d2456644889e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ========== SIGNUP ==========
document.addEventListener("DOMContentLoaded", () => {
  const signupBtn = document.getElementById("signupBtn");
  if (signupBtn) {
    signupBtn.addEventListener("click", async () => {
      const name = document.getElementById("signupName").value;
      const email = document.getElementById("signupEmail").value;
      const mobile = document.getElementById("signupMobile").value;
      const password = document.getElementById("signupPassword").value;
      const confirmPassword = document.getElementById("signupConfirmPassword").value;
      const message = document.getElementById("signupMessage").value;

      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await addDoc(collection(db, "pending_users"), {
          uid: user.uid,
          name: name,
          email: email,
          mobile: mobile,
          message: message,
          approved: false,
          createdAt: new Date()
        });

        alert("Signup successful! Waiting for admin approval.");
        await signOut(auth);
        window.location.href = "login.html";

      } catch (error) {
        console.error(error);
        alert(error.message);
      }
    });
  }
});

// ========== LOGIN ==========
document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");
  if (loginBtn) {
    loginBtn.addEventListener("click", async () => {
      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;

      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const q = query(
          collection(db, "pending_users"),
          where("uid", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);

        let approved = false;
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.approved === true) {
            approved = true;
          }
        });

        if (approved) {
          alert("Login successful!");
          window.location.href = "dashboard.html";
        } else {
          alert("Your account is not approved yet. Please wait for admin approval.");
          await signOut(auth);
        }

      } catch (error) {
        console.error(error);
        alert(error.message);
      }
    });
  }
});

