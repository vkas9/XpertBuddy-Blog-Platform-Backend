
# XpertBuddy Blog Platform Backend

XpertBuddy is a blog platform backend designed to manage blog content, user authentication, and provide APIs for seamless frontend integration. This backend is built with **Node.js**, **Express**, and **MongoDB**, ensuring scalability and performance for a modern blog platform.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup and Installation](#setup-and-installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **User Authentication:** Supports user registration, login, and JWT-based authentication.
- **Blog Management:** Create, read, update, and delete (CRUD) operations for blog posts.
- **Pagination:** Efficient pagination for fetching blogs in batches.
- **Comments and Likes:** Enable user interaction through comments and likes.
- **Tag and Category Support:** Organize blogs using tags and categories.
- **Responsive API Design:** Built for seamless integration with frontend applications.

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ORM)
- **Authentication:** JSON Web Tokens (JWT)
- **Other Tools:** dotenv, bcrypt, cors, nodemailer

---

## Setup and Installation

### Prerequisites

1. Install [Node.js](https://nodejs.org/) (v14 or higher).
2. Install [MongoDB](https://www.mongodb.com/) and ensure it's running locally or use a cloud MongoDB instance.

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/vkas9/XpertBuddy-Blog-Platform-Backend.git
   cd XpertBuddy-Blog-Platform-Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and configure your environment variables (see [Environment Variables](#environment-variables)).

4. Start the server:
   ```bash
   npm start
   ```

5. The backend will run on `http://localhost:5000` (default port).

---

## Environment Variables

Configure the following variables in your `.env` file:

```env
PORT=5000
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
EMAIL_SERVICE=<your_email_service_provider>
EMAIL_USER=<your_email_service_username>
EMAIL_PASS=<your_email_service_password>
```

---

## API Endpoints

### User Authentication
- `POST /api/auth/signup` - Register a new user.
- `POST /api/auth/login` - Log in a user.

### Blog Management
- `GET /api/blog/allblog` - Get all blogs (supports pagination).
- `GET /api/blog/:id` - Get a single blog by ID.
- `POST /api/blog/addblog` - Create a new blog.
- `PUT /api/blog/updateblog` - Update a blog by ID.

### Interaction
- `POST /api/blog/like` - Like a blog post.
- `POST /api/blog/comments` - Add a comment to a blog post.

---

## Folder Structure

```
XpertBuddy-Blog-Platform-Backend/
├── controllers/      # Business logic for handling requests
├── models/           # Mongoose models for MongoDB collections
├── routes/           # API routes
├── middleware/       # Custom middleware (e.g., authentication)
├── utils/            # Utility functions
├── .env              # Environment configuration
├── app.js            # Express app initialization
├── server.js         # Entry point of the application
├── README.md         # Project documentation
```

---

## Contributing

Contributions are welcome! Follow these steps:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Make your changes and commit them:
   ```bash
   git commit -m "Add feature-name"
   ```
4. Push to your branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request on the original repository.

---

## License

This project is licensed under the [MIT License](LICENSE).

---
