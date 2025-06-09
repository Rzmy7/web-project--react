---

# UoM Facility App

A React + Flask app for campus facility status and pre-orders.

## Quick Start

### Prerequisites

- Node.js (v14+)
- Python (v3.8+)
- Flask (v2.0+)
- React (v17+)

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/Rzmy7/web-project--react.git
   cd web-project--react
   ```

2. **Set Up Environment Variables**

   Go to Backend:
   
   ```bash
   cd backend
   touch .env
   nano .env
   ```
   
   Create a `.env` file in the root directory:

   ```plaintext
   DB_NAME=react_test
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_HOST=your_host_url
   DB_PORT=5432

   MAIL_SERVER=smtp.example.com
   MAIL_PORT=587
   MAIL_USE_TLS=True
   MAIL_USERNAME=example
   MAIL_PASSWORD=******
   MAIL_DEFAULT_SENDER=example@gmail.com
   ```

4. **Install Dependencies**

   ```bash
   npm install
   ```

5. **Start the Application**

   ```bash
   npm run install-all
   npm start
   ```




---

This version is more concise while still providing essential information.
