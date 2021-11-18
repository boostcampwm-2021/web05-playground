import './pre-start'; // Must be the first import
import Socket from './socket/socket';

const socket = new Socket(8000);
socket.connect();
