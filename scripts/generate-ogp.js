const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateOGPImage() {
  try {
    // 通常のOGP画像を生成
    const svgPath = path.join(__dirname, '../public/images/ogp.svg');
    const pngPath = path.join(__dirname, '../public/images/ogp.png');

    if (!fs.existsSync(svgPath)) {
      console.error('SVGファイルが見つかりません:', svgPath);
      return;
    }

    await sharp(svgPath).png().resize(1200, 630).toFile(pngPath);

    console.log('✅ OGP画像を生成しました:', pngPath);

    const stats = fs.statSync(pngPath);
    console.log(`📊 ファイルサイズ: ${(stats.size / 1024).toFixed(2)} KB`);

    // Twitter summary用の正方形画像を生成
    const twitterSummarySvgPath = path.join(
      __dirname,
      '../public/images/twitter-summary.svg',
    );
    const twitterSummaryPngPath = path.join(
      __dirname,
      '../public/images/twitter-summary.png',
    );

    if (!fs.existsSync(twitterSummarySvgPath)) {
      console.error(
        'Twitter summary用SVGファイルが見つかりません:',
        twitterSummarySvgPath,
      );
      return;
    }

    await sharp(twitterSummarySvgPath)
      .png()
      .resize(400, 400)
      .toFile(twitterSummaryPngPath);

    console.log(
      '✅ Twitter summary用画像を生成しました:',
      twitterSummaryPngPath,
    );

    const twitterSummaryStats = fs.statSync(twitterSummaryPngPath);
    console.log(
      `📊 Twitter summary用ファイルサイズ: ${(twitterSummaryStats.size / 1024).toFixed(2)} KB`,
    );
  } catch (error) {
    console.error('❌ OGP画像の生成に失敗しました:', error);
  }
}

generateOGPImage();
