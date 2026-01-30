import VisionCamera
import CoreImage
import Accelerate

@objc(BrightnessFrameProcessorPlugin)
public class BrightnessFrameProcessorPlugin: FrameProcessorPlugin {

  public override init(proxy: VisionCameraProxyHolder, options: [AnyHashable: Any]! = [:]) {
    super.init(proxy: proxy, options: options)
  }

  public override func callback(_ frame: Frame, withArguments arguments: [AnyHashable: Any]?) -> Any? {
    // Get the pixel buffer from the frame
    guard let pixelBuffer = CMSampleBufferGetImageBuffer(frame.buffer) else {
      return ["brightness": 0, "error": "Could not get pixel buffer"]
    }

    // Lock the pixel buffer for reading
    CVPixelBufferLockBaseAddress(pixelBuffer, .readOnly)
    defer { CVPixelBufferUnlockBaseAddress(pixelBuffer, .readOnly) }

    let width = CVPixelBufferGetWidth(pixelBuffer)
    let height = CVPixelBufferGetHeight(pixelBuffer)

    // Get the base address of the pixel buffer
    guard let baseAddress = CVPixelBufferGetBaseAddress(pixelBuffer) else {
      return ["brightness": 0, "error": "Could not get base address"]
    }

    let bytesPerRow = CVPixelBufferGetBytesPerRow(pixelBuffer)
    let pixelFormat = CVPixelBufferGetPixelFormatType(pixelBuffer)

    // Calculate brightness from center region (more stable for finger-over-camera)
    let centerX = width / 2
    let centerY = height / 2
    let sampleRadius = min(width, height) / 4 // Sample from center 50% of image

    var totalBrightness: Double = 0
    var sampleCount: Int = 0

    // Sample pixels in the center region
    let startX = max(0, centerX - sampleRadius)
    let endX = min(width, centerX + sampleRadius)
    let startY = max(0, centerY - sampleRadius)
    let endY = min(height, centerY + sampleRadius)

    // Handle different pixel formats
    if pixelFormat == kCVPixelFormatType_32BGRA {
      // BGRA format (most common)
      let buffer = baseAddress.assumingMemoryBound(to: UInt8.self)

      for y in stride(from: startY, to: endY, by: 4) { // Sample every 4th pixel for performance
        for x in stride(from: startX, to: endX, by: 4) {
          let offset = y * bytesPerRow + x * 4
          let b = Double(buffer[offset])
          let g = Double(buffer[offset + 1])
          let r = Double(buffer[offset + 2])

          // Calculate luminance using standard coefficients
          let luminance = 0.299 * r + 0.587 * g + 0.114 * b
          totalBrightness += luminance
          sampleCount += 1
        }
      }
    } else if pixelFormat == kCVPixelFormatType_420YpCbCr8BiPlanarVideoRange ||
              pixelFormat == kCVPixelFormatType_420YpCbCr8BiPlanarFullRange {
      // YUV format - Y plane contains brightness directly
      guard let yPlane = CVPixelBufferGetBaseAddressOfPlane(pixelBuffer, 0) else {
        return ["brightness": 0, "error": "Could not get Y plane"]
      }

      let yBytesPerRow = CVPixelBufferGetBytesPerRowOfPlane(pixelBuffer, 0)
      let buffer = yPlane.assumingMemoryBound(to: UInt8.self)

      for y in stride(from: startY, to: endY, by: 4) {
        for x in stride(from: startX, to: endX, by: 4) {
          let offset = y * yBytesPerRow + x
          totalBrightness += Double(buffer[offset])
          sampleCount += 1
        }
      }
    } else {
      return ["brightness": 0, "error": "Unsupported pixel format: \(pixelFormat)"]
    }

    let averageBrightness = sampleCount > 0 ? totalBrightness / Double(sampleCount) : 0

    // Also calculate variance to detect if finger is covering camera
    // When finger covers camera + torch, brightness is high and uniform
    var variance: Double = 0
    if pixelFormat == kCVPixelFormatType_32BGRA && sampleCount > 0 {
      let buffer = baseAddress.assumingMemoryBound(to: UInt8.self)
      var sumSquaredDiff: Double = 0

      for y in stride(from: startY, to: endY, by: 8) {
        for x in stride(from: startX, to: endX, by: 8) {
          let offset = y * bytesPerRow + x * 4
          let b = Double(buffer[offset])
          let g = Double(buffer[offset + 1])
          let r = Double(buffer[offset + 2])
          let luminance = 0.299 * r + 0.587 * g + 0.114 * b
          let diff = luminance - averageBrightness
          sumSquaredDiff += diff * diff
        }
      }
      variance = sumSquaredDiff / Double(sampleCount / 4)
    }

    // Finger detection: high brightness (>100) + low variance (<500) = finger covering camera
    let fingerDetected = averageBrightness > 100 && variance < 500

    return [
      "brightness": averageBrightness,
      "variance": variance,
      "fingerDetected": fingerDetected,
      "width": width,
      "height": height,
      "timestamp": Date().timeIntervalSince1970 * 1000
    ]
  }
}
