<template>
  <div class="q-pa-md">
    <q-pull-to-refresh @refresh="refresh">
      <div class="text-h5" style="margin-bottom:10px">
        <q-icon name="star" /> 收藏的作业
      </div>

      <div class="text-subtitle" style="line-height: 2.3rem">
        按科目过滤:
      </div>
      <q-tabs
        class="text-black bg-grey-2"
        indicator-color="primary"
        v-if="!$q.screen.lt.sm"
        v-model="selectedCourse.value"
        @input="filterWorks"
        align="left"
      >
        <q-tab
          v-for="(item, index) in courses"
          :key="index"
          :name="item.value"
          :label="item.label"
        />
      </q-tabs>
      <q-btn-dropdown
        auto-close
        v-if="$q.screen.lt.sm"
        :label="selectedCourse.label"
        @input="filterWorks"
      >
        <q-list>
          <q-item
            v-for="(item, index) in courses"
            :key="index"
            @click="selectedCourse = item"
            clickable
            v-close-popup
          >
            <q-item-section>
              <q-item-label>{{ item.label }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>

      <q-infinite-scroll
        @load="load"
        :offset="250"
        debounce="500"
        style="margin-top: 10px"
      >
        <div
          class="row"
          :class="$q.platform.is.mobile ? 'q-col-gutter-sm' : 'q-col-gutter-lg'"
        >
          <div
            class="col-3 col-md-3 col-sm-4 col-xs-12"
            v-for="(item, index) in workFavs"
            :key="index"
          >
            <discoverCard
              :image="item.work.image"
              :user="item.work.user.name"
              :date="$datetime.getTimeleft(item.updatedAt)"
              :course="item.work.assignment.course.name"
              :title="item.work.name"
              :details="item.work.details"
              @click="$router.push('/works/' + item.work.id)"
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
import { QSpinnerGears } from "quasar";

export default {
  name: "fav",

  components: {
    discoverCard
  },

  data() {
    return {
      pageNum: 1,
      pageSize: 10,
      courses: [],
      selectedCourse: {
        label: "所有",
        value: 0
      },
      workFavs: [],
      workFavsFiltered: [
        {
          id: "",
          createdAt: "",

          work: {
            id: "",
            name: "",
            assignment: {
              name: "",
              course: {
                name: ""
              }
            }
          }
        }
      ],
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
    async refresh(done) {
      await this.init();
      done();
    },
    async init() {
      /* Loading begins */
      this.$q.loading.show({
        spinner: QSpinnerGears,
        message: "正在载入数据，请稍后..."
      });
      /* End of Loading */

      this.user = JSON.parse(localStorage.getItem("user"));

      let data = await dbWorks.userWorkFavs({
        userId: this.user.id,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      });

      if (data.length > 0) {
        //将第一张图片提取出来
        data.forEach(item => {
          item.work.details.replace(
            /<img [^>]*src=['"]([^'"]+)[^>]*>/,
            function(match, capture) {
              if (capture) {
                item.work.image = capture;
              } else {
                item.work.image = "https://cdn.quasar.dev/img/parallax2.jpg";
              }
            }
          );

          this.workFavs.push(item);
        });
      } else {
        this.workFavs = [];
      }

      //将所有 works 显示
      this.workFavsFiltered = this.workFavs;

      //查询 Works 里有哪一些 Courses, 用来做 Course Filter
      var groups = [];
      this.workFavs.forEach(item => {
        const group = item.work.assignment.course.name;
        groups[group] = item.work.assignment.course.id;
      });
      this.courses = [];
      this.courses.push({
        value: 0,
        label: "所有"
      });
      Object.keys(groups).forEach((item, index) => {
        this.courses.push({
          value: Object.values(groups)[index],
          label: item
        });
      });

      /* Loading finished */
      this.$q.loading.hide();
    },
    filterWorks() {
      this.workFavsFiltered = this.workFavs.filter(item => {
        return item.work.assignment.course.id
          .toString()
          .match(this.selectedCourse == 0 ? /[0-9]/ : this.selectedCourse);
      });
    },
    load(index, done) {
      //this.pagenum++;
      done();
    }
  }
};
</script>
