// Image utility functions for profile image handling

/**
 * Validates image file type and size with strict profile image standards
 * @param {File} file - The image file to validate
 * @param {Object} options - Validation options
 * @returns {Object} - Validation result with success/error
 */
export function validateImage(file, options = {}) {
    const {
        maxSize = 500 * 1024, // 500KB for consistent profile images
        allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'],
        minWidth = 200,
        minHeight = 200,
        maxWidth = 800,
        maxHeight = 800,
        enforceSquare = true // Force square aspect ratio for profile images
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
 * Compresses and resizes image for profile pictures with strict standardization
 * @param {File} file - The image file to process
 * @param {Object} options - Processing options
 * @returns {Promise<Blob>} - Processed image blob
 */
export async function processProfileImage(file, options = {}) {
    const {
        targetWidth = 400, // Standard size for all profile images
        targetHeight = 400, // Must be square
        quality = 0.85, // High quality but optimized
        outputFormat = 'image/jpeg', // Consistent format
        maxFileSize = 150 * 1024 // Max 150KB output
    } = options;

    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            // Force square dimensions for profile images
            canvas.width = targetWidth;
            canvas.height = targetHeight;

            // Enable image smoothing for better quality
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';

            // Calculate crop dimensions for square aspect ratio
            const { sourceX, sourceY, sourceWidth, sourceHeight } = calculateSquareCrop(
                img.width,
                img.height
            );

            // Draw and resize image with square crop
            ctx.drawImage(
                img,
                sourceX, sourceY, sourceWidth, sourceHeight,
                0, 0, targetWidth, targetHeight
            );

            // Convert to blob with size optimization
            canvas.toBlob((blob) => {
                // If file is still too large, reduce quality
                if (blob.size > maxFileSize && quality > 0.5) {
                    canvas.toBlob(resolve, outputFormat, quality - 0.1);
                } else {
                    resolve(blob);
                }
            }, outputFormat, quality);
        };

        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = URL.createObjectURL(file);
    });
}

/**
 * Calculate square crop dimensions from original image
 * @param {number} originalWidth - Original image width
 * @param {number} originalHeight - Original image height
 * @returns {Object} - Crop dimensions for square aspect ratio
 */
function calculateSquareCrop(originalWidth, originalHeight) {
    const size = Math.min(originalWidth, originalHeight);
    const sourceX = (originalWidth - size) / 2;
    const sourceY = (originalHeight - size) / 2;

    return {
        sourceX: Math.round(sourceX),
        sourceY: Math.round(sourceY),
        sourceWidth: Math.round(size),
        sourceHeight: Math.round(size)
    };
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

/**
 * Standardized profile image processing with consistent output
 * @param {File} file - The image file to process
 * @returns {Promise<Object>} - Processed image with metadata
 */
export async function standardizeProfileImage(file) {
    // Validate the input file
    const validation = validateImage(file, {
        maxSize: 2 * 1024 * 1024, // Allow up to 2MB input
        enforceSquare: true
    });

    if (!validation.success) {
        throw new Error(validation.error);
    }

    // Process the image
    const processedBlob = await processProfileImage(file, {
        targetWidth: 400,
        targetHeight: 400,
        quality: 0.85,
        outputFormat: 'image/jpeg',
        maxFileSize: 150 * 1024 // Max 150KB output
    });

    // Create a new File object with standardized name
    const standardizedFile = new File([processedBlob], 'profile-image.jpg', {
        type: 'image/jpeg',
        lastModified: Date.now()
    });

    return {
        file: standardizedFile,
        size: processedBlob.size,
        dimensions: '400x400',
        format: 'JPEG',
        quality: '85%',
        optimized: true
    };
}

/**
 * Get profile image specifications for consistent sizing
 * @returns {Object} - Standard profile image specifications
 */
export function getProfileImageSpecs() {
    return {
        dimensions: '400x400 pixels',
        maxFileSize: '150KB',
        format: 'JPEG',
        quality: '85%',
        aspectRatio: '1:1 (square)',
        supportedFormats: ['JPEG', 'PNG'],
        maxInputSize: '2MB'
    };
}
