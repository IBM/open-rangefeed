export default {
  getDbHost: () => (
    {
      host: window.location.hostname, // or change to 'db.yourdomain.com' <-- Quotes are mandatory!
      port: 5984,
      dbname: 'rangefeed2',
      protocol: 'http', // Change to https if you want SSL
      bidirectional: true,
    }
  ),
};
