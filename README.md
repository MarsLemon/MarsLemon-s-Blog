# MarsLemon's Blog

This is a modern blog platform built with Next.js, designed for sharing technical articles and development experiences.

## Features

-   **Modern Tech Stack**: Built with Next.js, React, TypeScript, and Tailwind CSS for optimal performance and user experience.
-   **Responsive Design**: Adapts perfectly to various devices, from desktops to mobile phones.
-   **SEO Optimization**: Optimized for search engines to make your content more discoverable.
-   **Secure and Reliable**: Adopts modern security practices to protect user data and privacy.
-   **Admin Dashboard**: A powerful backend for managing posts, users, and site settings.
-   **User Authentication**: Secure user registration, login, and profile management.
-   **File Uploads**: Integrated with Vercel Blob for efficient image and file storage.
-   **Post Analytics**: Track post views and user engagement.

## Getting Started

### 1. Clone the repository

\`\`\`bash
git clone https://github.com/your-username/MarsLemon-s-Blog.git
cd MarsLemon-s-Blog
\`\`\`

### 2. Install dependencies

\`\`\`bash
npm install
# or
yarn install
\`\`\`

### 3. Set up environment variables

Create a `.env.local` file in the root directory and add your environment variables. You will need:

-   `DATABASE_URL`: Your PostgreSQL connection string (e.g., from Neon or Supabase).
-   `BLOB_READ_WRITE_TOKEN`: Your Vercel Blob API token.
-   `JWT_SECRET`: A strong secret key for JWT authentication.
-   `NEXT_PUBLIC_BASE_URL`: The public URL of your deployment (e.g., `http://localhost:3000` or your Vercel URL).

Example `.env.local`:

\`\`\`
DATABASE_URL="postgresql://user:password@host:port/database"
BLOB_READ_WRITE_TOKEN="your_vercel_blob_token"
JWT_SECRET="your_jwt_secret_key"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
\`\`\`

### 4. Initialize the database

Run the database migration scripts to create tables and seed initial data.

\`\`\`bash
npm run db:migrate
# or
yarn db:migrate
\`\`\`

This will run the SQL scripts in the `scripts/` directory.

### 5. Run the development server

\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 6. Access Admin Panel

After running the `db:migrate` script, an admin user will be initialized with:
-   **Username**: `Mars`
-   **Email**: `mars@example.com`
-   **Password**: `Mars9807130015`

You can access the admin login page at [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

## Deployment

This project can be easily deployed to Vercel. Ensure your environment variables are configured in your Vercel project settings.

## Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests.

## License

[MIT License](LICENSE)
\`\`\`
