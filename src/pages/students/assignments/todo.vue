<template>
  <div>
    <q-pull-to-refresh @refresh="refresh">
      <div class="text-h5" style="margin-bottom:10px">
        <q-icon name="assignment_later" />
        需要完成的作业
        <q-badge align="middle" color="red">
          {{ assignments.length }}
          <q-icon name="warning" color="white" class="q-ml-xs" />
        </q-badge>
      </div>
      <div class="text-subtitle2" style="line-height: 2.3rem;">
        按科目过滤:
      </div>
      <q-tabs
        class="text-black bg-grey-2"
        indicator-color="primary"
        v-if="!$q.screen.lt.sm"
        v-model="selectedCourse.value"
        @input="filterAssignments"
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
        @input="filterAssignments"
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
      <div style="margin-top:10px"></div>
      <q-table
        separator="horizontal"
        :dense="$q.screen.lt.md"
        :data="assignmentsFiltered"
        :columns="columns"
        row-key="index"
        virtual-scroll
        no-data-label="没有作业"
        :filter="tableFilter"
        :pagination.sync="pagination"
        rows-per-page-label="每页显示"
        flat
      >
        <template v-slot:top-right>
          <q-input
            dense
            debounce="300"
            v-model="tableFilter"
            placeholder="搜索关键字"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props" @click="newWork(props.row.id)">
            <q-td key="name" :props="props">
              <div>
                <q-badge color="grey">{{ props.row.course.name }}</q-badge>
              </div>
              {{ props.row.name }}
            </q-td>
            <q-td key="teacher" class="text-center">
              {{ props.row.user.name }}
            </q-td>
            <q-td key="deadline" :props="props" :class="props.row.deadlineColor"
              >{{ $datetime.getTimeleft(props.row.deadline) }}
            </q-td>
          </q-tr>
        </template>
        <template v-slot:no-data="{ icon, message }">
          <div class="full-width row flex-center text-primary q-gutter-sm">
            <q-icon size="2em" name="sentiment_dissatisfied" />
            <span> {{ message }} </span>
          </div>
        </template>
      </q-table>
    </q-pull-to-refresh>
  </div>
</template>

<script>
import dbAssignments from "controller/dbAssignments";
import login from "utils/login";
import { QSpinnerGears } from "quasar";

export default {
  name: "assignmentsTodo",

  components: {},

  data() {
    return {
      selectedCourse: {
        label: "所有",
        value: 0
      },
      courses: [],
      tableFilter: "",
      pagination: {
        sortBy: "desc",
        descending: false,
        page: 1,
        rowsPerPage: 10
        // rowsNumber: xx if getting data from a server
      },
      columns: [
        {
          name: "name",
          required: true,
          label: "作业",
          align: "left",
          field: item => item.name,
          classes: "bg-grey-2 ellipsis",
          headerClasses: "bg-grey-3"
        },
        {
          name: "teacher",
          align: "center",
          label: "授课老师",
          field: item => item.user.name,
          headerClasses: "bg-grey-3"
        },
        {
          name: "deadline",
          align: "center",
          label: "剩余",
          field: "deadline",
          headerClasses: "bg-grey-3"
        }
      ],
      assignments: [],
      assignmentsFiltered: [
        {
          name: "",
          deadline: "",
          course: {
            name: ""
          },
          user: {
            name
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
    refresh(done) {
      this.selectedCourse = 0;
      this.init();
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

      //通过学生所在的 ClassId 查询Assignments
      let data = await dbAssignments.studentAssignmentsTodo({
        classId: this.user.classes[0].id,
        userId: this.user.id
      });
      if (data.length > 0) {
        this.assignments = data;
      } else {
        this.assignments = [];
      }

      //将Deadline紧急程度来分类
      const now = new Date();
      this.assignments.forEach(item => {
        //如果只剩下不到3天
        if (item.deadline - 1000 * 60 * 60 * 24 * 3 < now.getTime()) {
          item.deadlineColor = "text-orange";
        }
        //如果已过期
        if (item.deadline < now.getTime()) {
          item.deadlineColor = "text-red";
        }
      });

      //将所有 assignments 显示
      this.assignmentsFiltered = this.assignments;

      //查询 Assignments 里有哪一些 Courses, 用来做 Course Filter
      var groups = [];
      this.assignments.forEach(item => {
        const group = item.course.name;
        groups[group] = item.course.id;
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
    filterAssignments() {
      this.assignmentsFiltered = this.assignments.filter(item => {
        return item.course.id
          .toString()
          .match(
            this.selectedCourse.value == 0 ? /[0-9]/ : this.selectedCourse.value
          );
      });
    },
    newWork(id) {
      this.$router.push({
        name: "studentWorkNew",
        params: { assignmentId: id }
      });
    }
  }
};
</script>
