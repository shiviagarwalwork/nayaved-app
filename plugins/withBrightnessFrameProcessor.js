const { withXcodeProject } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

function withBrightnessFrameProcessor(config) {
  return withXcodeProject(config, async (config) => {
    const xcodeProject = config.modResults;
    const projectRoot = config.modRequest.projectRoot;
    const projectName = config.modRequest.projectName;

    // Template source files
    const templatesDir = path.join(projectRoot, 'plugins', 'native-templates');
    const swiftFileName = 'BrightnessFrameProcessor.swift';
    const objcFileName = 'BrightnessFrameProcessor.m';

    // Destination in the iOS project
    const iosProjectDir = path.join(projectRoot, 'ios', projectName);

    // Copy template files to iOS project directory
    const swiftSource = path.join(templatesDir, swiftFileName);
    const objcSource = path.join(templatesDir, objcFileName);
    const swiftDest = path.join(iosProjectDir, swiftFileName);
    const objcDest = path.join(iosProjectDir, objcFileName);

    // Ensure destination directory exists
    if (!fs.existsSync(iosProjectDir)) {
      console.warn(`iOS project directory does not exist: ${iosProjectDir}`);
      return config;
    }

    // Copy Swift file
    if (fs.existsSync(swiftSource)) {
      fs.copyFileSync(swiftSource, swiftDest);
      console.log(`Copied ${swiftFileName} to ${iosProjectDir}`);
    } else {
      console.warn(`Swift template not found: ${swiftSource}`);
      return config;
    }

    // Copy Objective-C file
    if (fs.existsSync(objcSource)) {
      fs.copyFileSync(objcSource, objcDest);
      console.log(`Copied ${objcFileName} to ${iosProjectDir}`);
    } else {
      console.warn(`Objective-C template not found: ${objcSource}`);
      return config;
    }

    // Find the app target
    const target = xcodeProject.getFirstTarget();
    if (!target) {
      console.warn('Could not find app target');
      return config;
    }
    const targetUuid = target.uuid;

    // Find the main group for the app (e.g., NayaVedAI group)
    const mainGroupId = xcodeProject.getFirstProject().firstProject.mainGroup;
    const mainGroup = xcodeProject.getPBXGroupByKey(mainGroupId);

    // Find the app group
    let appGroupKey = null;
    if (mainGroup && mainGroup.children) {
      for (const child of mainGroup.children) {
        if (child.comment === projectName) {
          appGroupKey = child.value;
          break;
        }
      }
    }

    if (!appGroupKey) {
      console.warn(`Could not find ${projectName} group in Xcode project`);
      // Try adding to main group instead
      appGroupKey = mainGroupId;
    }

    // File paths relative to the ios folder (where the xcodeproj is)
    const swiftFilePath = `${projectName}/${swiftFileName}`;
    const objcFilePath = `${projectName}/${objcFileName}`;

    // Check if files are already added
    const pbxFileRefs = xcodeProject.pbxFileReferenceSection();
    let swiftAlreadyAdded = false;
    let objcAlreadyAdded = false;

    for (const key in pbxFileRefs) {
      const fileRef = pbxFileRefs[key];
      if (typeof fileRef === 'object') {
        const refPath = fileRef.path || fileRef.name;
        if (refPath === swiftFileName || refPath === swiftFilePath) {
          swiftAlreadyAdded = true;
        }
        if (refPath === objcFileName || refPath === objcFilePath) {
          objcAlreadyAdded = true;
        }
      }
    }

    // Add Swift file to project if not already added
    if (!swiftAlreadyAdded) {
      xcodeProject.addSourceFile(
        swiftFilePath,
        { target: targetUuid },
        appGroupKey
      );
      console.log(`Added ${swiftFilePath} to Xcode project`);
    } else {
      console.log(`${swiftFileName} already in Xcode project`);
    }

    // Add Objective-C file to project if not already added
    if (!objcAlreadyAdded) {
      xcodeProject.addSourceFile(
        objcFilePath,
        { target: targetUuid },
        appGroupKey
      );
      console.log(`Added ${objcFilePath} to Xcode project`);
    } else {
      console.log(`${objcFileName} already in Xcode project`);
    }

    return config;
  });
}

module.exports = withBrightnessFrameProcessor;
