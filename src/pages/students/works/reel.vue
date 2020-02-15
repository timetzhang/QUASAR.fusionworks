<template>
  <div>
    <q-pull-to-refresh @refresh="refresh"> </q-pull-to-refresh>
  </div>
</template>

<script>
import dbWorks from "controller/dbWorks";
import login from "utils/login";
import { QSpinnerGears } from "quasar";

export default {
  name: "reel",

  components: {},

  data() {
    return {
      works: [],
      worksFiltered: [
        {
          id: "",
          name: "",
          score: 0,
          createdAt: "",
          updatedAt: "",
          assignment: {
            name: "",
            course: {
              name: ""
            }
          },
          workstate: {
            id: 0,
            name: ""
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

      let data = await dbWorks.studentWorks({
        userId: this.user.id
      });
      if (data.length > 0) {
        this.works = data;
      } else {
        this.works = [];
      }

      //将所有 works 显示
      this.worksFiltered = this.works;

      //查询 Works 里有哪一些 Courses, 用来做 Course Filter
      var groups = [];
      this.works.forEach(item => {
        const group = item.assignment.course.name;
        groups[group] = item.assignment.course.id;
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
      this.worksFiltered = this.works.filter(item => {
        return item.assignment.course.id
          .toString()
          .match(this.selectedCourse == 0 ? /[0-9]/ : this.selectedCourse);
      });
    },
    edit(id) {
      this.$router.push({
        name: "studentWorkEdit",
        params: { id: id }
      });
    }
  }
};
</script>
