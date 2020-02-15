<template>
  <div ref="scrollTargetRef">
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

// @ is an alias to /src
export default {
  name: "home",
  components: {
    discoverCard
  },
  data() {
    return {
      curPageNum: 0,
      works: []
    };
  },
  async mounted() {},
  methods: {
    refresh(done) {
      done();
    },
    async loadMore() {
      var data = await dbWorks.works({
        pagenum: this.curPageNum,
        pagesize: 3
      });

      if (data.length > 0) {
        data.forEach(item => {
          item.details.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/, function(
            match,
            capture
          ) {
            if (capture) {
              item.image = capture;
            } else {
              item.image = "https://cdn.quasar.dev/img/parallax2.jpg";
            }
          });
          this.works.push(item);
        });
      }
    },
    load(index, done) {
      this.curPageNum++;
      this.loadMore();
      done();
    }
  }
};
</script>
