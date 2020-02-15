<template>
  <div>
    <q-pull-to-refresh @refresh="refresh">
      <div class="text-h5">成绩统计</div>
      <div style="margin-top:10px"></div>
      <div class="text-subtitle2" style="line-height: 2.3rem;">请选择系:</div>
      <q-tabs
        class="text-black bg-grey-2"
        indicator-color="primary"
        v-if="$q.screen.gt.xs"
        v-model="selectedDepartment.value"
        align="left"
      >
        <q-tab
          v-for="(item, index) in departments"
          :key="index"
          :name="item.value"
          :label="item.label"
        />
      </q-tabs>
      <q-btn-dropdown
        auto-close
        v-if="$q.screen.lt.sm"
        :label="selectedCourse.label"
      >
        <q-list>
          <q-item
            v-for="(item, index) in departments"
            :key="index"
            @click="selectedDepartments = item"
            clickable
            v-close-popup
          >
            <q-item-section>
              <q-item-label>{{ item.label }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <div class="text-subtitle2" style="line-height: 2.3rem;">请选择科目:</div>
      <q-tabs
        class="text-black bg-grey-2"
        indicator-color="primary"
        v-if="$q.screen.gt.xs"
        v-model="selectedCourse.value"
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
      <div class="text-subtitle2" style="line-height: 2.3rem;">请选择班级:</div>
      <q-tabs
        indicator-color="primary"
        class="text-black bg-grey-2"
        v-if="!$q.screen.lt.sm"
        v-model="selectedYear.value"
        align="left"
        @input="yearSelected"
      >
        <q-tab
          v-for="(item, index) in years"
          :key="index"
          :name="item.value"
          :label="item.label"
        />
      </q-tabs>
      <q-btn-dropdown
        auto-close
        v-if="$q.screen.lt.sm"
        :label="selectedYear.label"
        @input="yearSelected"
      >
        <q-list>
          <q-item
            v-for="(item, index) in years"
            :key="index"
            @click="selectedYear = item"
            clickable
            v-close-popup
          >
            <q-item-section>
              <q-item-label>{{ item.label }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <q-table
        separator="horizontal"
        :dense="$q.screen.lt.md"
        :data="classes"
        :columns="columns"
        row-key="id"
        virtual-scroll
        no-data-label="没有找到任何班级"
        :filter="tableFilter"
        :pagination.sync="pagination"
        rows-per-page-label="每页显示"
        flat
      >
        <template v-slot:top-right>
          <q-input
            borderless
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
          <q-tr :props="props">
            <q-td key="name" :props="props">
              <div class="text-weight-bold">
                {{ props.row.name }}
              </div>
            </q-td>
            <q-td key="functions" :props="props">
              <q-btn
                label="统计"
                icon="dns"
                dense
                @click="statis(props.row.id, props.row.name)"
              />
            </q-td>
          </q-tr>
        </template>
        <template v-slot:no-data="{ icon, message }">
          <div class="full-width row flex-center text-primary q-gutter-sm">
            <q-icon size="2em" name="sentiment_dissatisfied" />
            <span>{{ message }}</span>
          </div>
        </template>
      </q-table>
    </q-pull-to-refresh>
    <q-dialog v-model="dialogScore" maximized>
      <q-card class="bg-primary text-white">
        <q-bar>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section class="q-pt-none">
          <q-table
            :title="selectedClass + ' 《' + selectedCourse.label + '》成绩统计'"
            :data="scores"
            :columns="columnsScores"
            row-key="username"
            :pagination.sync="pagination"
            rows-per-page-label="每页显示"
          >
          </q-table>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import dbWorks from "controller/dbWorks";
import dbClasses from "controller/dbClasses";
import dbUserClasses from "controller/dbUserClasses";
import dbAssignments from "controller/dbAssignments";
import dbStatis from "controller/dbStatis";
import login from "utils/login";
import { QSpinnerGears } from "quasar";
import Dialog from "components/dialog";

export default {
  name: "works",

  components: {},

  data() {
    return {
      user: {},

      selectedCourse: {},
      courses: [],
      selectedDepartment: {},
      departments: [],
      selectedYear: {},
      years: [],
      selectedClass: "",
      classes: [],

      tableFilter: "",
      pagination: {
        sortBy: "desc",
        descending: false,
        page: 1,
        rowsPerPage: 100
        // rowsNumber: xx if getting data from a server
      },
      columns: [
        {
          name: "name",
          align: "left",
          label: "班级",
          field: item => item.name,
          classes: "bg-grey-2 ellipsis",
          headerClasses: "bg-grey-3"
        },
        {
          name: "functions",
          headerClasses: "bg-grey-3",
          required: false
        }
      ],

      dialogScore: false,
      scores: [],
      columnsScores: []
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
      this.init();
      done();
    },
    async init() {
      this.user = JSON.parse(localStorage.getItem("user"));
      //Init: 通过课程过滤作业
      this.initCourses();
      this.initDepartments();
      this.initYears();
    },

    initCourses() {
      this.courses = [];
      this.user.courses.forEach(item => {
        this.courses.push({
          value: item.id,
          label: item.name
        });
      });
      this.selectedCourse = this.courses[0];
    },
    initDepartments() {
      this.departments = [];
      this.user.departments.forEach(item => {
        this.departments.push({
          value: item.id,
          label: item.name
        });
      });
      this.selectedDepartment = this.departments[0];
    },
    initYears() {
      //判断是否是下半年
      const now = new Date();
      const year = now.getFullYear();
      if (now.getMonth() + 1 > 9) {
        this.years = [
          { value: year - 3, label: year - 3 + "级(四年级)" },
          { value: year - 2, label: year - 2 + "级(三年级)" },
          { value: year - 1, label: year - 1 + "级(二年级)" },
          { value: year, label: year + "级(一年级)" }
        ];
      } else {
        this.years = [
          { value: year - 4, label: year - 4 + "级(四年级)" },
          { value: year - 3, label: year - 3 + "级(三年级)" },
          { value: year - 2, label: year - 2 + "级(二年级)" },
          { value: year - 1, label: year - 1 + "级(一年级)" }
        ];
      }
    },
    async yearSelected() {
      const data = await dbClasses.classes({
        departmentId: this.selectedDepartment.value,
        year: this.selectedYear.value.toString()
      });
      this.classes = data;
    },

    async statis(classId, classname) {
      /* Loading begins */
      this.$q.loading.show({
        spinner: QSpinnerGears,
        message: "正在载入数据，请稍后..."
      });
      /* End of Loading */

      this.selectedClass = classname;

      const statis = await dbStatis.StudentAssignmentsStatis({
        classId: classId,
        courseId: this.selectedCourse.value,
        userId: this.user.id
      });

      //建立表格
      //准备表头

      var heads = [];
      this.columnsScores = [];
      statis.forEach(item => {
        if (!heads[item.name]) {
          heads[item.name] = [];
        }
        heads[item.name].push(1);
      });

      this.columnsScores.push({
        name: "name",
        label: "姓名",
        align: "left",
        field: row => row.name,
        sortable: true,
        headerClasses: "bg-grey-5",
        classes: "bg-grey-3"
      });

      Object.keys(heads).forEach(item => {
        this.columnsScores.push({
          name: item,
          align: "center",
          label: item,
          field: item,
          sortable: true,
          headerClasses: "bg-grey-3"
        });
      });

      this.columnsScores.push({
        name: "average",
        align: "center",
        label: "平均分",
        field: "average",
        sortable: true,
        headerClasses: "bg-grey-3"
      });

      this.columnsScores.push({
        name: "summary",
        align: "center",
        label: "总分",
        field: "summary",
        sortable: true,
        headerClasses: "bg-grey-3"
      });

      //对statis进行整理
      var rows = [];
      this.scores = [];
      statis.forEach(item => {
        if (!rows[item.username]) {
          rows[item.username] = [];
        }
        rows[item.username].push({
          [item.name]: item.score
        });
      });

      Object.keys(rows).forEach(item => {
        let data = {
          name: item
        };
        let summary = 0;
        rows[item].forEach(el => {
          summary += parseInt(Object.values(el));
          data[Object.keys(el)] = Object.values(el);
        });
        data.summary = summary;
        data.average = summary / Object.keys(heads).length;
        this.scores.push(data);
      });

      this.dialogScore = true;

      /* Loading finished */
      this.$q.loading.hide();
    }
  }
};
</script>
