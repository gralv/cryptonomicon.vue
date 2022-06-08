const API_KEY = '96c59cb0f935b4ce170eca18cca65ec9d791c07cf8a9c8d8170a3480702de0cd';
const socket = new WebSocket(`wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`);
const AGGREGATE_INDEX = "5";
const INVALID_SUB = "500";
const HEARTBEAT = "999";
const subsOnWS = {'subs':'subscribeToTickerOnWs', 'unsubs':'unsubscribeToTickerOnWs'};

self.addEventListener(
    "connect",
    (e) => {
        e.source.addEventListener(
            "message",
            (ev) => {
                //console.log("ev.data", ev.data);
                if (ev.data) {
                    console.log("ev.data", ev.data);
                    //отправляем сокету задание
                    /*subscribeToTickerOnWs(ev.data.currency)*/
                    //subscribeToTickerOnWs(ev.data)
                    if(ev.data.subs === 'subs')
                        subscribeToTickerOnWs(ev.data.currency)
                    if(ev.data.subs === 'unsubs')
                        unsubscribeToTickerOnWs(ev.data.currency)
                    //window[subsOnWS[ev.data.subs]](ev.data.currency);
                    //e.source.postMessage("newPrice");
                }

                socket.addEventListener("message", (es) => {
                    let {
                        TYPE: type,
                        FROMSYMBOL: currency,
                        PRICE: newPrice,
                        PARAMETER: param,
                    } = JSON.parse(es.data);

                    if (type === INVALID_SUB && param !== undefined) {
                        currency = param.split("~")[2];
                        newPrice = 0;
                    } else if (type !== AGGREGATE_INDEX || newPrice === undefined) {
                        return;
                    }
                    //console.log("newPrice2", newPrice);
                    // {'currency': currency, 'newPrice': newPrice}
                    e.source.postMessage({'currency': currency, 'newPrice': newPrice});
                });

            },
            false
        );

        e.source.start();
    },
    false
);

function sendToWebSocket(message){
const stringifieldMessage = JSON.stringify(message);
// console.log("redyStati", WebSocket.close)
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



