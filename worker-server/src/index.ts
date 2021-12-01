import './pre-start';
import Socket from './socket/socket';

const socket = new Socket(8000);
socket.connect();
