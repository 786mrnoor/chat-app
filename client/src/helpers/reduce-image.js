export default function reduceImage(
  url,
  { type = 'image/jpeg', maxWidth = 3000, maxHeight = 3000, quality = 0.6 }
) {
  return new Promise((resolve) => {
    const img = new Image();

    img.src = url;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.naturalWidth;
      let height = img.naturalHeight;

      if (width > maxWidth || height > maxHeight) {
        const scale = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      // resolve the promise (return the blob)
      // canvas.toBlob((file) => resolve({ file, width, height }), type, quality); // 60% quality
      canvas.toBlob(resolve, type, quality); // 60% quality
    };
  });
}

export function reduceChatAvatar(url, type) {
  return reduceImage(url, {
    type: type,
    maxWidth: 500,
    maxHeight: 500,
    quality: 0.7,
  });
}
