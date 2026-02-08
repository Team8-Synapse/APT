const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const BUCKET_NAME = 'prephub-resources';

/**
 * Upload a file (PDF/PPT) to Supabase Storage
 * @param {string} filePath - Local path to the file
 * @param {string} originalName - Original filename
 * @returns {Object} - { fileId, fileUrl }
 */
const uploadResourceFile = async (filePath, originalName) => {
    try {
        // Read file content
        const fileBuffer = fs.readFileSync(filePath);

        // Generate unique filename
        const timestamp = Date.now();
        const ext = path.extname(originalName);
        const baseName = path.basename(originalName, ext);
        const uniqueFileName = `${timestamp}_${baseName}${ext}`;
        const storagePath = `resources/${uniqueFileName}`;

        // Determine content type
        let contentType = 'application/octet-stream';
        if (ext === '.pdf') contentType = 'application/pdf';
        else if (ext === '.ppt' || ext === '.pptx') contentType = 'application/vnd.ms-powerpoint';

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(storagePath, fileBuffer, {
                contentType,
                upsert: false,
            });

        if (error) {
            console.error('Supabase upload error:', error);
            throw error;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(storagePath);

        console.log('Supabase upload success:', {
            fileId: storagePath,
            fileUrl: urlData.publicUrl
        });

        return {
            fileId: storagePath,
            fileUrl: urlData.publicUrl,
        };
    } catch (error) {
        console.error('Error uploading to Supabase:', error);
        throw error;
    }
};

/**
 * Delete a file from Supabase Storage
 * @param {string} filePath - The storage path of the file to delete
 */
const deleteResourceFile = async (filePath) => {
    try {
        const { error } = await supabase.storage
            .from(BUCKET_NAME)
            .remove([filePath]);

        if (error) {
            console.error('Supabase delete error:', error);
            throw error;
        }

        return true;
    } catch (error) {
        console.error('Error deleting from Supabase:', error);
        throw error;
    }
};

module.exports = {
    supabase,
    uploadResourceFile,
    deleteResourceFile,
};
