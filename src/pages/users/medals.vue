<template>
  <div>
    <div class="text-h5" style="margin-bottom:10px">
      <q-icon name="verified_user" /> 我获得的成就
    </div>
    <div class="row q-col-gutter-sm">
      <div class="col-lg-3 col-sm-4 col-xs-6" v-for="(item, index) in medals">
        <q-card class="my-card">
          <q-card-section class="text-center" style="height:120px">
            <img
              :class="item.archieved ? 'animated flip' : ''"
              :src="item.image"
              style="max-width:100px;"
              :style="item.archieved ? '' : 'filter:grayscale(1)'"
            />
          </q-card-section>
          <q-card-section>
            <div class="text-subtitle1 text-center">{{ item.name }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <q-dialog v-model="dialog"
      ><q-card class="q-dialog-plugin">
        <q-bar>
          <div>祝贺</div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section>
          <div class="text-subtitle2 text-center text-grey-5">
            获得了新的成就
          </div>
        </q-card-section>
        <q-card-section>
          <div class="text-h6 text-center">
            {{ newMedals[newMedals.length - 1].name }}
          </div>
        </q-card-section>
        <q-card-section class="text-center">
          <q-img
            :src="newMedals[newMedals.length - 1].image"
            spinner-color="white"
            style="max-width:100px;"
          ></q-img>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            label="是的"
            color="primary"
            v-close-popup
            @click="showMedal"
          />
        </q-card-actions> </q-card
    ></q-dialog>
  </div>
</template>

<script>
import dbMedals from "controller/dbMedals";
import dbUserMedals from "controller/dbUserMedals";
import login from "utils/login";
import { QSpinnerGears } from "quasar";
import gql from "graphql-tag";
export default {
  name: "medals",

  components: {},

  data() {
    return {
      newMedals: [
        {
          name: "",
          image: ""
        }
      ],
      dialog: false,
      medals: [],
      user: {}
    };
  },
  async mounted() {
    if (!login.check()) {
      this.$router.push({ name: "login" });
      return;
    } else {
      this.init();
    }
  },
  methods: {
    async init() {
      /* Loading begins */
      this.$q.loading.show({
        spinner: QSpinnerGears,
        message: "正在载入数据，请稍后..."
      });
      /* End of Loading */

      this.user = JSON.parse(localStorage.getItem("user"));

      this.medals = await dbMedals.medals({
        usertypeId: this.user.usertype.id,
        userId: this.user.id
      });

      this.medals.forEach(async item => {
        if (!item.archieved) {
          var res = await this.$http.post(this.$config.graphQLHost, {
            query: item.content,
            variables: {
              userId: this.user.id
            }
          });
          var keys = Object.keys(res.data.data);
          var content = res.data.data[keys[0]];

          var val = eval("()=>{" + item.condition + "}");
          if (val()) {
            const create = await dbUserMedals.createUserMedal({
              userId: this.user.id,
              medalId: item.id
            });
            if (create) {
              //动画
              this.newMedals.push(item);
              this.dialog = true;
            }
          }
        }
      });

      /* Loading finished */
      this.$q.loading.hide();
    },
    showMedal() {
      this.newMedals.forEach(item => {
        item.archieved = true;
      });
    }
  }
};
</script>
