import sharp from "sharp"
import fs from "fs/promises"
import path from "path"

async function convertPngToIco(inputPath, outputPath) {
  try {
    const inputFileName = path.basename(inputPath)
    console.log(`尝试将 ${inputFileName} 转换为 ICO 格式...`)

    // Ensure the input file exists
    try {
      await fs.access(inputPath)
    } catch (error) {
      console.error(`错误: 输入文件不存在或无法访问: ${inputPath}`)
      return
    }

    // Sharp can output ICO directly, but it's often better to generate multiple sizes for ICO
    // For simplicity, this example generates a single 256x256 ICO.
    // For a proper favicon.ico, you'd typically include 16x16, 32x32, 48x48, 64x64, 128x128, 256x256.
    await sharp(inputPath)
      .resize(256, 256) // Resize to a common ICO size, you can adjust this
      .toFormat("ico")
      .toFile(outputPath)

    console.log(`成功将 ${inputFileName} 转换为 ${outputPath}`)
  } catch (error) {
    console.error("转换过程中发生错误:", error)
  }
}

// Example usage:
// Assuming 'icon.png' is in the 'public' directory relative to where you run the script
const inputPngPath = path.resolve(process.cwd(), "public", "icon.png")
const outputIcoPath = path.resolve(process.cwd(), "public", "favicon.ico") // Common name for favicon

convertPngToIco(inputPngPath, outputIcoPath)
