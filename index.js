import express from 'express'
import { createServer } from 'node:http'
import cors from 'cors'
import { Server } from 'socket.io'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const app = express()
const port = 2846
const server = createServer(app)
const io = new Server(server)

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const queueFilePath = path.join(__dirname, 'queue.json');

const saveQueueToFile = async (queue) => {
    try {
        await fs.promises.writeFile(queueFilePath, JSON.stringify(queue, null, 2));
    } catch (error) {
        console.error('Error saving queue to file:', error);
    }
};

const loadQueueFromFile = async () => {
    try {
        if (fs.existsSync(queueFilePath)) {
            const data = await fs.promises.readFile(queueFilePath, 'utf-8');
            return JSON.parse(data);
        }
        return [];
    } catch (error) {
        console.error('Error loading queue from file:', error);
        return [];
    }
};

const saveQueueToDB = saveQueueToFile;
const loadQueueFromDB = loadQueueFromFile;

app.use(express.json())
app.use(cors())
app.use(express.static(path.join(__dirname, 'frontend/dist')))

let timerState = {
    minutes: 0,
    seconds: 0,
    isRunning: false,
    isPaused: false
}

let timerInterval = null

let timerQueue = []

console.log('Initial timerQueue:', timerQueue);
(async () => {
    timerQueue = await loadQueueFromFile();
    console.log('Loaded timerQueue:', timerQueue);
})();

const updateTimer = () => {
    if (timerState.isRunning && !timerState.isPaused) {
        if (timerState.seconds > 0) {
            timerState.seconds--
        } else if (timerState.minutes > 0) {
            timerState.minutes--
            timerState.seconds = 59
        } else {
            clearInterval(timerInterval)
            timerState.isRunning = false
            io.emit('timer:ended')
        }
        io.emit('timer:update', timerState)
    }
}

io.on('connection', (socket) => {
    console.log('Client connected')
    
    socket.emit('timer:state', timerState)
    socket.emit('queue:update', timerQueue)

    socket.on('speaker:update', (data) => {
        io.emit('speaker:update', data);
    });

    socket.on('timer:input', (data) => {
        timerState.minutes = parseInt(data.minutes)
        timerState.seconds = parseInt(data.seconds)
        io.emit('timer:state', timerState)
    })

    socket.on('timer:start', (data) => {
        timerState.minutes = parseInt(data.minutes)
        timerState.seconds = parseInt(data.seconds)
        timerState.isRunning = true
        timerState.isPaused = false
        
        if (timerInterval) {
            clearInterval(timerInterval)
        }
        timerInterval = setInterval(updateTimer, 1000)
        io.emit('timer:state', timerState)
    })

    socket.on('timer:pause', () => {
        timerState.isPaused = true
        io.emit('timer:state', timerState)
    })

    socket.on('timer:resume', () => {
        timerState.isPaused = false
        io.emit('timer:state', timerState)
    })

    socket.on('timer:stop', (lastState) => {
        timerState.isRunning = false
        timerState.isPaused = false
        clearInterval(timerInterval)

        if (lastState) {
            timerState.minutes = lastState.minutes
            timerState.seconds = lastState.seconds
        }

        io.emit('timer:state', timerState)
    })

    socket.on('queue:add', async (timer) => {
        timerQueue.push(timer)
        await saveQueueToDB(timerQueue)
        io.emit('queue:update', timerQueue)
    })

    socket.on('queue:remove', async (index) => {
        if (index >= 0 && index < timerQueue.length) {
            timerQueue.splice(index, 1)
            await saveQueueToDB(timerQueue)
            io.emit('queue:update', timerQueue)
        }
    })

    socket.on('queue:startNext', () => {
        if (timerQueue.length > 0) {
            const nextTimer = timerQueue.shift()
            timerState.minutes = nextTimer.minutes
            timerState.seconds = nextTimer.seconds
            timerState.isRunning = true
            timerState.isPaused = false

            if (timerInterval) {
                clearInterval(timerInterval)
            }
            timerInterval = setInterval(updateTimer, 1000)

            io.emit('timer:state', timerState)
            io.emit('queue:update', timerQueue)
        }
    })

    socket.on('queue:save', async (queue) => {
        timerQueue = queue
        await saveQueueToDB(timerQueue)
    })

    socket.on('queue:load', async () => {
        timerQueue = await loadQueueFromDB()
        socket.emit('queue:loaded', timerQueue)
    })

    socket.on('disconnect', () => {
        console.log('Client disconnected')
    })
})

app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/dist', 'index.html'))
})

server.listen(port, () => {
    console.log('Server running on port ' + port)
})