const socketIo = require('socket.io');
const { generateSensorData } = require('./sensorSimulation');

function setupWebSocket(server) {
    const io = socketIo(server, {
        cors: {
            origin: process.env.CORS_ORIGIN,
            methods: ['GET', 'POST'],
        },
    });

    io.on('connection', (socket) => {
        console.log('New client connected');

        socket.on('message', (message) => {
            if (message.type === 'fetchData') {
                const data = generateSensorData();
                socket.emit('sensorData', data);
            }
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });

    return io;
}

module.exports = setupWebSocket;
