# Build a Modern Portfolio Website with React & TailwindCSS

<div align="center">
  <br />
  <a href="https://youtu.be/YOUR_VIDEO_ID" target="_blank">
    <img src="./banner.png" alt="Portfolio Website Banner">
  </a>
  <br />
  <div>
    <img src="https://img.shields.io/badge/-React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/-TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/-Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/-Lucide Icons-FD4D4D?style=for-the-badge&logo=lucide" alt="Lucide Icons" />
    <img src="https://img.shields.io/badge/-Radix UI-9D4EDD?style=for-the-badge&logo=data:image/svg+xml;base64..." alt="Radix UI" />
  </div>
  <h3 align="center">Create a Stunning Developer Portfolio with Animations, Dark Mode, and Projects Showcase</h3>
  <div align="center">
    Follow the full video tutorial on 
    <a href="https://youtu.be/YOUR_VIDEO_ID" target="_blank"><b>YouTube</b></a>
  </div>
  <br />
</div>

## 📋 Table of Contents

1. [Introduction](#-introduction)
2. [Tech Stack](#-tech-stack)
3. [Features](#-features)
4. [Quick Start](#-quick-start)
5. [Screenshots](#-screenshots)
6. [Deployment](#-deployment)

---

## 🚀 Introduction

In this tutorial, you'll learn how to build a modern portfolio website using **React**, **TailwindCSS**, **Vite**, and **Lucide Icons**. From dark mode support to responsive animations and deployable project showcases, this video walks you through every step—perfect for developers looking to level up their frontend skills or apply for jobs.

🎥 Watch the full tutorial: [YouTube](https://youtu.be/YOUR_VIDEO_ID)

---

## ⚙️ Tech Stack

- **React** – Component-based UI development
- **Vite** – Lightning-fast build tool
- **TailwindCSS** – Utility-first CSS for styling
- **Lucide Icons** – Clean and beautiful icon pack
- **Radix UI** – Accessible component primitives
- **TypeScript (optional)** – Type safety and tooling
- **GitHub & Vercel** – Deployment

---

## ⚡️ Features

- 🌑 **Light/Dark Mode Toggle**
  Save theme preference in local storage with beautiful transitions

- 💫 **Animated Backgrounds**
  Stars, meteors, scroll effects, and glowing UI elements

- 📱 **Responsive Navigation**
  Desktop and mobile menus with glassmorphism

- 👨‍💻 **Hero & About Sections**
  Showcase who you are with smooth intro animations and buttons

- 📊 **Skills Grid**
  Filterable progress bars and categories with animated width

- 🖼️ **Projects Showcase**
  Display screenshots, tech stacks, and GitHub/demo links

- 📩 **Contact Section**
  Social icons + responsive contact form with toast notifications

- 🚀 **One-Click Deployment**
  Easily host your site with Vercel and GitHub

---

## 👌 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/)
- [Git](https://git-scm.com/)

### Clone and Run

```bash
git clone https://github.com/yourusername/react-tailwind-portfolio.git
cd react-tailwind-portfolio
npm install
npm run dev
```

Your app will be available at: [http://localhost:5173](http://localhost:5173)

### Email Setup (Contact Form)

The contact form uses EmailJS to send emails directly from the browser. To enable email functionality:

1. **Sign up for EmailJS** (free account available)

   - Go to [https://www.emailjs.com/](https://www.emailjs.com/)
   - Create a free account

2. **Create an Email Service**

   - In the EmailJS dashboard, go to "Email Services"
   - Click "Add New Service"
   - Choose your email provider (Gmail recommended)
   - Follow the setup instructions to connect your email account
   - Note your **Service ID**

3. **Create an Email Template**

   - Go to "Email Templates" in the dashboard
   - Click "Create New Template"
   - Use the following template variables:
     - `{{from_name}}` - Sender's name
     - `{{from_email}}` - Sender's email
     - `{{message}}` - Message content
     - `{{to_email}}` - Your email
   - Set the "To Email" field to: `yourmail@gmail.com`
   - Set the "Subject" to something like: "New Contact Form Message from {{from_name}}"
   - Note your **Template ID**

4. **Get your Public Key**

   - Go to "Account" → "General"
   - Copy your **Public Key**

5. **Create Environment File**

   - Create a `.env` file in the root directory
   - Add the following variables:
     ```
     VITE_EMAILJS_SERVICE_ID=your_service_id
     VITE_EMAILJS_TEMPLATE_ID=your_template_id
     VITE_EMAILJS_PUBLIC_KEY=your_public_key
     ```
   - Replace the placeholder values with your actual IDs and key

6. **Restart your dev server**
   ```bash
   npm run dev
   ```

The contact form will now send emails to `yourmail@gmail.com` when submitted!

---

## 🖼️ Screenshots

> 📸 Add screenshots of your Hero section, Projects grid, and Contact form here to show off your site.

---

## ☁️ Deployment

### Deploy on Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Click **Deploy**

Your live website will be hosted on a custom subdomain (e.g. `https://your-name.vercel.app`)

---

## 🔗 Useful Links

- [React Documentation](https://reactjs.org/)
- [Tailwind CSS Docs](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- [Radix UI](https://www.radix-ui.com/)
- [Vite](https://vitejs.dev/)
- [Vercel](https://vercel.com/)

---

Let me know if you'd like me to generate a version with your actual GitHub repo, YouTube URL, or a banner image suggestion!
