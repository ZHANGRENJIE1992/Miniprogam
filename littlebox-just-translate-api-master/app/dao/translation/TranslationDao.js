'use strict';

const Service = require('../../../custom_module/Basic/BasicQueryService');

class TranslationDao extends Service {
    constructor(ctx) {
        super(ctx);
        this.table = 't_translation';
        this.tableShortCut = 't';
    }
}

module.exports = TranslationDao;
