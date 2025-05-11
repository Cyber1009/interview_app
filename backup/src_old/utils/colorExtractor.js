const extractColors = async (imageUrl) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      const colors = [];
      
      // Sample pixels at regular intervals
      for (let i = 0; i < imageData.length; i += 4 * 10) {
        const r = imageData[i];
        const g = imageData[i + 1];
        const b = imageData[i + 2];
        colors.push({ r, g, b });
      }

      // Get dominant color (simple average for primary)
      const primary = colors.reduce((acc, curr) => ({
        r: acc.r + curr.r / colors.length,
        g: acc.g + curr.g / colors.length,
        b: acc.b + curr.b / colors.length
      }), { r: 0, g: 0, b: 0 });

      // Generate complementary color for secondary
      const secondary = {
        r: 255 - primary.r,
        g: 255 - primary.g,
        b: 255 - primary.b
      };

      // Generate background color (lighter version of primary)
      const background = {
        r: Math.min(255, primary.r + 200),
        g: Math.min(255, primary.g + 200),
        b: Math.min(255, primary.b + 200)
      };

      // Generate text color based on background luminance
      const backgroundLuminance = (0.299 * background.r + 0.587 * background.g + 0.114 * background.b) / 255;
      const text = backgroundLuminance > 0.5 ? { r: 51, g: 51, b: 51 } : { r: 255, g: 255, b: 255 };

      resolve({
        primary: rgbToHex(primary),
        secondary: rgbToHex(secondary),
        background: rgbToHex(background),
        text: rgbToHex(text)
      });
    };

    img.src = imageUrl;
  });
};

const rgbToHex = ({ r, g, b }) => {
  return '#' + [r, g, b]
    .map(x => Math.round(x).toString(16).padStart(2, '0'))
    .join('');
};

export { extractColors };
