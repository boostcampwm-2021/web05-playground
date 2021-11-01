import './pre-start'; // Must be the first import
import app from '@server';

// Start the server
const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
    console.log('Express server started on port: ' + port);
});
