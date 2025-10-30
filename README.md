# 📚 BookIt: Experiences & Slots

## Project Overview

BookIt is a complete, full-stack web application developed to demonstrate end-to-end proficiency in modern booking workflows. Users can explore a curated catalogue of experiences, select specific date/time slots, and complete a secure transaction.

The application adheres strictly to the provided design specifications (high-fidelity UI/UX) and utilizes robust server-side validation to prevent issues like double-booking.

**Core Functional Flow:** Browsing $\rightarrow$ Details & Slot Selection $\rightarrow$ Checkout (User Info & Promo) $\rightarrow$ Confirmation/Result.

***

## 💻 Tech Stack & Architecture

This project is built using a modern **MERN stack** (MongoDB, Express, React, Node.js) architecture with a utility-first styling methodology.

| Component | Technology | Role |
| :--- | :--- | :--- |
| **Frontend** | **React (with TypeScript)** | UI framework for building component-based, type-safe interfaces. |
| **Styling** | **Tailwind CSS** | Used exclusively for responsive, high-fidelity styling (mandatory requirement). |
| **Backend API** | **Node.js (with Express & TypeScript)** | RESTful API server handling business logic, validation, and database interaction. |
| **Database** | **MongoDB (via Mongoose)** | NoSQL database for flexible storage of Experience, Slot, and Booking data. |
| **Tooling** | **Vite** | Frontend build tool for fast development and bundling. |

***

## ⚙️ Setup and Installation

Follow these steps to get the project running locally. It is structured into two separate services: `bookit-backend` (API) and `bookit-frontend` (React App).

### Prerequisites
* Node.js (v18+ recommended)
* MongoDB Instance (Local or MongoDB Atlas)

### Step 1: Backend Setup (`bookit-backend`)

1.  **Navigate to the backend directory:**
    ```bash
    cd bookit-backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create Environment File:** Create a file named **`.env`** in the `bookit-backend` root and populate it:
    ```env
    # .env (bookit-backend)
    PORT=5000
    MONGO_URI=mongodb+srv://<YOUR_USERNAME>:<YOUR_PASSWORD>@<YOUR_CLUSTER_URL>/bookit_db?retryWrites=true&w=majority
    ```

4.  **Seed the Database:** This step clears the database and populates it with initial mock experiences and available slots.
    ```bash
    npm run seed
    ```

5.  **Start the API Server:**
    ```bash
    npm run dev
    ```
    The API will start on `http://localhost:5000`.

### Step 2: Frontend Setup (`bookit-frontend`)

1.  **Navigate to the frontend directory:**
    ```bash
    cd ../bookit-frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure API URL:** Create a file named **`.env.local`** in the `bookit-frontend` root to point to your local API:
    ```env
    # .env.local (bookit-frontend)
    VITE_API_BASE_URL=http://localhost:5000/api 
    ```

4.  **Start the React App:**
    ```bash
    npm run dev
    ```
    The application will open in your browser, ready to fetch data from your running backend.

***

## 🗺️ API Documentation

The backend exposes a fully RESTful API for handling booking logic and data access.

| Method | Endpoint | Description | Key Logic |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/experiences` | Retrieves the list of all available experiences. | Supports optional search query filtering by `title`, `description`, and `location`. |
| **GET** | `/api/experiences/:id` | Fetches full details for a single experience, including all date and time slot availability. | None. |
| **POST**| `/api/promo/validate` | Checks a promo code against the current price. | Returns `{ isValid, discountAmount, finalPrice }`. |
| **POST**| `/api/bookings` | **Finalizes a booking.** | **Crucial Server-Side Validation:** Checks required fields, validates email format, verifies quantity against available `slot.capacity - slot.bookedCount`, and updates the slot count atomically. |

***

## 🌟 Live Submission & Repository

**[MANDATORY STEP: Update these links upon final deployment]**

* **Hosted Application Link:** `[INSERT LIVE VERCEL/NETLIFY LINK HERE]`
* **GitHub Repository:** `[INSERT GITHUB REPO LINK HERE]`
