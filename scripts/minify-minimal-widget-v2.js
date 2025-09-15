#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { minify } = require('terser');

const INPUT_FILE = path.join(__dirname, '../components/survey-render/survey-widget-minimal-v2.js');
const OUTPUT_FILE = path.join(__dirname, '../public/survey-widget-minimal-v2.min.js');

async function minifyMinimalWidget() {
    try {
        console.log('📦 Starting minimal survey widget v2 minification...');

        // Check if input file exists
        if (!fs.existsSync(INPUT_FILE)) {
            throw new Error(`Input file not found: ${INPUT_FILE}`);
        }

        // Read the source file
        console.log(`📖 Reading source file: ${INPUT_FILE}`);
        const sourceCode = fs.readFileSync(INPUT_FILE, 'utf8');

        // Minify the code with aggressive settings
        console.log('🔧 Minifying JavaScript with aggressive compression...');
        const result = await minify(sourceCode, {
            compress: {
                drop_console: true, // Remove all console statements
                drop_debugger: true,
                pure_funcs: ['console.log', 'console.error', 'console.warn'],
                passes: 3, // More passes for better compression
                unsafe: true, // Enable unsafe optimizations
                unsafe_comps: true,
                unsafe_math: true,
                unsafe_proto: true,
                hoist_funs: true,
                hoist_props: true,
                hoist_vars: true,
                if_return: true,
                join_vars: true,
                loops: true,
                negate_iife: true,
                properties: true,
                reduce_vars: true,
                sequences: true,
                side_effects: true,
                switches: true,
                top_retain: [],
                typeofs: true,
                unused: true,
                conditionals: true,
                dead_code: true,
                evaluate: true,
                booleans: true
            },
            mangle: {
                toplevel: true, // Mangle top-level names
                properties: {
                    regex: /^_/ // Mangle properties starting with underscore
                }
            },
            format: {
                comments: false, // Remove all comments
                beautify: false,
                semicolons: false, // Remove unnecessary semicolons
                braces: false // Remove unnecessary braces
            }
        });

        if (result.error) {
            throw result.error;
        }

        // Ensure public directory exists
        const publicDir = path.dirname(OUTPUT_FILE);
        if (!fs.existsSync(publicDir)) {
            fs.mkdirSync(publicDir, { recursive: true });
        }

        // Write minified code to public directory
        console.log(`💾 Writing minified file: ${OUTPUT_FILE}`);
        fs.writeFileSync(OUTPUT_FILE, result.code);

        // Get file sizes for comparison
        const originalSize = fs.statSync(INPUT_FILE).size;
        const minifiedSize = fs.statSync(OUTPUT_FILE).size;
        const compressionRatio = ((originalSize - minifiedSize) / originalSize * 100).toFixed(1);

        console.log('✅ Minimal widget minification completed successfully!');
        console.log(`📊 Original size: ${(originalSize / 1024).toFixed(2)} KB`);
        console.log(`📊 Minified size: ${(minifiedSize / 1024).toFixed(2)} KB`);
        console.log(`📊 Compression: ${compressionRatio}%`);

        if (minifiedSize > 2048) {
            console.log('⚠️  Warning: File is still larger than 2KB target');
            console.log(`📏 Current size: ${minifiedSize} bytes (target: 2048 bytes)`);
        } else {
            console.log('🎉 Success: File is under 2KB!');
            console.log(`📏 Current size: ${minifiedSize} bytes (target: 2048 bytes)`);
        }

    } catch (error) {
        console.error('❌ Minification failed:', error.message);
        process.exit(1);
    }
}

// Run the minification
minifyMinimalWidget();
