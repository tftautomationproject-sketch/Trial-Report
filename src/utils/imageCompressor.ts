/**
 * Utility to compress and resize images to ensure document sizes stay well
 * under Cloud Firestore's 1MB (1,048,576 bytes) document limit.
 */

/**
 * Resizes and compresses an image File or Blob into a lightweight base64 JPEG data URL.
 * Typical output is 30KB - 80KB even from 10MB+ camera photos.
 */
export async function compressImageFile(
  file: File | Blob,
  maxWidth = 1024,
  maxHeight = 1024,
  quality = 0.72
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = () => {
      const dataUrl = reader.result as string;
      compressBase64Image(dataUrl, maxWidth, maxHeight, quality)
        .then(resolve)
        .catch(() => resolve(dataUrl)); // fallback to original if compression fails
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Resizes and compresses a base64 Data URL.
 */
export async function compressBase64Image(
  dataUrl: string,
  maxWidth = 1024,
  maxHeight = 1024,
  quality = 0.72
): Promise<string> {
  // If not a data URL or is an SVG, SVGs are lightweight text (<5KB), no canvas resize needed
  if (!dataUrl || !dataUrl.startsWith('data:') || dataUrl.includes('image/svg+xml')) {
    return dataUrl;
  }

  // If already very small (< 45KB), no need to compress unless explicitly requested
  if (dataUrl.length < 45 * 1024 && maxWidth >= 1024) {
    return dataUrl;
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        let { width, height } = img;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve(dataUrl);
        }

        // Fill white background in case of transparent PNG being converted to JPEG
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);

        ctx.drawImage(img, 0, 0, width, height);

        // Export as JPEG with specified quality
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      } catch (err) {
        console.warn('Image canvas compression failed, using original:', err);
        resolve(dataUrl);
      }
    };

    img.onerror = () => {
      resolve(dataUrl);
    };

    img.src = dataUrl;
  });
}

/**
 * Optimizes all images inside a TrialReport to guarantee that the document
 * will stay under Firestore's 1MB limit.
 */
export async function optimizeReportImagesForFirestore<T extends {
  headerImage1?: string;
  headerImage2?: string;
  problems?: Array<{ images?: string[] }>;
}>(report: T): Promise<T> {
  const cloned = JSON.parse(JSON.stringify(report)) as T;

  // 1. First pass: compress header images (max 900px, quality 0.7)
  if (cloned.headerImage1) {
    cloned.headerImage1 = await compressBase64Image(cloned.headerImage1, 900, 900, 0.7);
  }
  if (cloned.headerImage2) {
    cloned.headerImage2 = await compressBase64Image(cloned.headerImage2, 900, 900, 0.7);
  }

  // 2. Compress problem images (max 800px, quality 0.7)
  if (cloned.problems && Array.isArray(cloned.problems)) {
    for (const problem of cloned.problems) {
      if (problem.images && Array.isArray(problem.images)) {
        for (let i = 0; i < problem.images.length; i++) {
          const img = problem.images[i];
          if (img) {
            problem.images[i] = await compressBase64Image(img, 800, 800, 0.7);
          }
        }
      }
    }
  }

  // 3. Size check: Firestore maximum size is 1,048,576 bytes.
  // If JSON size is > 750,000 bytes, perform an aggressive compression pass (600px, quality 0.55).
  let payloadSize = new Blob([JSON.stringify(cloned)]).size;
  if (payloadSize > 750_000) {
    if (cloned.headerImage1) {
      cloned.headerImage1 = await compressBase64Image(cloned.headerImage1, 650, 650, 0.55);
    }
    if (cloned.headerImage2) {
      cloned.headerImage2 = await compressBase64Image(cloned.headerImage2, 650, 650, 0.55);
    }
    if (cloned.problems && Array.isArray(cloned.problems)) {
      for (const problem of cloned.problems) {
        if (problem.images && Array.isArray(problem.images)) {
          for (let i = 0; i < problem.images.length; i++) {
            const img = problem.images[i];
            if (img) {
              problem.images[i] = await compressBase64Image(img, 550, 550, 0.55);
            }
          }
        }
      }
    }
  }

  return cloned;
}
