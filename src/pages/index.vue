<template>
  <div ref="scrollTargetRef">
    <div style="margin-bottom: 10px">
      <q-tabs inline-label v-model="tab" class="bg-grey-2">
        <q-tab name="discover" icon="flight_takeoff" label="发现" />
        <q-tab name="followed" icon="star" label="关注" />
      </q-tabs>
    </div>
    <q-pull-to-refresh @refresh="refresh">
      <q-infinite-scroll @load="load" :offset="250" debounce="500">
        <div
          class="row"
          :class="$q.platform.is.mobile ? 'q-col-gutter-sm' : 'q-col-gutter-lg'"
        >
          <div
            class="col-3 col-md-3 col-sm-4 col-xs-12"
            v-for="(item, index) in works"
            :key="index"
          >
            <discoverCard
              :image="item.image"
              :user="item.user.name"
              :date="$datetime.getTimeleft(item.updatedAt)"
              :course="item.assignment.course.name"
              :title="item.name"
              :details="item.details"
              @click="$router.push('/works/' + item.id)"
            ></discoverCard>
          </div>
        </div>
        <template v-slot:loading>
          <div class="row justify-center q-my-md">
            <q-spinner-dots color="primary" size="40px" />
          </div>
        </template>
      </q-infinite-scroll>
    </q-pull-to-refresh>
  </div>
</template>

<script>
import discoverCard from "components/discoverCard";
import dbWorks from "controller/dbWorks";
import login from "utils/login";

// @ is an alias to /src
export default {
  name: "home",
  components: {
    discoverCard
  },
  data() {
    return {
      tab: "discover",
      pageSize: 10,
      pageNum: 1,
      moreWorks: true,
      works: [],
      worksTemp: []
    };
  },
  watch: {
    tab(val) {
      this.works = [];
      this.pageNum = 1;
      this.init();
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    refresh(done) {
      done();
    },
    async init() {
      if (this.tab == "discover") {
        this.worksTemp = await dbWorks.works({
          pageNum: this.pageNum,
          pageSize: this.pageSize
        });
      }
      if (this.tab == "followed") {
        if (login.check()) {
          this.worksTemp = await dbWorks.followedUserWorks({
            userId: JSON.parse(localStorage.getItem("user")).id,
            pageNum: this.pageNum,
            pageSize: this.pageSize
          });
        } else {
          this.$q.notify({
            message: "您还没有登录，无法查看关注的用户",
            actions: [{ icon: "close", color: "white" }]
          });
          this.tab = "discover";
        }
      }

      if (this.worksTemp.length > 0) {
        this.worksTemp.forEach(item => {
          item.details.replace(
            /<img [^>]*src=['"]([^'"]+)[^>]*>/,
            (match, capture) => {
              if (capture) {
                item.image = capture;
              } else {
                item.image = "https://cdn.quasar.dev/img/parallax2.jpg";
              }
            }
          );
          this.works.push(item);
        });
      } else {
        this.moreWorks = false;
      }
    },
    async load(index, done) {
      if (this.moreWorks) {
        this.init();
        this.pageNum++;
      }
      done();
    }
  }
};
</script>
