# Cloudflare R2 Setup Guide for Profile Images

This guide will help you set up Cloudflare R2 for storing profile images in your groupXam application.

## Prerequisites

- Cloudflare account
- Access to Cloudflare dashboard

## Step 1: Create R2 Bucket

1. Log in to your Cloudflare dashboard
2. Navigate to **R2 Object Storage** in the sidebar
3. Click **Create bucket**
4. Name your bucket: `groupxam-profile-images`
5. Choose your preferred location
6. Click **Create bucket**

## Step 2: Configure Public Access

1. Go to your bucket settings
2. Navigate to **Settings** > **Public access**
3. Enable **Public access**
4. Note down your R2.dev subdomain URL (e.g., `https://pub-xyz123.r2.dev`)

## Step 3: Create API Token

1. Go to **Manage R2 API tokens**
2. Click **Create API token**
3. Configure the token:
   - **Token name**: `groupxam-profile-upload`
   - **Permissions**: `Object Read & Write`
   - **Bucket resources**: `Include - Specific bucket - groupxam-profile-images`
4. Click **Continue to summary** > **Create API token**
5. **Important**: Copy and save the Access Key ID and Secret Access Key

## Step 4: Add Environment Variables

Add these variables to your `.env.local` file:

```env
# Cloudflare R2 Configuration
CLOUDFLARE_R2_ENDPOINT=https://YOUR_ACCOUNT_ID.r2.cloudflarestorage.com
CLOUDFLARE_R2_ACCESS_KEY_ID=your_access_key_id_here
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_secret_access_key_here
CLOUDFLARE_R2_BUCKET_NAME=groupxam-profile-images
CLOUDFLARE_R2_PUBLIC_URL=https://pub-xyz123.r2.dev
```

### Finding Your Account ID

Your account ID can be found in:
- Cloudflare dashboard sidebar (right side)
- The R2 endpoint URL format: `https://ACCOUNT_ID.r2.cloudflarestorage.com`

## Step 5: (Optional) Custom Domain

For production, you may want to use a custom domain instead of the R2.dev subdomain:

1. Go to your bucket settings
2. Navigate to **Settings** > **Custom domains**
3. Click **Connect domain**
4. Enter your domain (e.g., `cdn.yourdomain.com`)
5. Follow the DNS configuration instructions
6. Update your `CLOUDFLARE_R2_PUBLIC_URL` environment variable

## Step 6: Test the Setup

1. Restart your Next.js development server
2. Log in to your profile
3. Try uploading a new profile picture
4. Check your R2 bucket to verify the image was uploaded

## Folder Structure

Profile images will be stored in the following structure:
```
groupxam-profile-images/
└── profile-images/
    ├── username1_1234567890.jpg
    ├── username2_1234567891.png
    └── ...
```

## Security Features

- **Automatic cleanup**: Old profile images are automatically deleted when new ones are uploaded
- **File validation**: Only image files under 5MB are accepted
- **Unique filenames**: Each image gets a timestamp to prevent conflicts
- **Secure uploads**: All uploads require authentication

## Troubleshooting

### Error: "Missing Cloudflare R2 configuration"
- Check that all environment variables are properly set
- Restart your development server after adding environment variables

### Error: "Failed to upload image to storage"
- Verify your API token has the correct permissions
- Check that your bucket name matches the environment variable
- Ensure your account ID in the endpoint URL is correct

### Images not loading
- Verify the public access is enabled for your bucket
- Check that the public URL in your environment variable is correct
- Ensure your custom domain (if used) is properly configured

## Cost Considerations

Cloudflare R2 pricing (as of 2024):
- **Storage**: $0.015 per GB per month
- **Class A operations** (uploads): $4.50 per million requests
- **Class B operations** (downloads): $0.36 per million requests
- **Data transfer**: Free for the first 10GB per month

For a typical application with profile images, costs should be minimal.
