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
        <router-link class="link" :to="{ path: '/stock'}" replace>
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
              <v-list-item-title v-text="item.text"></v-list-item-title>
          </v-list-item-content>
        </router-link>
        </v-list-item>
        <v-subheader class="mt-4 grey--text text--darken-1">Stocks</v-subheader>
        <v-list>
          <v-list-item
            v-for="item in stock"
            :key="item.name"
            click=""
          >
           <router-link class="link" :to="'/stock/' + item.name" :key="$route.fullPath">
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
        <v-row
          justify="center"
          align="center"
        >
          <v-card class="margin">
              <v-card-title><h4>Add Pancake Batter</h4></v-card-title>
              <v-divider></v-divider>
                <form class="padding">
                <v-text-field
                  v-model="this.email"
                  label="Current Price"
                  required
                  disabled
                  @input="$v.name.$touch()"
                  @blur="$v.name.$touch()"
                ></v-text-field>
                <v-text-field
                  v-model="money"
                  label="Amount"
                  required
                  @input="$v.name.$touch()"
                  @blur="$v.name.$touch()"
                ></v-text-field>
                <v-btn class="mr-4" @click="addMoney">Add</v-btn>
              </form>
            </v-card>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    source: String,
  },
  methods: {
    stocks() {
      axios.get('http://localhost:8333/stock/companys/')
      .then((response) => {
        this.stock = response.data.res;
      });
    },
    getValue() {
      axios.post('http://localhost:8333/money/get/', {
        email: this.email
      })
      .then((response) => {
        this.currency = response.data[0].amount;
      });
    },
    logout: function () {
      this.$store.dispatch('logout')
      .then(() => {
        this.$router.push('/login')
      })
    },
    addMoney() {
      axios.post('http://localhost:8333/money/add/', {
        email: this.email,
        money: this.money
      })
      .then((response) => {
        alert(response.data);
      });
      this.getValue();
    },
    
  },
  created () {
    this.$vuetify.theme.dark = true;
    this.stocks();
  },
  data: () => ({
    drawer: null,
    email: "",
    stock: "",
    currency: 0,
    money: 0,
    data: "",
    items: [
      { icon: 'mdi-home', text: 'Home' },
    ],
  }),
  mounted() {
    if (localStorage.getItem('email')) {
      this.email = localStorage.getItem('email');
    }
    this.getValue();
  },
  computed : {
    isLoggedIn : function(){ return this.$store.getters.isLoggedIn}
  },
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
</style>