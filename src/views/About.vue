<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      app
      clipped
    >
      <v-list dense>
        <v-list-item
          v-for="item in items"
          :key="item.text"
          click=""
        >
        <v-list-item class="link" v-on:click="home">
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
              <v-list-item-title v-text="item.text"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        </v-list-item>
        <v-subheader class="mt-4 grey--text text--darken-1">Stocks</v-subheader>
        <v-list>
          <v-list-item
            v-for="item in stock"
            :key="item.name"
            click=""
          >
           <router-link class="link" :to="'/stock/' + item.name">
              <v-list-item-avatar>
                <img
                  src="@/assets/gräddadpankaka.jpg"
                  alt=""
                >
              </v-list-item-avatar>
              <v-list-item-title v-text="item.name"></v-list-item-title>
            </router-link>
          </v-list-item>
        </v-list>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      clipped-left
      color="red"
      dense
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-icon class="mx-4">fab fa-youtube</v-icon>
      <v-toolbar-title class="mr-12 align-center">
        <span class="title">Pancake Stocks</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-row
        align="center"
        style="max-width: 350px"
      >
      <span style="margin-right: 5px;">Pancake Batter:</span>
      <span>{{ this.currency }}$</span>
      <v-spacer></v-spacer>
      <span style="margin-right: 40px;" v-if="isLoggedIn"> <span @click="logout">Logout</span></span>
      </v-row>
    </v-app-bar>

    <v-content>
      <v-container class="fill-height">
        <trend
            :data="this.map"
            :gradient="['#ec008c', '#dd5e89', '#fc6767']"
            auto-draw
            smooth
          >
          </trend>
          <v-row justify="center" align="center">
          <div class="true" v-if="color">
            <v-icon tag="span" color="green">mdi-arrow-up</v-icon>
            <span class="text-size">{{ currentprice }} $</span>
          </div>
          <div class="fail" v-else>
            <v-icon  tag="span" color="red">mdi-arrow-down</v-icon>
            <span class="text-size">{{ currentprice }} $</span>
          </div>
          </v-row>
        <v-row justify="center" align="center">
            <v-card>
              <v-card-title><h4>Recent Activity</h4></v-card-title>
              <v-divider></v-divider>
                <v-simple-table class="padding">
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-left">Stock</th>
                        <th class="text-left">Amount</th>
                        <th class="text-left">Price</th>
                        <th class="text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in trades" :key="item._id">
                        <td>{{ item.company }}</td>
                        <td>{{ item.amount }}</td>
                        <td>{{ item.price }}</td>
                        <td>{{ item.status }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
            </v-card>
            <v-card class="margin">
              <v-card-title><h4>Trade</h4></v-card-title>
              <v-divider></v-divider>
                <form class="padding">
                <v-select
                  v-model="select"
                  :items="buysell"
                  label="Item"
                  required
                  @change="$v.select.$touch()"
                  @blur="$v.select.$touch()"
                ></v-select>
                <v-select
                  :items="items"
                  disabled=""
                  :label="this.lastURLSegment"
                ></v-select>
                <v-text-field
                  v-model="currentprice"
                  label="Current Price"
                  required
                  disabled
                  @input="$v.name.$touch()"
                  @blur="$v.name.$touch()"
                ></v-text-field>
                <v-text-field
                  v-model="amount"
                  label="Amount"
                  required
                  @input="$v.name.$touch()"
                  @blur="$v.name.$touch()"
                ></v-text-field>
                <v-btn class="mr-4" @click="tradeStocks">Trade</v-btn>
              </form>
            </v-card>
            <v-card class="margintwo">
              <v-card-title><h4>Stocks</h4></v-card-title>
              <v-divider></v-divider>
                <div class="padding">
                  <span>{{ this.lastURLSegment }}: {{ this.currentstocks }}
                </div>
            </v-card>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import axios from 'axios';
import io from 'socket.io-client';

export default {
  props: {
    source: String,
  },
  watch: {
    // call again the method if the route changes
    '$route': ['getStocks', 'getMap']
  },
  computed : {
    isLoggedIn : function(){ return this.$store.getters.isLoggedIn}
  },
  sockets: {
    connect: function () {
      
    },
    getAllOnline(tokenFromServer) {
      let dre = []
      const pageURL = decodeURI(window.location.href);
      const lastURLSegment = pageURL.substr(pageURL.lastIndexOf('/') + 1);
      for(let i = 0; i < tokenFromServer.length; i++) {
        if(tokenFromServer[i].company == lastURLSegment) {
          dre.push(tokenFromServer[i].value)
        }
      }

      if(dre[dre.length-1] > dre[dre.length-2]) {
          this.color = true;
      } else {
          this.color = false;
      }
      this.map = dre;
      this.currentprice = dre[dre.length-1];
    }
  },
  methods: {
    home() {
      this.$router.go('/stocks')
    },
    stocks() {
      axios.get('https://project-backend.jhellberg.me/stock/companys/')
      .then((response) => {
        this.stock = response.data.res;
      });
    },
    getValue() {
      axios.post('https://project-backend.jhellberg.me/money/get/', {
        email: this.email
      })
      .then((response) => {
        this.currency = response.data[0].amount;
      });
    },
    logout: function () {
      this.$store.dispatch('logout')
      .then(() => {
        this.$router.go('/login')
      })
    },
    getStocks() {
      const pageURL = decodeURI(window.location.href);
      this.lastURLSegment = pageURL.substr(pageURL.lastIndexOf('/') + 1);
      axios.post('https://project-backend.jhellberg.me/stock/get', {
        email: this.email,
        company: this.lastURLSegment
      })
      .then((response) => {
        this.trades = response.data.res;
      });
    },
    getMap() {
      const pageURL = decodeURI(window.location.href);
      this.lastURLSegment = pageURL.substr(pageURL.lastIndexOf('/') + 1);
      axios.post('https://project-backend.jhellberg.me/stock/get/map/', {
        company: this.lastURLSegment
      })
      .then((response) => {
        this.map = response.data.res;
        this.currentprice = response.data.value;
        this.color = response.data.state;
      });
    },
    getUserStocks() {
      const pageURL = decodeURI(window.location.href);
      this.lastURLSegment = pageURL.substr(pageURL.lastIndexOf('/') + 1);
      axios.post('https://project-backend.jhellberg.me/stock/amount', {
        email: this.email,
        company: this.lastURLSegment
      })
      .then((response) => {
        this.currentstocks = response.data.amount;
      });
    },
    tradeStocks() {
      if(this.select == "Buy") {
        axios.post('https://project-backend.jhellberg.me/stock/buy/', {
          email: this.email,
          company: this.lastURLSegment,
          amount: this.amount,
          price: this.currentprice
        }).then((response) => {
          alert(JSON.stringify(response))
          if(response.data.status == "true") {
            this.getStocks();
            this.getValue();
          } else {
            alert("Need more Pancake Batter to buy this stock/stocks")
          }
        });
      } else if (this.select == "Sell") {
        axios.post('https://project-backend.jhellberg.me/stock/sell/', {
          email: this.email,
          company: this.lastURLSegment,
          amount: this.amount,
          price: this.currentprice
        }).then(() => {
          this.getStocks();
          this.getValue();
        });
      }
    },
  },
  mounted() {
    if (localStorage.getItem('email')) {
      this.email = localStorage.getItem('email');
    }
    this.getValue();
  },
  created () {
    this.$vuetify.theme.dark = true;
    this.stocks();
    this.getStocks();
    this.getMap();
    this.getUserStocks();
    this.socket = io('https://stock-server.jhellberg.me');
    this.socket.emit('getAllOnline')
  },
  beforeRouteLeave () {
        this.getStocks();
  },
  data: () => ({
    drawer: null,
    email: "",
    stock: "",
    trades: [],
    currency: 0,
    lastURLSegment: "",
    currentprice: 20,
    amount: 0,
    select: "Buy",
    map: [],
    currentstocks: 0,
    color: true,
    buysell: [
      "Buy",
      "Sell"
    ],
    items: [
      { icon: 'mdi-home', text: 'Home' },
    ],
  }),
 }

</script>

<style scoped>
  .link {
    color: white;
    text-decoration: none;
    display: unset;
    width: 100%;
  }

  .v-list-item__title {
    display: unset;
  }

  .v-list-item__content {
    display: unset;
  }
  .padding {
    padding: 10px;
  }

  .margin {
    left: 50px;
  }

  .margintwo {
    left: 100px;
  }

  .true {
    color: #4CAF50;
  }

  .fail {
    color: #F44336;
  }

  .text-size {
    font-size: 24pt;
  }

  @media only screen and (max-width: 600px) {
  .margin {
    left: 0px;
    right: 0px;
    margin-top: 50px;
    margin-bottom: 50px;
  }

  .margintwo {
    left: 0px;
    right: 0px;
    margin-top: 50px;
    margin-bottom: 50px;
  }
}
</style>