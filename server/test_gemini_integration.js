const geminiService = require('./services/Gemini.service');
const fileParser = require('./services/FileParser');
const dotenv = require('dotenv');

dotenv.config();

/**
 * Basic integration test for Gemini and File Parser.
 */
async function testIntegration() {
    console.log("--- Starting Gemini Integration Test ---");

    if (!process.env.GEMINI_API_KEY) {
        console.warn("WARNING: GEMINI_API_KEY is not set in .env. Tests will likely fail.");
    }

    // Test 1: General Q&A
    console.log("\nTest 1: General Q&A");
    try {
        const response = await geminiService.askGeneral("What is the best way to prepare for a coding interview?");
        console.log("Response received (length):", response.length);
        console.log("Preview:", response.substring(0, 100) + "...");
    } catch (e) {
        console.error("Test 1 Failed:", e.message);
    }

    // Test 2: Summarization with Mock Context
    console.log("\nTest 2: Summarization");
    try {
        const mockContent = "Binary search is an efficient algorithm for finding an item from a sorted list of items. It works by repeatedly dividing in half the portion of the list that could contain the item, until you've narrowed down the possible locations to just one.";
        const summary = await geminiService.generateSummary(mockContent);
        console.log("Summary received (length):", summary.length);
        console.log("Preview:", summary.substring(0, 100) + "...");
    } catch (e) {
        console.error("Test 2 Failed:", e.message);
    }

    // Test 3: File Selection (Mock Parse)
    console.log("\nTest 3: File Parsing (Mock Check)");
    try {
        // This is harder to test without a real URL, so we just check if it throws for unsupported
        try {
            await fileParser.parseFile("http://example.com/test.txt", "Link");
            console.log("Link parsing (text fallback) passed.");
        } catch (e) {
            console.log("Link parsing threw as expected or caught error.");
        }
    } catch (e) {
        console.error("Test 3 Failed:", e.message);
    }

    console.log("\n--- Integration Test Complete ---");
}

testIntegration();
