const fs = require('fs');
const path = require('path');

const files = [
    { src: 'C:\\Users\\abhir\\.gemini\\antigravity\\brain\\31625188-d5d0-4881-bc6d-7f24a7c7234c\\uploaded_image_0_1767945548001.png', dest: 'report_assets/seller_dashboard.png' },
    { src: 'C:\\Users\\abhir\\.gemini\\antigravity\\brain\\31625188-d5d0-4881-bc6d-7f24a7c7234c\\uploaded_image_2_1767945548001.png', dest: 'report_assets/add_product.png' },
    { src: 'C:\\Users\\abhir\\.gemini\\antigravity\\brain\\31625188-d5d0-4881-bc6d-7f24a7c7234c\\uploaded_image_3_1767945548001.png', dest: 'report_assets/home_page.png' }
];

files.forEach(file => {
    try {
        const destPath = path.join(__dirname, file.dest);
        fs.copyFileSync(file.src, destPath);
        console.log(`Successfully copied to ${destPath}`);
    } catch (err) {
        console.error(`Error copying ${file.src} to ${file.dest}:`, err.message);
    }
});
