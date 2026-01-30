const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

function withBridgingHeader(config) {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const projectName = config.modRequest.projectName;

      // Path to the bridging header
      const bridgingHeaderPath = path.join(
        projectRoot,
        'ios',
        projectName,
        `${projectName}-Bridging-Header.h`
      );

      const requiredImports = `//
// Use this file to import your target's public headers that you would like to expose to Swift.
//

#import <VisionCamera/FrameProcessorPlugin.h>
#import <VisionCamera/FrameProcessorPluginRegistry.h>
#import <VisionCamera/Frame.h>

`;

      // Write/overwrite the bridging header
      fs.writeFileSync(bridgingHeaderPath, requiredImports);
      console.log(`Updated bridging header at ${bridgingHeaderPath}`);

      return config;
    },
  ]);
}

module.exports = withBridgingHeader;
