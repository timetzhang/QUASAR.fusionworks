<template>
  <div class="q-pa-md">
    <q-pull-to-refresh @refresh="refresh">
      <div class="text-h5" style="margin-bottom:10px">
        <q-icon name="verified_user" /> 我获得的成就
      </div>
    </q-pull-to-refresh>
  </div>
</template>

<script>
import dbWorks from "controller/dbWorks";
import login from "utils/login";
import { QSpinnerGears } from "quasar";

export default {
  name: "medals",

  components: {},

  data() {
    return {
      pagenum: 1,
      pagesize: 10,
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
        pagenum: this.pagenum,
        pagesize: this.pagesize
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
