function generateSensorData() {
    return {
        airQuality: {
            pm25: randomValue(0, 50, 1),
            pm10: randomValue(0, 100, 1),
            co: randomValue(0, 10, 2),
            no2: randomValue(0, 100, 1),
            o3: randomValue(0, 100, 1),
        },
        weather: {
            temperature: randomValue(-10, 40, 1),
            humidity: randomValue(0, 100, 0),
            pressure: randomValue(950, 1050, 0),
            windSpeed: randomValue(0, 20, 1),
            precipitation: randomValue(0, 10, 1),
        },
        energy: {
            consumption: randomValue(0, 10, 2),
            solarGeneration: randomValue(0, 8, 2),
        },
        water: {
            consumption: randomValue(0, 1000, 0),
            pH: randomValue(6, 8, 1),
            turbidity: randomValue(0, 5, 1),
        },
        waste: {
            generalWaste: randomValue(0, 50, 0),
            recycling: randomValue(0, 30, 0),
            compost: randomValue(0, 20, 0),
        },
    };
}

function randomValue(min, max, decimals) {
    return (Math.random() * (max - min) + min).toFixed(decimals);
}

module.exports = { generateSensorData };
