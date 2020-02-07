'use strict';

const Service = require('../../../custom_module/Basic/BasicQueryService');

class HotNewsDao extends Service {
    constructor(ctx) {
        super(ctx);
        this.table = 't_hot_news';
        this.tableShortCut = 'hn';
    }
}

module.exports = HotNewsDao;
