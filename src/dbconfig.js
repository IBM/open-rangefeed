export default {
  getDbHost: () => (
    {
      host: window.location.hostname,
      port: 5984,
      dbname: 'rangefeed2',
      protocol: 'http',
      bidirectional: true,
    }
  ),
};
