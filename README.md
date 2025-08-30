# 🗨️ Real-Time Chat App

A full-stack real-time chat application built with **React**, **Express**, **MongoDB**, **Socket.IO** and **Cloudinary**.

🚀 **Live Demo:** [chat-app-demo](https://chat-app-s1u6.onrender.com/)

---

## 📦 Tech Stack

### Frontend

- React
- Redux Toolkit
- Socket.IO client
- Axios
- Tailwind CSS
- React Router

### Backend

- Node.js
- Express.js
- MongoDB + Mongoose
- Socket.IO server
- Cloudinary SDK

---

## 🚀 Features

- ✅ Real-time messaging with WebSockets
- 🔐 JWT-based authentication
- 🧑‍🤝‍🧑 Create individual conversations
- 💬 Real-time text, image, messaging
- 📥 Cloudinary-based uploads with compression
- 📷 Real-time profile picture updates (Socket.IO)
- 💤 Lazy-loaded media with placeholder & preloading
- 🧠 Global user cache with Redux
- 💬 Message status indicators (sent, delivered, read)
- ⏱️ Delivered & read timestamps per message
- 🔁 Optimistic message rendering before upload completes
- 🧠 Lazy-loaded images with layout shift prevention

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/786mrnoor/chat-app.git
cd chat-app
```

### 2. Install Dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 3. Set Up Environment Variables

#### Backend (`server/.env`)

```
NODE_ENV=development | production
CLIENT_URL=your_frontend_client_url

MONGODB_URI=your_mongo_uri

JWT_SECRET_KEY=your_jwt_secret
JWT_RESET_SECRET_KEY=your_jwt_reset_secret_key

EMAIL_USER=your_gmail_id
EMAIL_PASS=your_gmail_app_password

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_PRESET_NAME=your_preset_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

---

### 4. Run the App

```bash
# Backend
cd server
npm run dev

# Frontend
cd ../client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

<!-- ## 📸 Screenshots

> Add screenshots or a demo video here

--- -->

## 🛠️ To-Do / Improvements

- [x] Group chats
- [ ] Video and file sharing
- [x] Typing indicators
- [ ] Infinite scroll for messages
- [ ] Dark mode
- [ ] Message reactions
- [ ] Retry failed uploads
- [ ] Upload progress per file
- [ ] Cancel upload
<!-- - [ ] Push notifications (web) -->

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙌 Contributions

Pull requests, suggestions, and issues are welcome!
