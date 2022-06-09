const API_KEY = '96c59cb0f935b4ce170eca18cca65ec9d791c07cf8a9c8d8170a3480702de0cd';
const AGGREGATE_INDEX = "5";
const INVALID_SUB = "500";
// const HEARTBEAT = "999";
// const subsOnWS = {'subs':'subscribeToTickerOnWs', 'unsubs':'unsubscribeToTickerOnWs'};

let connected = false;

self.addEventListener(
    "connect",
    (e) => {

        console.log("start");
        const socket = new WebSocket(`wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`);
        let tickersHandlers = []; //{}

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

        function subscribeToTickerOnWs(ticker) {
            const subscribers = tickersHandlers.includes(ticker);
            console.log("api.tickersHandlers", tickersHandlers)
            if (!subscribers) {
                tickersHandlers.push(ticker);
                sendToWebSocket({
                    action: "SubAdd",
                    subs: [`5~CCCAGG~${ticker}~USD`]
                });
            }
        }

        function unsubscribeToTickerOnWs(ticker){
            tickersHandlers = tickersHandlers.filter((e)=>{return e !== ticker})
            sendToWebSocket({
                action: "SubRemove",
                subs: [`5~CCCAGG~${ticker}~USD`]
            });
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
            console.log("e.source.postMessage - newPrice", newPrice);
            // {'currency': currency, 'newPrice': newPrice}
            e.source.postMessage({'currency': currency, 'newPrice': newPrice});
        });

        e.source.addEventListener(
            "message",
            (ev) => {
                //console.log("ev.data", ev.data);
                if (ev.data) {
                    console.log("ev.data", ev.data);
                    //отправляем сокету задание
                    if(ev.data.subs === 'subs')
                        subscribeToTickerOnWs(ev.data.currency);
                    if(ev.data.subs === 'unsubs')
                        unsubscribeToTickerOnWs(ev.data.currency);
                }
            },
            false
        );

        e.source.start();
    },
    false
);





