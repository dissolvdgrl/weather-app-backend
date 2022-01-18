import 'dotenv/config';
import express from 'express';
import fetch from 'node-fetch';
import rateLimit from 'express-rate-limit';
const app = express();
const port = 3000;

const limiter = rateLimit({
    windowMs: 1000, // 1s
    max: 1 // limit each IP address to 1 request per windowMs
});

app.use(limiter); // apply to all requests
app.get('/', (request, response) => response.send('hullabaloo'));

app.get('/api/weather/:city', async(request, response) => {
    const city = request.params.city;
    try {
        const data = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.OWM_API_KEY}`)
        .then(data => data.json());
        response.send(data);
    } catch(error) {
        return response.status(500).json({
            success: false,
            message: error.message
        })
    }
});

app.listen(port, () => console.log('App running at port 3000'));