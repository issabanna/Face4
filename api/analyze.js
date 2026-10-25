import {createHandler} from '../server/server.mjs';
// Reuse the tested handler, without opening a listening port on Vercel.
const handler=createHandler();
export default handler;
