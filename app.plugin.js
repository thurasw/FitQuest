/***
 * Fix for react-native-screens issue with react-native-reanimated
 * See: https://github.com/software-mansion/react-native-reanimated/issues/4981
 */

const plugins = require('@expo/config-plugins');
const generateCode = require('@expo/config-plugins/build/utils/generateCode');
const fs = require('fs');
const path = require('path');
const data = `
  $static_framework = ['RNScreens']

  pre_install do |installer|
    Pod::Installer::Xcode::TargetValidator.send(:define_method, :verify_no_static_framework_transitive_dependencies) {}
    installer.pod_targets.each do |pod|
      if $static_framework.include?(pod.name)
        def pod.build_type;
          Pod::BuildType.static_library
        end
      end
    end
  end
`;
const withStaticRNScreen = config => {
  return plugins.withDangerousMod(config, [
    'ios',
    async config => {
      const filePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');
      const contents = fs.readFileSync(filePath, 'utf-8');
      const mergeResults = generateCode.mergeContents({
        tag: 'static-rnscreen',
        src: contents,
        newSrc: data,
        anchor: /post_install\sdo\s\|installer\|/,
        offset: 0,
        comment: '#',
      });
      if (!mergeResults.didMerge) {
        console.log(
          "ERROR: Cannot add the fix for the RNScreens to the project's ios/Podfile because it's malformed. Please report this with a copy of your project Podfile.",
        );
        return config;
      }
      fs.writeFileSync(filePath, mergeResults.contents);
      return config;
    },
  ]);
};
exports.default = withStaticRNScreen;