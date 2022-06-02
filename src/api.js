const API_KEY = '96c59cb0f935b4ce170eca18cca65ec9d791c07cf8a9c8d8170a3480702de0cd';
const tickersHandlers = new Map(); //{}
const socket = new WebSocket(`wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`);
const AGGREGATE_INDEX = "5";

socket.addEventListener('message', e =>{
    const {TYPE: type, FROMSYMBOL: currency, PRICE: newPrice} = JSON.parse(e.data);
    console.log(newPrice);
    if(type !== AGGREGATE_INDEX  || newPrice === undefined){
        return;
    }
    const handlers = tickersHandlers.get(currency) ?? [];
    handlers.forEach(fn => fn(newPrice))
});

function sendToWebSocket(message){
const stringifieldMessage = JSON.stringify(message);

    if (socket.readyState === WebSocket.OPEN) {
        socket.send(stringifieldMessage);
        return;
    }
    socket.addEventListener(
        'open',
        () => {
            socket.send(stringifieldMessage);
        },
        {once: true}
        );
}

function subscribeToTickerOnWs(ticker){
    sendToWebSocket({
        action: "SubAdd",
        subs: [`5~CCCAGG~${ticker}~USD`]
    });
}

function unsubscribeToTickerOnWs(ticker){
    sendToWebSocket({
        action: "SubRemove",
        subs: [`5~CCCAGG~${ticker}~USD`]
    });
}

export const subscribeToTicker = (ticker, cb) => {
    const subscribers = tickersHandlers.get(ticker) || [];
    tickersHandlers.set(ticker, [...subscribers, cb]);
    subscribeToTickerOnWs(ticker);
};

export const unsubscribeFromTicker = ticker => {
    tickersHandlers.delete(ticker);
    unsubscribeToTickerOnWs(ticker)
};

window.tickers = [...tickersHandlers.keys()].join(',');