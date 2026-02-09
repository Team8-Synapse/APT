const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

let supabase = null;
let initError = null;

// Check if credentials are configured
if (!supabaseUrl || supabaseUrl === 'your_supabase_project_url') {
    initError = 'SUPABASE_URL is not configured in .env file';
    console.warn('Warning:', initError);
} else if (!supabaseKey || supabaseKey === 'your_service_role_key_here' || supabaseKey.includes('your_')) {
    initError = 'SUPABASE_SERVICE_KEY is not configured in .env file. Please add your service_role key from Supabase Dashboard > Settings > API';
    console.warn('Warning:', initError);
} else {
    try {
        supabase = createClient(supabaseUrl, supabaseKey);
        console.log('Supabase client initialized successfully');
    } catch (err) {
        initError = `Failed to initialize Supabase client: ${err.message}`;
        console.error(initError);
    }
}

const BUCKET_NAME = 'resources';

/**
 * Upload a file to Supabase Storage
 * @param {Buffer} fileBuffer - The file buffer to upload
 * @param {string} fileName - The name to save the file as
 * @param {string} mimeType - The MIME type of the file
 * @returns {Promise<{url: string, error: Error|null}>}
 */
const uploadFile = async (fileBuffer, fileName, mimeType) => {
    if (!supabase) {
        return {
            url: null,
            error: new Error(initError || 'Supabase not configured. Please add SUPABASE_URL and SUPABASE_SERVICE_KEY to your .env file.')
        };
    }

    try {
        // Generate a unique filename with timestamp
        const uniqueFileName = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

        console.log(`Uploading file: ${uniqueFileName} to bucket: ${BUCKET_NAME}`);

        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(uniqueFileName, fileBuffer, {
                contentType: mimeType,
                upsert: false
            });

        if (error) {
            console.error('Supabase upload error:', error);
            // Provide more helpful error messages
            if (error.message?.includes('Bucket not found')) {
                return { url: null, error: new Error(`Bucket '${BUCKET_NAME}' does not exist. Please create it in Supabase Dashboard > Storage.`) };
            }
            if (error.message?.includes('Invalid key')) {
                return { url: null, error: new Error('Invalid Supabase service key. Please check SUPABASE_SERVICE_KEY in .env file.') };
            }
            return { url: null, error };
        }

        // Get the public URL
        const { data: publicUrlData } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(uniqueFileName);

        console.log('File uploaded successfully. Public URL:', publicUrlData.publicUrl);
        return { url: publicUrlData.publicUrl, error: null };
    } catch (err) {
        console.error('Upload error:', err);
        return { url: null, error: err };
    }
};

/**
 * Delete a file from Supabase Storage
 * @param {string} fileUrl - The full URL of the file to delete
 * @returns {Promise<{success: boolean, error: Error|null}>}
 */
const deleteFile = async (fileUrl) => {
    if (!supabase) {
        return { success: false, error: new Error(initError || 'Supabase not configured') };
    }

    try {
        // Extract the filename from the URL
        const urlParts = fileUrl.split('/');
        const fileName = urlParts[urlParts.length - 1];

        console.log(`Deleting file: ${fileName} from bucket: ${BUCKET_NAME}`);

        const { error } = await supabase.storage
            .from(BUCKET_NAME)
            .remove([fileName]);

        if (error) {
            console.error('Supabase delete error:', error);
            return { success: false, error };
        }

        console.log('File deleted successfully');
        return { success: true, error: null };
    } catch (err) {
        console.error('Delete error:', err);
        return { success: false, error: err };
    }
};

/**
 * Check if Supabase is properly configured
 * @returns {{configured: boolean, error: string|null}}
 */
const isConfigured = () => {
    return {
        configured: supabase !== null,
        error: initError
    };
};

module.exports = {
    uploadFile,
    deleteFile,
    isConfigured,
    supabase
};
