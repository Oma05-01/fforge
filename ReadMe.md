# BlogPost API Documentation

A robust, modular RESTful API built to handle user authentication, database management, and cloud-based image uploads. 

## 🛠 Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB & Mongoose
* **File Uploads:** Multer (Local middleware) & Cloudinary (Cloud storage)
* **Authentication:** JSON Web Tokens (JWT) & bcryptjs

---

## ⚙️ Local Setup & Installation

**1. Clone the repository and install dependencies:**
```bash
`npm install`
```

**2. Configure Environment Variables:**
Create a .env file in the root directory and add the following keys:


Code snippet
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/blog_posts_db?retryWrites=true&w=majority


# Cloudinary Credentials
* CLOUDINARY_CLOUD_NAME=your_cloud_name
* CLOUDINARY_API_KEY=your_api_key
* CLOUDINARY_API_SECRET=your_api_secret

# JWT Secret for Authentication
JWT_SECRET=your_super_secret_jwt_key


3. Run the development server:

**Bash**
`npm run dev`


## 📡 API Endpoints
** Authentication (/api/auth)**

* Method | Endpoint | Description | Access
* POST-> | /register | Register a new user | Public
* POST-> | /login | Authenticate user and obtain a JWT token | Public

**Posts (/api/posts)**
* Method | Endpoint | Description | Access
* GET | / | Fetch all posts (populates author data) | Public
* GET | /:id | Retrieve a single post by ID | Public
* GET | /my-posts | Retrieve posts belonging to the logged-in user | Protected
* POST | / | Create a new post with an image upload | Protected
* PUT | /:id | Update an existing post | Protected
* PATCH | /:id/publish | Toggle the publish/draft status of a post | Protected
* DELETE | /:id | Delete a post and remove its image from Cloudinary | Protected


## 📝 Important Usage Notes

**1. Protected Routes**
Any route marked as Protected requires a valid JWT token.

 * Pass the token in the headers of your request.

 * Key: Authorization

 * Value: Bearer <your_token_here>

**2. Creating a Post (Image Uploads)**
The POST /api/posts endpoint handles physical file uploads. You cannot send standard JSON to this route.


When testing in Postman, Thunder Client, or making frontend fetch / axios requests, you must use multipart/form-data.

**Required Form Data Fields:**

 * title (Text)

 * body (Text)

 * image (File) - Must be a .jpg, .jpeg, or .png

**3. Deleting Posts**
When a DELETE request is successfully made to /api/posts/:id, the API will automatically extract the public_id from the post's Cloudinary URL and permanently delete the image from the cloud storage to prevent memory leaks.
