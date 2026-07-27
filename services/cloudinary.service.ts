import axios from 'axios';

interface CloudinaryUploadResponse {
    secure_url: string;
    original_filename: string;
    [key: string]: any;
}

export async function uploadToCloudinary(file: File): Promise<{ secure_url: string; original_filename: string }> {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
        throw new Error('Cloudinary cloud name or upload preset is not configured in environment variables.');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    const response = await axios.post<CloudinaryUploadResponse>(
        `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    );

    return {
        secure_url: response.data.secure_url,
        original_filename: response.data.original_filename || file.name,
    };
}
