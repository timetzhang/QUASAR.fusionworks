<template>
  <div>
    <q-pull-to-refresh @refresh="refresh">
      <div class="text-h5" style="margin-bottom:10px">
        <q-icon name="assignment_turned_in" />
        已完成的作业
        <q-badge align="middle" color="green">
          {{ works.length }}
        </q-badge>
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

      <div style="margin-top:10px"></div>
      <q-table
        separator="horizontal"
        :dense="$q.screen.lt.md"
        :data="worksFiltered"
        :columns="columns"
        row-key="id"
        virtual-scroll
        no-data-label="没有作业"
        :filter="tableFilter"
        :pagination.sync="pagination"
        rows-per-page-label="每页显示"
      >
        <template v-slot:top-left
          ><div class="text-h6">
            <q-icon name="alarm" />
            已经完成的作业
          </div>
        </template>
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
          <q-tr :props="props" @click="$router.push('/works/' + props.row.id)">
            <q-td key="name" :props="props">
              <div>
                <q-badge color="grey">{{
                  props.row.assignment.course.name
                }}</q-badge>
              </div>
              {{ props.row.name }}
              <div>
                <q-badge color="grey"
                  >作业： {{ props.row.assignment.name }}</q-badge
                >
              </div>
            </q-td>
            <q-td key="createdAt" :props="props">{{
              $datetime.formatDate(props.row.createdAt).date
            }}</q-td>
            <q-td key="score" :props="props">{{ props.row.score }}</q-td>
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
import dbWorks from "controller/dbWorks";
import login from "utils/login";
import { QSpinnerGears } from "quasar";

export default {
  name: "assignmentsDone",

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
          name: "createdAt",
          align: "center",
          label: "完成时间",
          field: item => item.createdAt,
          headerClasses: "bg-grey-3"
        },
        {
          name: "score",
          align: "center",
          label: "分数",
          field: item => item.score,
          headerClasses: "bg-grey-3"
        }
      ],
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

      let data = await dbWorks.studentWorks({
        userId: this.user.id,
        workstateId: 2
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
          .match(
            this.selectedCourse.value == 0 ? /[0-9]/ : this.selectedCourse.value
          );
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
