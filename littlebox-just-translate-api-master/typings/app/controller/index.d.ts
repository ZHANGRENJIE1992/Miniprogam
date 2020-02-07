// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportTranslateTranslateController = require('../../../app/controller/translate/TranslateController');

declare module 'egg' {
  interface IController {
    translate: {
      translateController: ExportTranslateTranslateController;
    }
  }
}
