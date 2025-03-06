TaskSphere

TaskSphere is a task management web application where users can register as individuals or through an organization. Users can create organizations, assign tasks within them, and track progress seamlessly.

🚀 Features

User Registration: Sign up as an individual or via an organization.

Organization Management: Create and manage multiple organizations.

Task Assignment: Assign tasks to users within an organization.

Task Tracking: Users can view tasks assigned to them along with the assigning organization.

Collaborative Workflow: Streamline task management within organizations.

🛠 Tech Stack

Frontend: Next.js, TypeScript, Tailwind CSS

Backend: Node.js, Express.js

Database: PostgreSQL (with Prisma ORM)

Authentication: JWT-based authentication

📦 Installation

Clone the repository:

git clone https://github.com/PITIFULHAWK/symmetrical-memory
cd TaskSphere

Prerequisites
- Node.js (v14 or higher recommended)
- bun

Install Dependencies
```bash
   # Install frontend dependencies
   cd frontend
   bun install
   
   # Install backend dependencies
   cd ../backend
   bun install
   ```

Set up environment variables:

DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret

Start the development servers:
 ```bash
   # Start backend server
   cd backend
   bun run index.ts
   
   # In a new terminal, start frontend server
   cd frontend
   bun run dev
   ```


🏗️ Roadmap

✅ Basic user authentication (Signup/Login)

✅ Organization creation and management

✅ Task assignment within organizations

✅ Users can view tasks assigned to them

🔄 Role-based access control (Admins, Managers, Employees)

🔄 Task prioritization & deadlines

🔄 Notifications & Reminders

🔄 API for external integrations

🔄 Mobile-friendly UI improvements

🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

📜 License

This project is licensed under the MIT License.

