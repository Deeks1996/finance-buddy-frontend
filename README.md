# Finance Buddy

**Finance Buddy** is a full-stack personal finance management application built to help users seamlessly track and analyze their income and expenses. With real-time analytics, intuitive UI, and secure user authentication, Finance Buddy offers a comprehensive experience for budgeting and financial planning.

---

## Project Overview

Finance Buddy empowers users to take charge of their financial life. Whether you're managing a personal budget or tracking multiple streams of income, the app provides:

-  Detailed tracking of income and expenses
-  Data-driven visualizations to monitor trends
-  Budgeting tools with alerts
-  Intelligent suggestions based on spending behavior

The frontend is hosted on **Vercel**, while the backend API is deployed via **Railway**. Authentication and user management are handled using **Clerk**, and financial data is securely stored in **MongoDB**.

---

## 🔐 Authentication & Security

- **Clerk Authentication**:
  - Email/password login
  - Session and JWT management
- **Route protection** on both frontend and backend
- **Environment-based config** for secure deployments

---

## 🧠 Intelligent Insights Engine (v1.0)

The app includes a basic insights module that:
- Categorizes transactions into spending types (Food, Travel, Bills, etc.)
- Flags unusual expenses
- Provides budget adherence scores

Planned future enhancements include:
- Machine learning–powered recommendations
- Goal-based saving plans
- Financial health score

---

## 📊 Real-Time Analytics

Utilizing chart libraries like **Chart.js** or **Recharts**, Finance Buddy provides:
- Expense vs Income over time
- Category-wise breakdowns
- Budget vs actual spend tracking

All analytics are reactive and auto-update with new entries.

---

## 🔄 Backend Highlights

- Built with **Node.js** and **Express.js**
- RESTful API design with protected routes
- MongoDB for schema-flexible transaction storage
- Integrated Clerk middleware to validate tokens
- Error handling, validation, and status reporting built in
---

## ⚙️ Deployment Architecture

| Component       | Platform   | Tech                      |
|----------------|------------|---------------------------|
| Frontend        | Vercel     | React + Tailwind CSS      |
| Backend API     | Railway    | Express + MongoDB         |
| Auth            | Clerk      | Clerk Hosted UI & SDK     |
| Database        | MongoDB    | Atlas (cloud hosted)      |

---

## 🌐 Live Application

- Frontend: https://finance-buddy-frontend.vercel.app/
- Backend: https://finance-buddy-backend-production-af41.up.railway.app/
---

## Author
Deeksha Shetty  
GitHub: 
  Frontend -> https://github.com/Deeks1996/finance-buddy-frontend
  Backend -> https://github.com/Deeks1996/finance-buddy-backend 
Email: shettydeeksha810@gmail.com

---
