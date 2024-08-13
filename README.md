## BagElegance 

Welcome to **BagElegance**, an elegant online bag store built to provide a seamless shopping experience. This full-stack web application is designed with user-friendly features that make browsing, selecting, and purchasing bags easy and enjoyable.

## Features

- **User Accounts & Email Verification**
  - Create an account and verify it through an email link.
  - Secure login using email and password.

- **Seamless Shopping Experience**
  - Browse a variety of bags with detailed product information, including price, discounts, availability, and images.

- **Dynamic Cart Functionality**
  - Add items to your cart, adjust quantities, and see real-time price breakdowns.

- **Admin Panel**
  - Manage inventory with ease: create, edit, and delete products as needed.

## Tech Stack

- **Frontend**: EJS (Embedded JavaScript), HTML, CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: Passport.js
- **Email Verification**: Nodemailer
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- **Node.js**: Ensure you have Node.js installed.
- **MongoDB**: Set up MongoDB locally or use a cloud database service like MongoDB Atlas.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/BagElegance.git
2. Navigate to the project directory:
   ```bash
   cd BagElegance
3. Install dependencies:
   ```bash
   npm install
4. Set up environment variables by creating a .env file:
   ```bash
   PORT=3000
   MONGODB_URI=your_mongodb_uri
   SESSION_SECRET=your_secret_key
   EMAIL_USER=your_email@example.com
   EMAIL_PASS=your_email_password
5. Start the app.
   ```bash
   nodemon app.js

## Running the Project
Access the application at http://localhost:3000 after starting the server.

## Live Demo
Check out the live version of the project: https://bag-elegance.vercel.app/

## Contributing
Contributions are welcome! If you’d like to improve this project, feel free to submit a pull request.

## Feedback
If you have any feedback, feel free to reach out by opening an issue or dropping a comment. Your suggestions are always appreciated!
