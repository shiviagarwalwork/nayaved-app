#import <VisionCamera/FrameProcessorPlugin.h>
#import <VisionCamera/FrameProcessorPluginRegistry.h>

#if __has_include("NayaVedAI-Swift.h")
#import "NayaVedAI-Swift.h"
#else
#import "NayaVedAI/NayaVedAI-Swift.h"
#endif

VISION_EXPORT_SWIFT_FRAME_PROCESSOR(BrightnessFrameProcessorPlugin, detectBrightness)
