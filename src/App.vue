<template>
  <div class="container mx-auto flex flex-col items-center bg-gray-100 p-4">
    <div class="container">
      <div class="w-full my-4"></div>
      <section>
        <div class="flex">
          <div class="max-w-xs">
            <label for="wallet" class="block text-sm font-medium text-gray-700"
            >Тикер {{ticker}}</label >
            <div class="box-decoration-slice mt-1 relative rounded-md shadow-md ">
              <input
                      v-on:keyup = "addPrompt"
                      v-model="ticker"
                      v-on:keydown.enter="add"
                      type="text"
                      name="wallet"
                      id="wallet"
                      @focus="walletFocus = true"
                      @blur="walletFocus = false"
                      class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
                      placeholder="Например DOGE"
              />
            </div>
            <tamplate v-if="coinPrompts.length>0 && this.ticker">
            <div :class="[(coinPrompts.length===4)?' justify-between ':' flex-row space-x-1 ']" class="flex box-decoration-clone px-3 py-1 relative w-full bg-white border-1 rounded-sm shadow-sm text-xs">
              <input v-for="cp of coinPrompts" v-bind:value="cp" v-bind:key ="cp" v-on:click.stop="selectPrompts(cp)" type="button" class="px-2 pb-[2px] bg-gray-300 rounded-md cursor-pointer hover:bg-purple-400"/>
            </div>
            </tamplate>
            <div v-if="hasTickers" class="text-xs text-red-500">
              Такой тикер уже добавлен
            </div>
          </div>
        </div>
        <button
                v-on:click="add"
                type="button"
                class="my-4 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          <!-- Heroicon name: solid/mail-->
          <svg
                  class="-ml-0.5 mr-2 h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="#ffffff"
          >
            <path
                    d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
            ></path>
          </svg>
          Добавить
        </button>
      </section>
<tamplate v-if="tickers.length>0">
      <hr class="w-full border-t border-gray-600 my-4" />
  <div>
    <button
            v-if="page>1"
            v-on:click="page = page-1"
            class="my-4 mx-2 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
      Назад</button>
    <button
            v-if="hasNextPage"
            v-on:click="page = page+1"
            class="my-4 mx-2 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
      Вперед</button>
    <div>Фильтр: <input v-model="filter"/></div>
  </div>
      <hr class="w-full border-t border-gray-600 my-4" />
      <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div
                v-for="t of paginatedTickers"
                v-bind:key ="t"
                v-on:click="select(t)"
                v-bind:class="{ 'border-4': selectedTicker===t }"
                class="bg-white overflow-hidden shadow rounded-lg border-purple-800 border-solid cursor-pointer"
        >
          <div class="px-4 py-5 sm:p-6 text-center">
            <dt class="text-sm font-medium text-gray-500 truncate">
              {{t.name}} - USD
            </dt>
            <dd class="mt-1 text-3xl font-semibold text-gray-900">
              {{formatPrice(t.price)}}
            </dd>
          </div>
          <div class="w-full border-t border-gray-200"></div>
          <button
                  v-on:click.stop="handleDelete(t)"
                  class="flex items-center justify-center font-medium w-full bg-gray-100 px-4 py-4 sm:px-6 text-md text-gray-500 hover:text-gray-600 hover:bg-gray-200 hover:opacity-20 transition-all focus:outline-none"
          >
            <svg
                    class="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="#718096"
                    aria-hidden="true"
            >
              <path
                      fill-rule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clip-rule="evenodd"
              ></path></svg>Удалить
          </button>
        </div>
      </dl>
</tamplate>
      <hr class="w-full border-t border-gray-600 my-4" />
      <section v-if="selectedTicker" class="relative" >
        <h3 class="text-lg leading-6 font-medium text-gray-900 my-8">
          {{selectedTicker.name}} - USD
        </h3>
        <div class="flex items-end border-gray-600 border-b border-l h-64">
          <div
                  v-for="(bar, idx) in normalizedGraph"
                  v-bind:key="idx"
                  v-bind:style="{height:`${bar}%`}"
                  class="bg-purple-800 border w-10"
          ></div>
        </div>
        <button
                v-on:click="selectedTicker = null"
                type="button"
                class="absolute top-0 right-0"
        >
          <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  xmlns:svgjs="http://svgjs.com/svgjs"
                  version="1.1"
                  width="30"
                  height="30"
                  x="0"
                  y="0"
                  viewBox="0 0 511.76 511.76"
                  style="enable-background:new 0 0 512 512"
                  xml:space="preserve"
          >
          <g>
            <path
                    d="M436.896,74.869c-99.84-99.819-262.208-99.819-362.048,0c-99.797,99.819-99.797,262.229,0,362.048    c49.92,49.899,115.477,74.837,181.035,74.837s131.093-24.939,181.013-74.837C536.715,337.099,536.715,174.688,436.896,74.869z     M361.461,331.317c8.341,8.341,8.341,21.824,0,30.165c-4.16,4.16-9.621,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251    l-75.413-75.435l-75.392,75.413c-4.181,4.16-9.643,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251    c-8.341-8.341-8.341-21.845,0-30.165l75.392-75.413l-75.413-75.413c-8.341-8.341-8.341-21.845,0-30.165    c8.32-8.341,21.824-8.341,30.165,0l75.413,75.413l75.413-75.413c8.341-8.341,21.824-8.341,30.165,0    c8.341,8.32,8.341,21.824,0,30.165l-75.413,75.413L361.461,331.317z"
                    fill="#718096"
                    data-original="#000000"
            ></path>
          </g>
        </svg>
        </button>
      </section>
    </div>
  </div>

</template>

<script>
  // наличие состояний зависимых данных 5+
  // запросы напрямую внутри компонента - 5
  // при удалении остается подписка на загрузку тикера - 5
  // обработка ошибок API - 5
  // количество запросов - 4
  // при удалении тикера не изменяется LocalStorage - 4
  // одинаковый код в Watch - 3
  // localStorage и анонимные вкладки - 3
  // график не ограничен по ширине 2
  // магические строки и числа 1
  // сильная связность логики и данных которые влияют на отображение

  // график сломан если везде одинаковые значения - исправлено все значения приведены к одному числу
  // при удалени графика остается выбор
import {subscribeToTicker, unsubscribeFromTicker} from "./api";

  export default {
  name: "App",
  data(){
    return {
      ticker: "",
      filter: '',

      tickers: [],
      selectedTicker: null,

      graph:[],

      coinList:[],
      coinPrompts:[],
      walletFocus: false,
      hasTickers: false,

      page: 1,
    }
  },
  created(){
    const windowData = Object.fromEntries([...new URL(window.location).searchParams.entries()]);

    const VALID_KEYS = ['filter', 'page'];

    VALID_KEYS.forEach(key=>{
      if(windowData[key]){
        this[key] = windowData[key];
      }
    });
    // if(windowData.filter){
    //   this.filter = windowData.filter
    // }
    //
    // if(windowData.page){
    //   this.page = windowData.page
    // }

    const tickersData = localStorage.getItem('cryptonomicon-list')

    if(tickersData){
      this.tickers = JSON.parse(tickersData);
      this.tickers.forEach(ticker => {
        subscribeToTicker(ticker.name, newPrice => this.updateTicker(ticker.name, newPrice));
      })
    }
    setInterval(this.updateTickers, 50000000000)
  },
  mounted(){
    (async ()=>{
      const response = await fetch('https://min-api.cryptocompare.com/data/all/coinlist?summary=true')
      if (response.ok){
        const data = await response.json();
        this.coinList.push(new Map(Object.entries(data.Data)));
      }
    })()
  },
  watch: {

    selectedTicker(){
      this.graph = [];
    },

    tickers(newValue, oldValue){
      //console.log(newValue === oldValue)
      localStorage.setItem('cryptonomicon-list', JSON.stringify(this.tickers));
    },

    paginatedTickers(){
      //console.log('paginatedTickers',this.tickers.length)
      if(this.paginatedTickers.length === 0 && this.page > 1){
        this.page -=1
      }
    },

    filter(){
      this.page = 1;
      // const currentURL = new URL(window.location)
      //const {protocol, host, pathname} = window.location
    },

    pageStateOptions(value){
      window.history.pushState(null, document.title, `${window.location.pathname}?filter=${value.filter}&page=${value.page}`);
    }
  //   // при каждом изменении `ticker` эта функция будет запускаться
//    ticker() {
//       this.hasTickers = false;
//       if(this.coinList.length){
//         this.coinPrompts = []
// // console.log(this.coinList[0]['42'])toLocaleLowerCase()
//         for(let coin of this.coinList[0]) {
//           let smbl = String(coin[0]).toLocaleLowerCase()
//
//           //console.log(typeof smbl)
//           if(smbl.includes(this.ticker.toLocaleLowerCase())) {
//             this.coinPrompts.push(coin[0])
//           }
//           if(this.coinPrompts.length===4) break
//         }
//       }else{
//         (async ()=>{
//           const response = await fetch('https://min-api.cryptocompare.com/data/all/coinlist?summary=true')
//           if (response.ok){
//             const data = await response.json();
//             this.coinList.push(new Map(Object.entries(data.Data)));
//           }
//         })()
//       }
//     }
  },
  computed: {
    startIndex(){
      return (this.page - 1) * 6;
    },

    endIndex(){
      return this.page * 6;
    },

    filteredTickers() {
      return this.tickers.filter(ticker => ticker.name.toLocaleLowerCase().includes(this.filter.toLocaleLowerCase()));
    },

    paginatedTickers(){
      return this.filteredTickers.slice(this.startIndex, this.endIndex)
    },

    hasNextPage(){
      return this.filteredTickers.length > this.endIndex;
    },

    normalizedGraph(){
      const maxValue = Math.max(...this.graph)
      const minValue = Math.min(...this.graph)
      if(maxValue === minValue){
        return this.graph.map(()=>50)
      }
      return this.graph.map(
              price=>5+((price-minValue)*95)/(maxValue-minValue)
      )
    },

    pageStateOptions(){
      return {
        filter: this.filter,
        page: this.page,
      }
    },
  },
  methods:{
    updateTicker(tickerName, price){
      this.tickers
              .filter(t=>t.name === tickerName)
              .forEach(t=>{
                if(t === this.selectedTicker){
                  this.graph.push(price)
                }
                t.price = price;
              });
  },
    formatPrice(price){
      if(price === '-') return price;
      return price>1?price.toFixed(4):price.toPrecision(4)
    },
    // async updateTickers(){
      // if(!this.tickers.length){
      //   return;
      // }
      //   // const exchangeData = await loadTickers(this.tickers.map(t => t.name));
      //   this.tickers.forEach(ticker => {
      //     const price = exchangeData[ticker.name.toUpperCase()];
      //     ticker.price = price ?? '-';
      //   });

    // },

    add(){
      if(this.hasTicker(this.ticker)){
        //console.log("add",this.hasTickers)
        this.hasTickers = true;
        return;
      }
      const currentTicker = {
        name:this.ticker,
        price:"-"
      };
      this.tickers = [...this.tickers, currentTicker];
      this.ticker = "";
      this.filter = "";
      subscribeToTicker(currentTicker.name, newPrice => this.updateTicker(currentTicker.name, newPrice))
    },

    select(curTicker){
      this.selectedTicker = curTicker;
    },

    handleDelete(tickerToRemove){
      // this.tickers.forEach((tick, index)=>{
      //   if(tick.name == name){
      //     this.tickers.splice(index, 1)
      //   }
      // })
      this.tickers = this.tickers.filter(t => t !== tickerToRemove);
      if(this.selectedTicker === tickerToRemove){
        this.selectedTicker = null;
      }
      unsubscribeFromTicker(tickerToRemove.name)
    },



    addPrompt(e){
      if(e.code === "Enter"){
        return;
      }
      this.hasTickers = false;
      if(this.coinList.length){
        this.coinPrompts = []
// console.log(this.coinList[0]['42'])toLocaleLowerCase()
        for(let coin of this.coinList[0]) {
          let smbl = String(coin[0]).toLocaleLowerCase()

          //console.log(typeof smbl)
          if(smbl.includes(this.ticker.toLocaleLowerCase())) {
            this.coinPrompts.push(coin[0])
          }
          if(this.coinPrompts.length===4) break
        }
      }
    },

    selectPrompts(coinPrompt){

      if(!this.hasTicker(coinPrompt)){
        this.ticker = coinPrompt;
        this.add()
      }
    },
    hasTicker(newTick){
      let has = false;
      this.tickers.forEach((tick)=>{
        if(tick.name.toLocaleLowerCase() === newTick.toLocaleLowerCase()){
          has = true;
        }
      });
      this.hasTickers = has;
      return has;
    }
    // selAdd(currentTicker){
    //   if(this.tickers.includes(currentTicker)) {
    //     this.sel = currentTicker
    //   }
    //   console.log(this.sel)
    // }
  }
};
</script>

<style>

</style>
