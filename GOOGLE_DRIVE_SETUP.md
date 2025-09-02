# 📸 Google Drive Profile Picture Setup

## 🚀 Benefits of Google Drive Integration

- ✅ **15GB Free Storage** - Google Drive provides generous free storage
- ✅ **Global CDN** - Fast image delivery worldwide
- ✅ **Automatic Optimization** - Google optimizes images for web
- ✅ **Secure Storage** - Enterprise-grade security
- ✅ **Easy Management** - Organize in folders

## 📋 Setup Instructions

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Note down your **Project ID**

### Step 2: Enable Google Drive API

1. In Google Cloud Console, go to **APIs & Services** > **Library**
2. Search for "Google Drive API"
3. Click **Enable**

### Step 3: Create Service Account

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **Service Account**
3. Fill in service account details:
   - **Name**: `groupxam-profile-images`
   - **Description**: `Service account for profile image uploads`
4. Click **Create and Continue**
5. Skip roles for now, click **Done**

### Step 4: Generate Service Account Key

1. Click on the created service account
2. Go to **Keys** tab
3. Click **Add Key** > **Create New Key**
4. Choose **JSON** format
5. Download the JSON file (keep it secure!)

### Step 5: Create Google Drive Folder

1. Go to [Google Drive](https://drive.google.com)
2. Create a new folder called `GroupXam Profile Pictures`
3. Right-click the folder > **Share**
4. Add your service account email (from the JSON file) with **Editor** access
5. Copy the **Folder ID** from the URL (the part after `/folders/`)

### Step 6: Environment Variables

Add these to your `.env.local` file:

```bash
# Google Drive Configuration
GOOGLE_DRIVE_FOLDER_ID=your_folder_id_here
GOOGLE_SERVICE_ACCOUNT_KEY=base64_encoded_service_account_json

# To generate the base64 key:
# On Linux/Mac: base64 -i path/to/service-account-key.json
# On Windows: certutil -encode path/to/service-account-key.json temp.txt && type temp.txt
```

### Step 7: Install Dependencies

```bash
npm install googleapis
```

### Step 8: Update Upload Function

The upload function in `/api/profile/upload-image/route.js` is ready to use! Just uncomment the Google Drive integration code and update your environment variables.

## 🔧 Alternative: Simple Implementation

If you prefer a simpler setup without Google Drive, the current implementation stores images as base64 in MongoDB, which works perfectly for smaller images and development.

## 🚀 Production Recommendations

### For Production Use:
1. **Google Drive** - Best for small to medium scale
2. **AWS S3** - Best for large scale applications
3. **Cloudinary** - Best for image optimization and transformations
4. **Firebase Storage** - Good integration with Google services

### Image Optimization Tips:
- Resize images to max 400x400px for profile pictures
- Compress images to reduce file size
- Use WebP format when supported
- Implement lazy loading for better performance

## 📚 Code Example

Here's how the Google Drive integration works:

```javascript
// Upload to Google Drive
const { google } = require('googleapis');

async function uploadToGoogleDrive(buffer, fileName, mimeType) {
  const serviceAccountKey = JSON.parse(
    Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_KEY, 'base64').toString('utf-8')
  );
  
  const auth = new google.auth.JWT(
    serviceAccountKey.client_email,
    null,
    serviceAccountKey.private_key,
    ['https://www.googleapis.com/auth/drive.file']
  );
  
  const drive = google.drive({ version: 'v3', auth });
  
  // Upload file
  const response = await drive.files.create({
    requestBody: {
      name: `profile_${Date.now()}_${fileName}`,
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
    },
    media: {
      mimeType: mimeType,
      body: buffer,
    },
  });
  
  // Make publicly viewable
  await drive.permissions.create({
    fileId: response.data.id,
    requestBody: {
      role: 'reader',
      type: 'anyone',
    },
  });
  
  return `https://drive.google.com/uc?id=${response.data.id}`;
}
```

## 🎯 Next Steps

1. Follow the setup instructions above
2. Test the profile picture upload functionality
3. Consider implementing image compression
4. Add image gallery for user's uploaded images
5. Implement image deletion functionality

Happy coding! 🚀

