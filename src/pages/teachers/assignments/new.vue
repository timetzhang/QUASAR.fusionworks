<template>
  <div>
    <div class="text-h5" style="margin-bottom:10px">
      <q-icon name="create" />
      新作业
    </div>
    <div class="text-h6">
      课程
    </div>
    <q-select outlined v-model="selectedCourse" :options="courses" />

    <div class="text-h6" style="margin-top:20px">
      布置到以下班级
    </div>
    <div class="q-gutter-xs">
      <q-select
        outlined
        v-model="selectedDepartment"
        label="系"
        :options="departments"
      />
      <q-select
        outlined
        v-model="selectedYear"
        :options="years"
        label="入学年份"
        @input="inputYear"
      />

      <q-select
        outlined
        v-model="selectedClasses"
        multiple
        :options="classes"
        label="班级(多选)"
        ref="class"
        clearable
        :rules="[
          val => (!!val && JSON.stringify(val) != '[]') || '班级不能为空'
        ]"
      />
    </div>
    <div class="text-h6">
      作业标题
    </div>
    <q-input
      ref="name"
      outlined
      v-model="assignment.name"
      :rules="[val => !!val || '标题不能为空']"
    />
    <div class="text-h6">
      作业内容
    </div>
    <q-field :error="errorDetails" no-error-icon>
      <RichEditor v-model="assignment.details" />
    </q-field>
    <div class="text-h6">
      截止日期
    </div>
    <div class="row">
      <div>
        <q-input
          ref="date"
          v-model="assignment.deadline.date"
          type="date"
          hint="日期"
          :rules="[val => !!val || '日期不能为空']"
        />
      </div>
      <div style="margin-left: 20px">
        <q-input
          ref="time"
          v-model="assignment.deadline.time"
          type="time"
          hint="时间"
          :rules="[val => !!val || '时间不能为空']"
        />
      </div>
    </div>
    <div style="text-align:center; margin:20px 0">
      <q-btn-group>
        <q-btn
          size="16px"
          label="返  回"
          icon="keyboard_arrow_left"
          @click="$router.back()"
        />
        <q-separator inset vertical />
        <q-btn size="16px" label="提  交" icon="done" @click="validate" />
      </q-btn-group>
    </div>
  </div>
</template>
<script>
import dbAssignments from "controller/dbAssignments";
import dbCourses from "controller/dbCourses";
import dbClasses from "controller/dbClasses";

import Dialog from "components/dialog";
import RichEditor from "components/richEditor";

export default {
  name: "assignmentNew",
  components: {
    RichEditor
  },
  data() {
    return {
      departments: [],
      selectedDepartment: {},

      courses: [],
      selectedCourse: {},

      years: [],
      selectedYear: {},

      classes: [],
      selectedClasses: null,

      errorDetails: false,

      assignment: {
        courseId: null,
        classId: null,
        name: "",
        details: "",
        deadline: {
          date: "",
          time: ""
        }
      }
    };
  },
  async mounted() {
    this.initCourses();
    this.initDepartments();
    this.initYears();
    this.initClasses();
    this.initDeadline();
  },
  methods: {
    initCourses() {
      //Init: Courses for options
      var courses = JSON.parse(localStorage.getItem("user")).courses;
      courses.forEach(item => {
        this.courses.push({
          value: item.id,
          label: item.name
        });
      });
      this.selectedCourse = this.courses[0];
    },
    initDepartments() {
      var departments = JSON.parse(localStorage.getItem("user")).departments;

      departments.forEach(item => {
        this.departments.push({
          value: item.id,
          label: item.name
        });
      });
      this.selectedDepartment = this.departments[0];
    },
    initYears() {
      var year = new Date().getFullYear();
      this.years = [year - 4, year - 3, year - 2, year - 1, year];
      this.selectedYear = this.years[1];
    },
    inputYear() {
      this.selectedClasses = [];
      this.initClasses();
    },
    async initClasses() {
      var classes = await dbClasses.classes({
        departmentId: this.selectedDepartment.value,
        year: this.selectedYear.toString()
      });
      this.classes = [];
      classes.forEach(item => {
        this.classes.push({
          value: item.id,
          label: item.name
        });
      });
    },
    initDeadline() {
      var week = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 7);
      this.assignment.deadline = {
        date: week.toJSON().substr(0, 10),
        time: "00:00"
      };
    },

    validateDetails() {
      if (this.assignment.details) {
        this.errorDetails = false;
        return true;
      } else {
        this.errorDetails = true;
        return false;
      }
    },
    validate() {
      if (
        this.$refs.name.validate() &&
        this.$refs.class.validate() &&
        this.validateDetails() &&
        this.$refs.date.validate() &&
        this.$refs.time.validate()
      ) {
        this.$q
          .dialog({
            component: Dialog,
            title: "Success",
            name: "确认",
            text: "是否提交当前的修改?",
            cancel: true
          })
          .onOk(res => {
            this.submit();
          });
      }
    },

    async submit() {
      this.selectedClasses.forEach(async item => {
        let data = {
          courseId: this.selectedCourse.value,
          classId: item.value,
          name: this.assignment.name,
          details: this.assignment.details,
          deadline:
            this.assignment.deadline.date + " " + this.assignment.deadline.time,
          userId: JSON.parse(localStorage.getItem("user")).id
        };
        let result = await dbAssignments.createAssignment(data);
        if (result.id) {
          this.$router.push({ name: "teacherAssignmentsTodo" });
        }
      });
    }
  }
};
</script>
