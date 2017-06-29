module.exports = {
    /**
     * Application configuration section
     * http://pm2.keymetrics.io/docs/usage/application-declaration/
     */
    "apps": [{
        name: "oceany-blog",
        script: "app.js",
        watch: true,
        node_args: "--harmony",
        merge_logs: true,
        env: {
            "NODE_ENV": "default"
        },
        env_production: {
            "NODE_ENV": "production"
        }
    }]
};
