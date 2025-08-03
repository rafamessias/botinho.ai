# Cloudinary Upload Action

This action provides functionality to upload files to Cloudinary, create records in the Prisma File table, and update referenced table records.

## Setup

1. **Environment Variables**: Add the following to your `.env` file:
   ```
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

2. **Installation**: The required packages are already installed:
   - `cloudinary` - For Cloudinary SDK
   - `next-cloudinary` - For Next.js Cloudinary integration

## Usage

### Single File Upload

```typescript
import { uploadFileToCloudinary } from './components/actions/cloudinary-upload-action';

// Example: Upload user avatar
const result = await uploadFileToCloudinary({
  file: fileInput.files[0], // File object from input
  tableName: 'User',
  recordId: 123,
  fieldName: 'avatarId',
  folder: 'avatars' // Optional: Cloudinary folder
});

if (result.success) {
  console.log('File uploaded successfully:', result.data);
} else {
  console.error('Upload failed:', result.error);
}
```

### Multiple Files Upload

```typescript
import { uploadMultipleFilesToCloudinary } from './components/actions/cloudinary-upload-action';

// Example: Upload multiple media files for RDO
const results = await uploadMultipleFilesToCloudinary(
  files, // Array of File objects
  'RDO',
  456,
  'media',
  'rdo-media' // Optional: Cloudinary folder
);

// Check results
results.forEach((result, index) => {
  if (result.success) {
    console.log(`File ${index + 1} uploaded:`, result.data);
  } else {
    console.error(`File ${index + 1} failed:`, result.error);
  }
});
```

### Delete File

```typescript
import { deleteFileFromCloudinary } from './components/actions/cloudinary-upload-action';

const result = await deleteFileFromCloudinary(fileId);
if (result.success) {
  console.log('File deleted successfully');
} else {
  console.error('Delete failed:', result.error);
}
```

## Supported Tables and Fields

| Table | Field | Description |
|-------|-------|-------------|
| User | avatarId | User profile picture |
| Company | logoId | Company logo |
| Company | coverImageId | Company cover image |
| Project | imageId | Project image |
| RDO | media | RDO media files (many-to-many) |
| Incident | media | Incident media files (many-to-many) |

## File Types Supported

The action supports the following file formats:
- Images: jpg, jpeg, png, gif
- Documents: pdf, doc, docx, xls, xlsx
- Videos: mp4, mov, avi

## Features

- **Automatic Optimization**: Files are automatically optimized for quality and format
- **Folder Organization**: Files are organized in Cloudinary folders
- **Database Integration**: Automatically creates File records in Prisma
- **Relationship Management**: Updates the referenced table to link to the File record
- **Cache Invalidation**: Automatically revalidates relevant cache tags
- **Authentication**: Checks for valid authentication tokens
- **Error Handling**: Comprehensive error handling and logging

## Example Component Usage

```typescript
'use client';

import { uploadFileToCloudinary } from './components/actions/cloudinary-upload-action';

export function AvatarUpload({ userId }: { userId: number }) {
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const result = await uploadFileToCloudinary({
      file,
      tableName: 'User',
      recordId: userId,
      fieldName: 'avatarId',
      folder: 'avatars'
    });

    if (result.success) {
      // Handle success (e.g., show success message, refresh data)
      console.log('Avatar uploaded:', result.data);
    } else {
      // Handle error (e.g., show error message)
      console.error('Upload failed:', result.error);
    }
  };

  return (
    <input
      type="file"
      accept="image/*"
      onChange={handleFileUpload}
    />
  );
}
```

## Notes

- The action uses server-side authentication checks
- Files are automatically optimized by Cloudinary
- The File table stores the Cloudinary URL, not the file itself
- Cache tags are automatically revalidated for better performance
- Error messages are user-friendly and logged for debugging 