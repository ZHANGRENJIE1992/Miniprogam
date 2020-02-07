// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportTranslateTranslateService = require('../../../app/service/translate/TranslateService');

declare module 'egg' {
  interface IService {
    translate: {
      translateService: ExportTranslateTranslateService;
    }
  }
}
