Role-Based Task Manager
A simple web application where people can create and manage their tasks. It has two types of accounts: User and Admin. Each person logs in with an email and password and sees the dashboard meant for their role.
This project was built as a Java development internship assignment.
What the application does
User
Register with a name, email, and password.
Log in and log out.
Create a task with a title, description, status, priority, and due date.
See their own tasks.
Edit or delete their own tasks.
Other users cannot view or change their tasks.
Admin
Log in through the same login page as a normal user.
See an Admin Dashboard.
View all tasks and registered users.
Create tasks and assign them to users.
Update, reassign, or delete tasks.
Change a user's role between User and Admin.
Search tasks by title and filter by status or priority.
The available task statuses are To Do, In Progress, and Done. Priorities are Low, Medium, and High.
Tools used
Part	Technology	What it does
Frontend	React, JavaScript, HTML/CSS (through React components)	Shows pages, forms, buttons, and dashboards
Backend	Java 21, Spring Boot	Handles login, tasks, users, and permissions
Database	PostgreSQL	Saves users and tasks
Login security	Spring Security, JWT, BCrypt	Checks users and protects passwords and private actions
Development	VS Code, Maven, npm	Helps run and build the project
Note: This application uses Java Spring Boot,React is used to build the web pages.
How the application works
The person opens the React website and enters their email and password.
React sends the login details to Spring Boot.
Spring Boot checks the account and password saved in PostgreSQL.
If the details are correct, the backend returns a login token and the account's role.
A User goes to the User Dashboard; an Admin goes to the Admin Dashboard.
When someone creates or edits a task, the frontend sends the request to the backend.
The backend checks permission and saves the change in PostgreSQL.
The dashboard then shows the updated tasks.
Users cannot gain admin access just by changing a page URL. The backend checks permissions too.
What you need before starting
Java 21
PostgreSQL, running on port `5432`
Node.js and npm
VS Code or another code editor
Database setup
Open PostgreSQL / pgAdmin.
Create a database named `role_based_task`.
Make sure you know the password for your PostgreSQL account.
Create a private file named `.env` inside the backend folder.
Add the following settings, replacing the sample values with your own:
```dotenv
DB_USER=postgres
DB_PASSWORD=YOUR_POSTGRESQL_PASSWORD
JWT_SECRET=YOUR_BASE64_ENCODED_32_BYTE_OR_LONGER_SECRET
JWT_EXPIRATION_MS=3600000

ADMIN_NAME=System Admin
ADMIN_EMAIL=YOUR_ADMIN_EMAIL
ADMIN_PASSWORD=YOUR_STRONG_ADMIN_PASSWORD
```
Use a secure, randomly generated JWT secret in the format expected by the backend. The initial admin password must be at least 12 characters if the current admin setup validation is enabled.
Never upload `.env` to GitHub. Add `.env` and `**/.env` to `.gitignore`. Do not put real passwords in this README or screenshots.
The backend's `application.properties` reads the local `.env` file and connects to PostgreSQL. The database password in `.env` must match the actual PostgreSQL password. Editing `.env` does not change the password inside PostgreSQL.
With the current local setup, Spring Boot can create or update its tables when it starts (`spring.jpa.hibernate.ddl-auto=update`). This setting is intended for local development.
How the first admin account is created
The file `AdminSeeder.java` reads `ADMIN_NAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` from `.env` when the backend starts.
If that email does not exist in the database, the application creates an account with the `ADMIN` role.
The password is stored as a secure BCrypt hash, not as plain text.
If the email already exists, the seeder skips creating another account. It does not automatically change an existing account into an admin.
The admin signs in on the same login page used by regular users. After a successful login, the admin opens `/admin/dashboard`.
To check the database account without showing passwords, run this in pgAdmin:
```sql
SELECT id, name, email, role FROM users;
```
Run the project locally
Open two terminals. Run the backend and frontend separately.
Terminal 1 — Backend (from the `backend` folder):
```powershell
.\mvnw.cmd spring-boot:run
```
The backend should run at `http://localhost:8080`.
Terminal 2 — Frontend (from the `frontend` folder):
```powershell
npm install
npm run dev
```
The frontend usually runs at `http://localhost:5173`.
Open `http://localhost:5173/login` and log in. To stop either server, press `Ctrl + C` in its terminal.
If running commands from outside those folders, change into the appropriate folder first. This matters because the backend looks for `.env` in its working folder.
How the code is organised
The project keeps different responsibilities in different places:
Controller: Receives requests, such as “create task” or “show users.”
Service: Decides what should happen and checks application rules.
Repository: Finds, saves, and deletes records in the database.
Entity: Describes the information saved in the database.
DTO: Describes information sent between the website and backend.
Security: Checks login tokens and access rights.
The React frontend has separate pages for screens, services for backend requests, and routes for navigation. This makes the project easier to understand and change.
Basic API paths
Action	Method and address	Who can use it
Register	`POST /auth/register`	Public
Login	`POST /auth/login`	Public
View own tasks	`GET /tasks`	Logged-in user
Create own task	`POST /tasks`	Logged-in user
Edit own task	`PUT /tasks/{id}`	Task owner
Delete own task	`DELETE /tasks/{id}`	Task owner
View all tasks	`GET /admin/tasks`	Admin
Create or assign task	`POST /admin/tasks`	Admin
Edit or reassign task	`PUT /admin/tasks/{id}`	Admin
Delete any task	`DELETE /admin/tasks/{id}`	Admin
View users	`GET /admin/users`	Admin
Change user role	`PATCH /admin/users/{id}/role`	Admin
Protected requests must include the login token. User task checks are done in the backend, not only through hidden buttons in React.
Testing the application
A quick manual test:
Register and log in as User A.
Create, edit, and delete a task.
Register and log in as User B. Confirm User B cannot see User A's tasks.
Log in as Admin. Check that users and tasks are listed.
As Admin, assign a task to a user, edit it, and test the title/status/priority filters.
Check that a normal user cannot access the admin APIs.
Try a wrong email or password. The login page should show a helpful error instead of a technical JSON error.
The steps above are a testing checklist, not a claim that all tests have already passed. Record the actual results after running them.
Key decisions
Used one login page for both Users and Admins to keep the system simple.
Used PostgreSQL so data remains saved after the application closes.
Used JWT login tokens to protect requests.
Used BCrypt so passwords are not stored as plain text.
Used separate controllers, services, and repositories so the code is easier to maintain.
Added title search and status/priority filters to the Admin Dashboard. These filters work on the tasks already loaded in React; they do not yet perform database-side filtering.
Current scope and improvements
This version focuses on registration, login, task management, role permissions, and basic admin management. Possible future improvements include task pagination, stronger automated tests, better form messages, safer controls for the final remaining admin account, and deployment.
AI assistance disclosure
AI tools were used during development to explain Java and React concepts, suggest code structure, help investigate errors, and assist with documentation. The project code and behaviour should be reviewed and tested by the developer before submission.
Important security note
Passwords, JWT secrets, and any other private credentials belong in the local `.env` file or a secure deployment secret store. Do not commit them, paste them into your README, or share them in screenshots.