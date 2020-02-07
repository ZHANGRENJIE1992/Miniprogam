'use strict';

module.exports = appInfo => {
    const config = {
        mysql: {
            clients: {
                db_write: {
                    host: '172.17.32.3',
                    port: '3306',
                    user: 'server_manage',
                    password: '4%$!FnKg5FeU',
                    database: 'kic_garden'
                },
                db_read: {
                    host: '172.17.32.3',
                    port: '3306',
                    user: 'server_manage',
                    password: '4%$!FnKg5FeU',
                    database: 'kic_garden'
                }
            }
        }
    };
    const customConfig = {
        // myAppName: 'egg',
    };
    return {
        ...config,
        ...customConfig
    };
};
