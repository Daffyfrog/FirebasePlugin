#!/usr/bin/env node
'use strict';

var fs = require('fs');
var iosHelper = require("./lib/ios-helper");
var utilities = require("./lib/utilities");

var getValue = function(config, name) {
    var value = config.match(new RegExp('<' + name + '>(.*?)</' + name + '>', "i"))
    if(value && value[1]) {
        return value[1]
    } else {
        return null
    }
}

function fileExists(path) {
  try  {
    return fs.statSync(path).isFile();
  }
  catch (e) {
    return false;
  }
}

function directoryExists(path) {
  try  {
    return fs.statSync(path).isDirectory();
  }
  catch (e) {
    return false;
  }
}

var config = fs.readFileSync("config.xml").toString()
var name = getValue(config, "name")

if (directoryExists("platforms/ios")) {
  var paths = ["GoogleService-Info.plist", "platforms/ios/www/GoogleService-Info.plist"];

  for (var i = 0; i < paths.length; i++) {
    if (fileExists(paths[i])) {
      try {
        var contents = fs.readFileSync(paths[i]).toString();
        fs.writeFileSync("platforms/ios/" + name + "/Resources/GoogleService-Info.plist", contents)
      } catch(err) {
        process.stdout.write(err);
      }

      break;
    }
  }
}

if (directoryExists("platforms/android")) {
  var paths = ["google-services.json"];

  for (var i = 0; i < paths.length; i++) {
    if (fileExists(paths[i])) {
      try {
          var contents = fs.readFileSync(paths[i]).toString();
          fs.writeFileSync("platforms/android/google-services.json", contents);

          var json = JSON.parse(contents);
          var strings = fs.readFileSync("platforms/android/res/values/strings.xml").toString();

          // strip non-default value
          strings = strings.replace(new RegExp('<string name="google_app_id">([^\@<]+?)<\/string>', "i"), '')

          // strip non-default value
          strings = strings.replace(new RegExp('<string name="google_api_key">([^\@<]+?)<\/string>', "i"), '')

          // strip empty lines
          strings = strings.replace(new RegExp('(\r\n|\n|\r)[ \t]*(\r\n|\n|\r)', "gm"), '$1')

          // replace the default value
          strings = strings.replace(new RegExp('<string name="google_app_id">([^<]+?)<\/string>', "i"), '<string name="google_app_id">' + json.client[0].client_info.mobilesdk_app_id + '</string>')

          // replace the default value
          strings = strings.replace(new RegExp('<string name="google_api_key">([^<]+?)<\/string>', "i"), '<string name="google_api_key">' + json.client[0].api_key[0].current_key + '</string>')

<<<<<<< HEAD
          fs.writeFileSync("platforms/android/res/values/strings.xml", strings);
=======
        var json = JSON.parse(contents);
        var xcodeProjectPath = utilities.getXcodeProjectPath(context);
        iosHelper.removeShellScriptBuildPhase(context, xcodeProjectPath);
        iosHelper.addShellScriptBuildPhase(context, xcodeProjectPath);
>>>>>>> 828793171c7d6312ed0b45ffa4dde90da96fc823
      } catch(err) {
        process.stdout.write(err);
      }

      break;
    }
  }
}
