const flushPromises = () => new Promise(setTimeout);

export default () => flushPromises().then(flushPromises);
