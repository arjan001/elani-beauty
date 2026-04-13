import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const videos = [
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AQMBMNNmfzdAghkCi0VzaLoLeNON6Wr1ILmEJmKuSV1J4U4j246dw4EOjpkzWrFI1LYZReqxhlvZ-KhByB_jg7XulSgkV7La-eu2tMl2YccxVgxRxEbB3DFaMxGvjlM.mp4',
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AQMbErY7RrcLaRB5Ggniv_RbTM3IXRPQnI5HURBj1NDbFt1TKgpQn4-fWsN2Z-KeukLvhcZvv6Wsj9qckbjMXkegSsUVKk-l-ORfQhI1aAW1N8bdgt6dq23mPfQW77v.mp4',
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AQMaFPa_bL_-vkPZgnKZplv1glxbehxSdtJjgoNVHH3ZAX-giVXLJWKRaUq4VLSHLWHv0qYUN6whdNaJ4HU38vjCWvRwHNXQ-cv4NqraMYBHmLf5lno7ZOGlPA6sXXc.mp4',
];

async function downloadFirstBytes(url, bytes = 5000) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = Buffer.alloc(0);
        res.on('data', (chunk) => {
          data = Buffer.concat([data, chunk]);
          if (data.length >= bytes) {
            res.destroy();
          }
        });
        res.on('end', () => resolve(data));
      })
      .on('error', reject);
  });
}

async function extractVideoInfo(url, index) {
  try {
    console.log(`\n[Video ${index + 1}] Processing: ${url.substring(0, 100)}...`);
    
    const buffer = await downloadFirstBytes(url, 10000);
    
    // Get file size info from headers
    const sizePromise = new Promise((resolve, reject) => {
      https.head(url, (res) => {
        resolve(res.headers['content-length']);
      }).on('error', reject);
    });
    
    const contentLength = await sizePromise;
    console.log(`File size: ${(contentLength / 1024 / 1024).toFixed(2)} MB`);
    
    // Check if it's a valid MP4 (should start with ftyp atoms)
    const isMp4 = buffer.includes('ftyp');
    console.log(`Valid MP4: ${isMp4}`);
    
    // Try to extract text/OCR would require additional libraries
    console.log(`→ Please review this video thumbnail in your browser`);
    
    return { url, index: index + 1, size: contentLength, valid: isMp4 };
  } catch (error) {
    console.error(`Error processing video ${index + 1}:`, error.message);
    return { url, index: index + 1, error: error.message };
  }
}

async function main() {
  console.log('Extracting video information...\n');
  const results = [];
  
  for (let i = 0; i < videos.length; i++) {
    const result = await extractVideoInfo(videos[i], i);
    results.push(result);
  }
  
  console.log('\n=== SUMMARY ===');
  console.log(JSON.stringify(results, null, 2));
  
  console.log('\n✅ To get product details, please:');
  console.log('1. Open each video URL in your browser');
  console.log('2. Provide product name, price (KSh), sizes, and category for each');
  console.log('3. I will then create the SQL insert statements with video URLs\n');
}

main();
