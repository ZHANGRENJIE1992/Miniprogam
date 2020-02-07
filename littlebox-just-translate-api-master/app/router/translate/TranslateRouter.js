'use strict';

module.exports = app => {
    const { router, controller } = app;
    router.post('/api/translate', controller.translate.translateController.translate);
};
