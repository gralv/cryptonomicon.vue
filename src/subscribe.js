let worker = new SharedWorker("/api.js",
    {
    type:'module',
    name: 'crypto-shared-worker',
});
const tickersHandlers = new Map(); //{}

worker.port.addEventListener("message", e => {
    console.log("script e", e.data);
    const handlers = tickersHandlers.get(e.data.currency) ?? [];
    handlers.forEach(fn => fn(e.data.newPrice))
}, false);
worker.port.start();


// worker.port.close();
export const subscribeToTicker = (ticker, cb) => {
    const subscribers = tickersHandlers.get(ticker) || [];
    tickersHandlers.set(ticker, [...subscribers, cb]);
    console.log("tickersHandlers", tickersHandlers);
    // {'currency': ticker, 'subs': 'subs'}
    worker.port.postMessage({'currency': ticker, 'subs': 'subs'});
};

export const unsubscribeFromTicker = ticker => {
    tickersHandlers.delete(ticker);
    worker.port.postMessage({'currency': ticker, 'subs': 'unsubs'});
    // unsubscribeToTickerOnWs(ticker)
};

// window.tickers = [...tickersHandlers.keys()].join(',');