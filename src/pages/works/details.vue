<template>
  <div>
    <div class="row">
      <div class="col-md-6 col-xs-12">
        <q-item>
          <q-item-section>
            <div class="text-overline text-orange-9">
              {{ work.assignment.course.name }} 课程
            </div>
            <q-item-label class="text-h5">{{ work.name }}</q-item-label>
            <q-item-label caption>
              于 {{ $datetime.getTimeleft(work.createdAt) }} 前发布
            </q-item-label>
          </q-item-section>
        </q-item>
      </div>
      <div class="col-md-6 col-xs-12">
        <q-item align="right" style="margin-top:20px">
          <q-space />
          <q-item-section>
            <q-item-label class="text-h6">{{ work.user.name }}</q-item-label>
            <q-item-label caption>
              {{ work.user.sign }}
            </q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-avatar>
              <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
            </q-avatar>
          </q-item-section>
          <q-item-section side>
            <q-btn color="accent" label="关注ta"></q-btn>
          </q-item-section>
        </q-item>
      </div>
    </div>
    <div class="text-grey" style="margin-top:20px;line-height: 1.4rem">
      <q-btn-group flat>
        <q-btn size="12px" icon="touch_app" :label="work.clicks"></q-btn>
        <q-separator inset vertical />
        <q-btn size="12px" icon="thumb_up" :label="work.likes"></q-btn>
        <q-separator inset vertical />
        <q-btn size="12px" icon="star" :label="work.favs"></q-btn>
      </q-btn-group>
    </div>
    <div
      class="q-pa-md"
      v-html="work.details"
      style="margin-top:-10px;line-height: 1.4rem"
    ></div>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <div>
        <q-btn
          fab
          :color="work.userLiked ? 'blue' : 'grey'"
          icon="thumb_up_alt"
          :label="likeLabel"
          @click="toggleLikeWork"
          :disable="likeDisable"
        >
          <q-tooltip content-class="bg-accent" :offset="[10, 10]">
            推荐!
          </q-tooltip>
        </q-btn>
      </div>
      <div style="margin-top: 10px;">
        <q-btn
          fab
          :color="work.userFaved ? 'red' : 'grey'"
          icon="star"
          :label="favLabel"
          @click="toggleFavWork"
          :disable="favDisable"
        >
          <q-tooltip content-class="bg-accent" :offset="[10, 10]">
            收藏!
          </q-tooltip>
        </q-btn>
      </div>
      <div style="margin-top: 10px;">
        <q-btn fab color="grey" icon="keyboard_arrow_up" @click="goTop">
          <q-tooltip content-class="bg-accent" :offset="[10, 10]">
            回到顶部
          </q-tooltip>
        </q-btn>
      </div>
    </q-page-sticky>
  </div>
</template>

<script>
import dbWorks from "controller/dbWorks";
import login from "utils/login";
import { QSpinnerGears } from "quasar";
// @ is an alias to /src
export default {
  name: "home",
  data() {
    return {
      likeDisable: false,
      likeLabel: "",
      favDisable: false,
      favLabel: "",
      work: {
        user: {
          id: 0,
          name: "",
          sign: ""
        },
        userLiked: false,
        likes: 0,
        userFaved: false,
        favs: 0,
        rate: 0,
        assignment: {
          course: {
            name
          }
        }
      }
    };
  },
  async mounted() {
    this.init();
  },
  methods: {
    goTop() {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    },
    refresh(done) {
      done();
    },
    async init() {
      /* Loading begins */
      this.$q.loading.show({
        spinner: QSpinnerGears,
        message: "正在载入数据，请稍后..."
      });
      /* End of Loading */

      //如果登录了，创建用户浏览记录
      if (login.check()) {
        var data = await dbWorks.work({
          id: this.$route.params.id,
          userId: JSON.parse(localStorage.getItem("user")).id
        });
      } else {
        var data = await dbWorks.work({
          id: this.$route.params.id
        });
      }
      this.work = data;

      /* Loading finished */
      this.$q.loading.hide();
    },
    async toggleLikeWork() {
      if (!login.check()) {
        this.$q.notify({
          message: "只能登录后才能推荐该作业. 是否登录？",
          icon: "warning",
          classes: "notify",
          actions: [
            {
              label: "是 YES",
              handler: () => {
                this.$router.push({ name: "login" });
              }
            },
            {
              label: "否 NO",
              color: "white",
              handler: () => {}
            }
          ]
        });
      } else {
        /* Loading begins */
        this.$q.loading.show({
          spinner: QSpinnerGears,
          message: "正在载入数据，请稍后..."
        });
        /* End of Loading */

        const data = await dbWorks.toggleLikeWork({
          workId: this.$route.params.id,
          userId: JSON.parse(localStorage.getItem("user")).id
        });

        if (data.result == "-1") {
          this.work.userLiked = false;
          this.work.likes--;
        } else {
          this.work.userLiked = true;
          this.work.likes++;
        }

        //3秒之后才能再一次按
        //防止不停的点击
        this.likeDisable = true;
        this.likeLabel = this.work.likes;
        setTimeout(() => {
          this.likeDisable = false;
          this.likeLabel = "";
        }, 5000);

        /* Loading finished */
        this.$q.loading.hide();
      }
    },
    async toggleFavWork() {
      if (!login.check()) {
        this.$q.notify({
          message: "只能登录后才能收藏该作业. 是否登录？",
          icon: "warning",
          classes: "notify",
          actions: [
            {
              label: "是 YES",
              handler: () => {
                this.$router.push({ name: "login" });
              }
            },
            {
              label: "否 NO",
              color: "white",
              handler: () => {}
            }
          ]
        });
      } else {
        /* Loading begins */
        this.$q.loading.show({
          spinner: QSpinnerGears,
          message: "正在载入数据，请稍后..."
        });
        /* End of Loading */

        const data = await dbWorks.toggleFavWork({
          workId: this.$route.params.id,
          userId: JSON.parse(localStorage.getItem("user")).id
        });

        if (data.result == "-1") {
          this.work.userFaved = false;
          this.work.favs--;
        } else {
          this.work.userFaved = true;
          this.work.favs++;
        }

        //3秒之后才能再一次按
        //防止不停的点击
        this.favDisable = true;
        setTimeout(() => {
          this.favDisable = false;
        }, 5000);

        /* Loading finished */
        this.$q.loading.hide();
      }
    }
  }
};
</script>
<style lang="sass">
.notify
  button
    font-weight: bold
</style>
