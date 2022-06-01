const API_KEY = '96c59cb0f935b4ce170eca18cca65ec9d791c07cf8a9c8d8170a3480702de0cd';
const tickersHandlers = new Map(); //{}

export const loadTickers = () => {
    // eslint-disable-next-line no-debugger
    //debugger;
    if(tickersHandlers.size === 0){
        return;
    }
    fetch(`https://min-api.cryptocompare.com/data/pricemulti?tsyms=USD&fsyms=${[...tickersHandlers.keys()].join(',')}&api_key=${API_KEY}`)
        .then(r => r.json())
            .then(rawData => {
                const updatedPrices = Object.fromEntries(
                Object.entries(rawData).map(([key, value]) => [key, value.USD])
                );

                Object.entries(updatedPrices).forEach(([currency, newPrice]) => {
                    const handlers = tickersHandlers.get(currency) ?? [];
                    handlers.forEach(fn => fn(newPrice))
                });
            });
} ;

export const subscribeToTicker = (ticker, cb) => {
    const subscribers = tickersHandlers.get(ticker) || [];
    tickersHandlers.set(ticker, [...subscribers, cb])
}

export const unsubscribeFromTicker = ticker => {
    tickersHandlers.delete(ticker)
}

setInterval(loadTickers, 5000);
window.tickers = [...tickersHandlers.keys()].join(',');