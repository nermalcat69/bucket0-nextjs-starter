# Next.js x Bucket0 Starter
<img width="1000" height="525" alt="image" src="https://github.com/user-attachments/assets/681bac55-9db0-4acf-9e52-f2672eed0b81" />

A minimal file upload starter using Next.js and Bucket0 for S3-compatible object storage.

## Setup

### 1. Create a Bucket0 account

Go to [bucket0.com](https://bucket0.com) and sign up. Once logged in, you will land on the dashboard.

### 2. Get your S3 API credentials
<img width="1295" height="597" alt="image" src="https://github.com/user-attachments/assets/b52423b9-0a6c-4478-b7be-ab71624ef998" />

Navigate to **S3 API** in the sidebar. You will find your `ACCESS_ID` and `SECRET_KEY` here. Copy both.

### 3. Create a bucket

Go to **Buckets** and create a new bucket. Copy the bucket name once created.

### 4. Configure environment variables

Create a `.env.local` file in the root of the project:

```
ACCESS_ID=your_access_id
SECRET_KEY=your_secret_key
BUCKET_NAME=your_bucket_name
```

### 5. Run the dev server

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Features

- Upload any file via drag and drop or file picker
- Image preview on cards, full preview page for images, PDFs, and JSON
- Download files directly from the browser
- Delete files from both the bucket and browser history
- Uploaded files persist in localStorage across page navigations
