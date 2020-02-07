'use strict';

const Controller = require('../../../custom_module/Basic/BasicController');

class TranslateController extends Controller {
    async translate() {
        const { ctx } = this;
        let stream;
        try {
            stream = await ctx.getFileStream();
        } catch (e) {
            console.log(e);
        }
        const param = stream.fields;
        const result = await ctx.service.translate.translateService.translate(param, stream);
        this.success(result);
    }
}

module.exports = TranslateController;
