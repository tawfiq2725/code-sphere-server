# Code Sphere

This repository contains the **Code Sphere** platform, which facilitates online learning with roles for **Students**, **Teachers**, and **Admins**.

---

## Frontend: Next.js Application

### Features:
- User-friendly interface for students, teachers, and admins.
- Integration with APIs for user authentication, course management, and chat features.
- Responsive design for seamless experience across devices.

### Installation:
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd code-sphere-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:3000` in your browser.

### Folder Structure:
```
/my-nextjs-project
│
├── /public
│   └── (static files like images, icons, etc.)
│
├── /src
│   ├── /app                  # Pages and frontend components
│   │   ├── /components       # Reusable components
│   │   ├── /hooks            # Custom React hooks
│   │   ├── /pages            # Pages and route-specific components
│   │   └── /styles           # Global styles (CSS, SCSS, etc.)
│   │
│   │
├── /node_modules             # Node modules
│
├── /package.json
└── /tsconfig.json            # If using TypeScript
```

### Deployment:
1. Build the production version:
   ```bash
   npm run build
   ```
2. Start the production server:
   ```bash
   npm start
   ```

---

## Backend: Node.js + Express.js Application

### Features:
- RESTful API for handling authentication, course management, and messaging.
- Secure with middleware for validation and authentication.
- Scalable architecture following clean code principles.

### Installation:
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd code-sphere-backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. The API will be available at `http://localhost:5000` (or the port specified in `.env`).

### Folder Structure:
```
/src
├── /controllers        # Request handlers for API routes
├── /models             # Database models
├── /routes             # Route definitions
├── /middlewares        # Middleware for validation/authentication
├── /utils              # Utility functions
└── /config             # Configuration files (e.g., environment variables)

.env                    # Environment variables
package.json            # Dependencies and scripts
```

### Deployment:
1. Build the production version:
   ```bash
   npm run build
   ```
2. Start the production server:
   ```bash
   npm start
   ```

---

For further details, refer to the individual README files in each folder.

