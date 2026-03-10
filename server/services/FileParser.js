const pdf = require('pdf-parse');
const officeparser = require('officeparser');
const axios = require('axios');

/**
 * Utility to parse text from various file formats.
 */
const FileParser = {
    /**
     * Parses text from a PDF given its URL.
     * @param {string} url 
     */
    async parsePdfFromUrl(url) {
        try {
            const response = await axios.get(url, { responseType: 'arraybuffer' });

            // Handle different export styles of pdf-parse
            let dataText = '';
            if (typeof pdf === 'function') {
                const data = await pdf(response.data);
                dataText = data.text;
            } else if (pdf.PDFParse) {
                const parser = new pdf.PDFParse({ data: response.data });
                const result = await parser.getText();
                dataText = result.text;
                await parser.destroy();
            } else {
                throw new Error("Could not find suitable pdf-parse export.");
            }
            return String(dataText || '');
        } catch (error) {
            console.error('PDF Parsing Error:', error);
            throw new Error(`Failed to parse PDF: ${error.message}`);
        }
    },

    /**
     * Parses text from a PPT/PPTX given its URL.
     * @param {string} url 
     */
    async parsePptFromUrl(url) {
        try {
            const response = await axios.get(url, { responseType: 'arraybuffer' });
            const buffer = Buffer.from(response.data);
            const data = await officeparser.parseOffice(buffer);

            // officeparser v6 returns an object with toText() method
            let text = '';
            if (typeof data === 'string') {
                text = data;
            } else if (data && typeof data.toText === 'function') {
                text = data.toText();
            } else if (data && data.content && Array.isArray(data.content)) {
                // Fallback: extract text from content array (slides)
                text = data.content.map(slide => {
                    if (!slide.children) return '';
                    return slide.children
                        .filter(child => child.text)
                        .map(child => child.text)
                        .join('\n');
                }).join('\n\n');
            }

            console.log('PPT parsed text length:', text.length, 'preview:', text.substring(0, 100));
            return text || 'No text content found in this presentation.';
        } catch (error) {
            console.error('PPT Parsing Error:', error);
            throw new Error(`Failed to parse PPT: ${error.message}`);
        }
    },

    /**
     * Parses content based on file type.
     * @param {string} url 
     * @param {string} type 
     */
    async parseFile(url, type) {
        const lowerType = type ? type.toLowerCase() : '';
        const lowerUrl = url.toLowerCase();
        let result;

        console.log(`FileParser: Parsing file of type ${type} from ${url}`);

        if (lowerType === 'pdf' || lowerUrl.endsWith('.pdf')) {
            result = await this.parsePdfFromUrl(url);
        } else if (lowerType === 'ppt' || lowerUrl.endsWith('.ppt') || lowerUrl.endsWith('.pptx')) {
            result = await this.parsePptFromUrl(url);
        } else {
            result = `Refer to the resource at: ${url}`;
        }

        console.log(`FileParser: Finished parsing. Result type: ${typeof result}`);
        return result;
    }
};

module.exports = FileParser;
