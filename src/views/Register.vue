<template>
  <v-app id="inspire">
    <v-content>
      <v-container
        class="fill-height"
        fluid
      >
        <v-row
          align="center"
          justify="center"
        >
          <v-col
            cols="12"
            sm="8"
            md="4"
          >
            <v-card class="elevation-12">
              <v-toolbar
                color="primary"
                dark
                flat
              >
                <v-toolbar-title>Register</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <v-form>
                    <v-text-field
                    v-model="firstname"
                    id="firstname"
                    label="Firstname"
                    name="firstname"
                    type="text"
                    ></v-text-field>
                    <v-text-field
                    v-model="lastname"
                    id="lastname"
                    label="Lastname"
                    name="lastname"
                    type="text"
                    ></v-text-field>
                  <v-text-field
                    v-model="email"
                    label="Email"
                    name="email"
                    type="text"
                  ></v-text-field>

                  <v-text-field
                    v-model="password"
                    id="password"
                    label="Password"
                    name="password"
                    type="text"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn v-on:click="register" color="primary">Register</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
  export default {
    props: {
      source: String,
    },
    data: () => ({
        drawer: null,
        email : "",
        password : "",
        firstname: "",
        lastname: ""
    }),
    methods: {
      register: function () {
        let data = {
            name: this.firstname,
            lastname: this.lastname,
            email: this.email,
            password: this.password
        }
        this.$store.dispatch('register', data)
       .then(() => this.$router.push('/stock'))
      }
    }
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