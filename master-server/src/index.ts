import './pre-start';
import app from '@server';

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
    console.log('Express server started on port: ' + port);
});
