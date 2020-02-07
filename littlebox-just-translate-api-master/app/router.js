'use strict';

module.exports = app => {
    require('./router/translate/TranslateRouter')(app);
};
