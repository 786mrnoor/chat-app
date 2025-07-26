export default function reduceImage(url, type = 'image/jpeg') {
  return new Promise((resolve) => {
    const img = new Image();

    img.src = url;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.naturalWidth;
      let height = img.naturalHeight;

      if (width >= 4000 || height >= 4000) {
        width *= 0.2;
        height *= 0.2;
      } else if (width >= 3000 || height >= 3000) {
        width *= 0.3;
        height *= 0.3;
      } else if (width >= 2000 || height >= 2000) {
        width *= 0.4;
        height *= 0.4;
      } else if (width >= 1000 || height >= 1000) {
        width *= 0.8;
        height *= 0.8;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      // resolve the promise (return the blob)
      canvas.toBlob((file) => resolve({ file, width, height }), type, 0.6); // 60% quality
    };
  });
}
