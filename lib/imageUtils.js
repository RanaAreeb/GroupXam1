// Image utility functions for profile image handling

/**
 * Validates image file type and size
 * @param {File} file - The image file to validate
 * @param {Object} options - Validation options
 * @returns {Object} - Validation result with success/error
 */
export function validateImage(file, options = {}) {
    const {
        maxSize = 5 * 1024 * 1024, // 5MB default
        allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
        minWidth = 50,
        minHeight = 50,
        maxWidth = 2048,
        maxHeight = 2048
    } = options;

    // Check if file exists
    if (!file) {
        return { success: false, error: 'No file provided' };
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
        return {
            success: false,
            error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`
        };
    }

    // Check file size
    if (file.size > maxSize) {
        const maxSizeMB = (maxSize / 1024 / 1024).toFixed(1);
        return {
            success: false,
            error: `File size too large. Maximum size: ${maxSizeMB}MB`
        };
    }

    return { success: true };
}

/**
 * Compresses and resizes image for profile pictures
 * @param {File} file - The image file to process
 * @param {Object} options - Processing options
 * @returns {Promise<Blob>} - Processed image blob
 */
export async function processProfileImage(file, options = {}) {
    const {
        targetWidth = 300,
        targetHeight = 300,
        quality = 0.8,
        outputFormat = 'image/jpeg'
    } = options;

    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            // Calculate dimensions maintaining aspect ratio
            const { width, height } = calculateAspectRatio(
                img.width,
                img.height,
                targetWidth,
                targetHeight
            );

            canvas.width = width;
            canvas.height = height;

            // Enable image smoothing for better quality
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';

            // Draw and resize image
            ctx.drawImage(img, 0, 0, width, height);

            // Convert to blob
            canvas.toBlob(resolve, outputFormat, quality);
        };

        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = URL.createObjectURL(file);
    });
}

/**
 * Calculate aspect ratio preserving dimensions
 * @param {number} originalWidth - Original image width
 * @param {number} originalHeight - Original image height
 * @param {number} targetWidth - Target width
 * @param {number} targetHeight - Target height
 * @returns {Object} - New dimensions
 */
function calculateAspectRatio(originalWidth, originalHeight, targetWidth, targetHeight) {
    const aspectRatio = originalWidth / originalHeight;

    let width = targetWidth;
    let height = targetHeight;

    if (aspectRatio > 1) {
        // Landscape
        height = width / aspectRatio;
        if (height > targetHeight) {
            height = targetHeight;
            width = height * aspectRatio;
        }
    } else {
        // Portrait or square
        width = height * aspectRatio;
        if (width > targetWidth) {
            width = targetWidth;
            height = width / aspectRatio;
        }
    }

    return { width: Math.round(width), height: Math.round(height) };
}

/**
 * Generate a preview URL for an image file
 * @param {File} file - The image file
 * @returns {string} - Object URL for preview
 */
export function createImagePreview(file) {
    if (!file || !file.type.startsWith('image/')) {
        return null;
    }
    return URL.createObjectURL(file);
}

/**
 * Clean up object URL to prevent memory leaks
 * @param {string} url - Object URL to revoke
 */
export function revokeImagePreview(url) {
    if (url && url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
    }
}

/**
 * Get optimized image format based on browser support
 * @returns {string} - Preferred image format
 */
export function getOptimalImageFormat() {
    const canvas = document.createElement('canvas');

    // Check WebP support
    if (canvas.toDataURL('image/webp').indexOf('image/webp') === 5) {
        return 'image/webp';
    }

    // Fallback to JPEG
    return 'image/jpeg';
}

/**
 * Convert file to base64 string
 * @param {File} file - The file to convert
 * @returns {Promise<string>} - Base64 string
 */
export function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

/**
 * Estimate image compression ratio
 * @param {number} originalSize - Original file size in bytes
 * @param {number} quality - Compression quality (0-1)
 * @returns {number} - Estimated compressed size
 */
export function estimateCompressedSize(originalSize, quality = 0.8) {
    // Rough estimation based on JPEG compression
    const baseCompression = 0.1; // 10% of original
    const qualityFactor = quality * 0.9; // Quality impact
    return Math.round(originalSize * (baseCompression + qualityFactor * 0.4));
}
