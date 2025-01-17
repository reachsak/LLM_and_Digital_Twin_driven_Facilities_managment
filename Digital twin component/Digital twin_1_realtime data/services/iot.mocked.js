const SENSORS = {
  "sensor-1": {
    name: "Graduate Studio 410 [511520]",
    description: "",
    groupName: "Level 4",
    location: {
      x: 1.328740119934082,
      y: -38.70051860809326,
      z: 20.999998569488525,
    },
    objectId: 6796,
  },
  // "sensor-8": {
  //   name: "Graduate Studio 430 [511541]",
  //   description: "",
  //   groupName: "Level 4",
  //   location: {
  //     x: 1.7115507125854492,
  //     y: 42.04636001586914,
  //     z: 20.999998569488525,
  //   },
  //   objectId: 6814,
  // },
};

const CHANNELS = {
  temp: {
    name: "Temperature",
    description: "External temperature in degrees Celsius.",
    type: "double",
    unit: "°C",
    min: 18.0,
    max: 28.0,
  },
  co2: {
    name: "CO₂",
    description: "Level of carbon dioxide.",
    type: "double",
    unit: "ppm",
    min: 482.81,
    max: 640.0,
  },
  humidity: {
    name: "Humidity",
    description: "Relative humidity percentage.",
    type: "double",
    unit: "%",
    min: 30.0,
    max: 70.0,
  },
  lightIntensity: {
    name: "Light Intensity",
    description: "Intensity of light in lumens.",
    type: "double",
    unit: "lm",
    min: 100.0,
    max: 2000.0,
  },
};

async function getSensors() {
  return SENSORS;
}

async function getChannels() {
  return CHANNELS;
}

async function getSamples(timerange, resolution = 32) {
  return {
    count: resolution,
    timestamps: generateTimestamps(timerange.start, timerange.end, resolution),
    data: {
      "sensor-1": {
        temp: generateRandomValues(18.0, 28.0, resolution, 1.0),
        co2: generateRandomValues(540.0, 600.0, resolution, 5.0),
      },
      // "sensor-8": {
      //   temp: generateRandomValues(20.0, 24.0, resolution, 1.0),
      //   co2: generateRandomValues(600.0, 640.0, resolution, 5.0),
      // },
    },
  };
}

function generateTimestamps(start, end, count) {
  const delta = Math.floor((end.getTime() - start.getTime()) / (count - 1));
  const timestamps = [];
  for (let i = 0; i < count; i++) {
    timestamps.push(new Date(start.getTime() + i * delta));
  }
  return timestamps;
}

function generateRandomValues(min, max, count, maxDelta) {
  const values = [];
  let lastValue = min + Math.random() * (max - min);
  for (let i = 0; i < count; i++) {
    values.push(lastValue);
    lastValue += (Math.random() - 0.5) * 2.0 * maxDelta;
    if (lastValue > max) {
      lastValue = max;
    }
    if (lastValue < min) {
      lastValue = min;
    }
  }
  return values;
}

module.exports = {
  getSensors,
  getChannels,
  getSamples,
};
