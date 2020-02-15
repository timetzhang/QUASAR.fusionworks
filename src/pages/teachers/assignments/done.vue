<template>
  <div>
    <div class="text-h5" style="margin-bottom:10px">
      <q-icon name="offline_pin" size="31px"> </q-icon> 已经终止的作业
      <q-badge align="middle" color="red">{{ assignments.length }}</q-badge>
    </div>
    <div class="text-subtitle2" style="line-height: 2.3rem;">按科目过滤:</div>
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
    <div class="text-subtitle2" style="line-height: 2.3rem;">按年级过滤:</div>
    <q-tabs
      indicator-color="primary"
      class="text-black bg-grey-2"
      v-if="!$q.screen.lt.sm"
      v-model="selectedYear.value"
      @input="filterAssignments"
      align="left"
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
      @input="filterAssignments"
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
    <div style="margin-top:10px" />
    <q-table
      separator="horizontal"
      :dense="$q.screen.lt.md"
      :data="assignmentsFiltered"
      :columns="columns"
      headerClasses="bg-grey-3"
      row-key="id"
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
        <q-tr :props="props" @click="props.expand = !props.expand">
          <q-td key="name" :props="props">
            <q-badge color="grey">{{ props.row.course.name }}</q-badge>
            <q-space />
            <div class="text-subtitle2 text-weight-bold">
              {{ props.row.name }}
            </div>
          </q-td>
          <q-td key="class" :props="props">
            {{ props.row.class.year }}级
            <q-space />
            <q-badge color="accent">
              {{ props.row.class.name }}
            </q-badge>
          </q-td>
          <q-td key="createdAt" :props="props">{{
            $datetime.formatDate(props.row.createdAt).date
          }}</q-td>
          <q-td key="functions" :props="props">
            <!-- Only show on Desktop -->
            <q-btn-group flat v-if="$q.screen.gt.xs">
              <q-btn
                dense
                icon="view_list"
                label="已交"
                @click="works(props.row.id)"
              />
              <q-btn
                dense
                icon="search"
                label="查看"
                @click="details(props.row.id)"
              />
            </q-btn-group>
            <!-- Only show on large than Small screen -->
            <q-btn
              dense
              flat
              icon="keyboard_arrow_down"
              v-if="$q.screen.lt.sm"
            />
          </q-td>
        </q-tr>
        <!-- Only show on less than SMALL screen -->
        <q-tr v-show="props.expand" :props="props" v-if="$q.screen.lt.sm">
          <q-td colspan="100%">
            <div style="text-align:center; margin:5px 0">
              <q-btn-group>
                <q-btn
                  dense
                  icon="view_list"
                  label="已交"
                  @click="works(props.row.id)"
                />
                <q-btn
                  dense
                  icon="search"
                  label="查看"
                  @click="details(props.row.id)"
                />
              </q-btn-group>
            </div>
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
    <q-dialog
      v-model="dialogDetails"
      transition-show="rotate"
      transition-hide="rotate"
    >
      <q-layout view="Lhh lpR fff" container class="bg-white">
        <q-header class="bg-grey-3 text-black">
          <q-toolbar>
            <q-toolbar-title>{{ assignment.name }}</q-toolbar-title>
            <q-btn flat v-close-popup round dense icon="close" />
          </q-toolbar>
        </q-header>

        <q-page-container>
          <q-page padding v-html="assignment.details"> </q-page>
        </q-page-container>
      </q-layout>
    </q-dialog>
  </div>
</template>
<script>
import dbAssignments from "controller/dbAssignments";
import dbWorks from "controller/dbWorks";
import login from "utils/login";
import { QSpinnerGears } from "quasar";
import Dialog from "components/dialog";

export default {
  name: "teacherAssignmentsTodo",

  components: {},

  data() {
    return {
      dialogDetails: false,

      //用于查看详情
      assignment: {
        name: "",
        details: ""
      },

      selectedCourse: {
        label: "所有",
        value: 0
      },
      courses: [],
      selectedYear: {
        label: "所有",
        value: 0
      },
      years: [],
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
          align: "left",
          label: "作业",
          field: item => item.name,
          classes: "bg-grey-2 ellipsis",
          headerClasses: "bg-grey-3"
        },
        {
          name: "class",
          align: "center",
          label: "班级",
          field: item => item.class.name,
          headerClasses: "bg-grey-3"
        },
        {
          name: "createdAt",
          align: "center",
          label: "发布日期",
          field: "createdAt",
          headerClasses: "bg-grey-3"
        },
        {
          name: "functions",
          headerClasses: "bg-grey-3",
          required: false
        }
      ],

      assignments: [],
      assignmentsFiltered: [
        {
          name: "",
          details: "",
          deadline: "",
          course: {
            name: ""
          },
          class: {
            name: ""
          }
        }
      ],
      user: {
        usertype: {
          id: null,
          name: ""
        }
      }
    };
  },
  async mounted() {
    if (!login.check()) {
      this.$router.push({ name: "login" });
      return;
    } else {
      this.user = JSON.parse(localStorage.getItem("user"));

      this.init();

      //Init: 通过课程过滤作业
      this.initCourses();
      this.initYears();
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

      let data = await dbAssignments.teacherAssignments({
        userId: parseInt(this.user.id),
        active: false
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

      /* Loading finished */
      this.$q.loading.hide();
    },
    initCourses() {
      this.courses = [];
      this.courses.push({
        value: 0,
        label: "所有"
      });
      this.user.courses.forEach(item => {
        this.courses.push({
          value: item.id,
          label: item.name
        });
      });
    },
    initYears() {
      //判断是否是下半年
      const now = new Date();
      const year = now.getFullYear();
      if (now.getMonth() + 1 > 9) {
        this.years = [
          { value: 0, label: "所有" },
          { value: year - 3, label: year - 3 + "级(四年级)" },
          { value: year - 2, label: year - 2 + "级(三年级)" },
          { value: year - 1, label: year - 1 + "级(二年级)" },
          { value: year, label: year + "级(一年级)" }
        ];
      } else {
        this.years = [
          { value: 0, label: "所有" },
          { value: year - 4, label: year - 4 + "级(四年级)" },
          { value: year - 3, label: year - 3 + "级(三年级)" },
          { value: year - 2, label: year - 2 + "级(二年级)" },
          { value: year - 1, label: year - 1 + "级(一年级)" }
        ];
      }
    },
    filterAssignments() {
      this.assignmentsFiltered = this.assignments.filter(item => {
        return (
          item.class.year.match(
            this.selectedYear.value == 0 ? /[0-9]/ : this.selectedYear.value
          ) &&
          item.course.id
            .toString()
            .match(
              this.selectedCourse.value == 0
                ? /[0-9]/
                : this.selectedCourse.value
            )
        );
      });
    },
    works(id) {
      this.$router.push({
        name: "teacherWorks",
        params: { assignmentId: id }
      });
    },
    async details(id) {
      const data = await dbAssignments.assignment({
        id: id
      });
      if (data) {
        this.assignment = data;
        this.dialogDetails = true;
      } else {
        this.$q.notify({
          message: "无法载入作业",
          actions: [{ icon: "close", color: "white" }]
        });
      }
    }
  }
};
</script>
