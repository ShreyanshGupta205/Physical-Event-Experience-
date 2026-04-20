
const API_KEY = "AIzaSyAIKBdO95wujKHFEz7YaLbfNZmqCTPAZE0";

const USERS = [
  { email: "aarav@email.com", password: "password123" },
  { email: "karan@email.com", password: "password123" },
  { email: "arjun@email.com", password: "password123" },
  { email: "admin@eventra.com", password: "password123" }
];

async function registerUsers() {
  console.log("🚀 Starting Bulk Registration for Eventra Platform...");
  
  for (const user of USERS) {
    try {
      const resp = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          password: user.password,
          returnSecureToken: true
        })
      });
      
      const data = await resp.json();
      
      if (resp.ok) {
        console.log(`✅ SUCCESS: Created ${user.email}`);
      } else if (data.error && data.error.message === "EMAIL_EXISTS") {
        console.log(`ℹ️ INFO: ${user.email} already exists in Firebase.`);
      } else {
        console.error(`❌ FAILED: ${user.email} - ${data.error.message}`);
      }
    } catch (err) {
      console.error(`💥 CRITICAL ERROR: ${user.email} - ${err.message}`);
    }
  }
  
  console.log("🏁 Registration sequence complete.");
}

registerUsers();
