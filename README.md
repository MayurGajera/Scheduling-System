# Scheduling-System

A simple scheduling and booking system built with React (frontend) and Node.js/Express (backend). Users can register, log in, create available slots, and share booking links for public slot reservations.

---

## 1. Cloning the Repository

```bash
git clone https://github.com/MayurGajera/Scheduling-System.git
cd Scheduling-System
```

---

## 2. Create Configuration Files (`.env`)

### Backend (`server/.env`)
- Copy `.env.example` to `.env` in the `server` folder.
- Edit the `.env` file with your MySQL credentials and other settings.

```bash
cd server
cp .env.example .env
# Edit .env as needed
```

### Frontend (`front/.env`)
- Copy `.env.example` to `.env` in the `front` folder.
- Edit the `.env` file if you need to change the API base URL.

```bash
cd ../front
cp .env.example .env
# Edit .env as needed
```

---

## 3. Running the Application

### Backend

```bash
cd server
npm install
npx sequelize-cli db:migrate   # Run database migrations
npm run dev                    # Starts backend on http://localhost:5000
```

### Frontend

Open a new terminal window/tab:

```bash
cd front
npm install
npm run dev                    # Starts frontend on http://localhost:5173
```

---

## 4. Folder Structure

```
Scheduling-System/
│
├── front/                      # React frontend
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   └── ...
│   ├── index.html
│   ├── package.json
│   └── .env
│
├── server/                     # Node.js/Express backend
│   ├── config/
│   ├── migrations/
│   ├── models/
│   ├── routes/
│   ├── app.js
│   ├── index.js
│   ├── package.json
│   └── .env
│
├── README.md
└── .gitignore
```

---

## 5. Packages Used

### Frontend (`front/package.json`)
- **react**
- **react-dom**
- **react-router-dom**
- **react-bootstrap**
- **bootstrap**
- **react-datepicker**
- **formik**
- **yup**
- **axios**
- **date-fns**
- **dotenv**
- **eslint** and plugins

### Backend (`server/package.json`)
- **express**
- **sequelize**
- **mysql2**
- **bcrypt**
- **uuid**
- **dotenv**
- **cors**

---

## License

MIT
