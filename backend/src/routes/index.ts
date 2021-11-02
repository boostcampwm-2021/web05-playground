import { Router } from 'express';
import { pool } from 'src/database/connection';

// Export the base-router
const baseRouter = Router();

baseRouter.use('/test', async (req, res) => {
    const [result]: any = await pool.query('SELECT * from temp');
    console.log(JSON.parse(JSON.stringify(result)));
    return res.send(JSON.parse(JSON.stringify(result)));
});
export default baseRouter;
