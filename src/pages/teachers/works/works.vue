<template>
  <div>
    <q-pull-to-refresh @refresh="refresh">
      <q-toolbar>
        <div class="text-h5">{{ assignment.name }}</div>
        <q-space />
        <q-btn-group>
          <q-btn
            dense
            :loading="loadingAssignment"
            icon="search"
            label="查看"
            @click="assignmentDetails"
          ></q-btn>
          <q-btn
            dense
            v-if="assignment.active"
            icon="close"
            label="结束"
            @click="assignmentClose"
          ></q-btn>
        </q-btn-group>
      </q-toolbar>
      <div style="margin-top:10px"></div>
      <q-table
        separator="horizontal"
        :dense="$q.screen.lt.md"
        :data="worksUnscored"
        :columns="columnsUnscored"
        row-key="id"
        virtual-scroll
        no-data-label="没有未评分的作业"
        :filter="tableFilterUnscored"
        :pagination.sync="pagination"
        rows-per-page-label="每页显示"
        flat
      >
        <template v-slot:top-left>
          <div class="text-h6 text-grey-7">
            未评分的作业
            <q-badge color="red">
              {{ worksUnscored.length }}
              <q-icon name="warning" color="white" class="q-ml-xs" />
            </q-badge>
          </div>
        </template>
        <template v-slot:top-right>
          <q-input
            borderless
            dense
            debounce="300"
            v-model="tableFilterUnscored"
            placeholder="搜索关键字"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props" @click="props.expand = !props.expand">
            <q-td key="username" :props="props">
              <div>
                <q-badge color="grey"
                  >{{ props.row.user.name }} ({{
                    props.row.user.gender
                  }})</q-badge
                >
              </div>
              <div class="text-weight-bold">
                {{ props.row.name }}
              </div>
            </q-td>
            <q-td key="cellphone" :props="props">
              {{ props.row.user.cellphone }}
            </q-td>
            <q-td key="createdAt" :props="props">{{
              $datetime.formatDate(props.row.createdAt).full
            }}</q-td>
            <q-td key="functions" :props="props">
              <!-- Only show on Desktop -->
              <q-btn-group flat v-if="$q.screen.gt.xs">
                <q-btn
                  flat
                  :loading="loadingWorkDetails"
                  dense
                  icon="search"
                  label="查看"
                  @click="workDetails(props.row.id)"
                />
                <q-btn dense icon="check_circle" label="评分" flat>
                  <q-popup-edit
                    v-model.score="props.row.score"
                    buttons
                    label-set="保存"
                    label-cancel="取消"
                    @save="scoreWork(props.row.score, props.row.id)"
                    persistent
                  >
                    <q-input
                      type="score"
                      v-model.score="props.row.score"
                      hint="分数只能是 0 到 100 分"
                      :error="errorScore"
                      :error-message="errorMessageScore"
                      dense
                      autofocus
                    />
                  </q-popup-edit>
                </q-btn>
                <q-btn
                  dense
                  icon="highlight_off"
                  label="驳回"
                  @click="confirmRejectWork(props.row.id)"
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
          <q-tr v-show="props.expand" :props="props" v-if="$q.screen.lt.sm">
            <q-td colspan="100%">
              <!-- Only show on less than SMALL screen -->
              <div style="text-align:center; margin:5px 0">
                <q-btn-group>
                  <q-btn
                    flat
                    :loading="loadingWorkDetails"
                    dense
                    icon="search"
                    label="查看"
                    @click="workDetails(props.row.id)"
                  />
                  <q-btn dense icon="check_circle" flat label="评分">
                    <q-popup-edit
                      v-model.score="props.row.score"
                      buttons
                      label-set="保存"
                      label-cancel="取消"
                      @save="scoreWork(props.row.score, props.row.id)"
                      persistent
                    >
                      <q-input
                        type="score"
                        v-model.score="props.row.score"
                        hint="分数只能是 0 到 100 分"
                        :error="errorScore"
                        :error-message="errorMessageScore"
                        dense
                        autofocus
                      />
                    </q-popup-edit>
                  </q-btn>
                  <q-btn
                    flat
                    dense
                    icon="highlight_off"
                    label="驳回"
                    @click="confirmRejectWork(props.row.id)"
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
      <div style="margin-top:20px"></div>
      <q-table
        separator="horizontal"
        :dense="$q.screen.lt.md"
        :data="noWorkStudents"
        :columns="columnsNoWorkStudents"
        row-key="id"
        virtual-scroll
        no-data-label="没有未交作业的学生"
        :filter="tableFilterNoWorkStudents"
        :pagination.sync="pagination"
        rows-per-page-label="每页显示"
        flat
      >
        <template v-slot:top-left>
          <div class="text-h6 text-grey-7">
            未交作业的学生
            <q-badge color="red">
              {{ noWorkStudents.length }}
              <q-icon name="warning" color="white" class="q-ml-xs" />
            </q-badge>
          </div>
        </template>
        <template v-slot:top-right>
          <q-input
            borderless
            dense
            debounce="300"
            v-model="tableFilterNoWorkStudents"
            placeholder="搜索关键字"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props" @click="props.expand = !props.expand">
            <q-td key="username" :props="props">
              <div>
                <b>{{ props.row.user.name }}</b>
              </div>
              <div style="font-style: italic">
                {{ props.row.name }}
              </div>
            </q-td>

            <q-td key="cellphone" :props="props">
              {{ props.row.user.cellphone }}
            </q-td>
            <q-td key="functions" :props="props">
              <q-btn
                flat
                dense
                icon="chat"
                label="提醒"
                @click="sendMessage(props.row.user.id)"
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
      <div style="margin-top:20px"></div>
      <q-table
        separator="horizontal"
        :dense="$q.screen.lt.md"
        :data="worksRejected"
        :columns="columnsRejected"
        row-key="id"
        virtual-scroll
        no-data-label="没有已驳回的作业"
        :filter="tableFilterRejected"
        :pagination.sync="pagination"
        rows-per-page-label="每页显示"
        flat
      >
        <template v-slot:top-left>
          <div class="text-h6 text-grey-7">
            已驳回的作业
            <q-badge color="red">
              {{ worksRejected.length }}
              <q-icon name="warning" color="white" class="q-ml-xs" />
            </q-badge>
          </div>
        </template>
        <template v-slot:top-right>
          <q-input
            borderless
            dense
            debounce="300"
            v-model="tableFilterRejected"
            placeholder="搜索关键字"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props" @click="props.expand = !props.expand">
            <q-td key="username" :props="props">
              <div>
                <q-badge color="grey"
                  >{{ props.row.user.name }} ({{
                    props.row.user.gender
                  }})</q-badge
                >
              </div>
              <div class="text-weight-bold">
                {{ props.row.name }}
              </div>
            </q-td>
            <q-td key="cellphone" :props="props">
              {{ props.row.user.cellphone }}
            </q-td>
            <q-td key="updatedAt" :props="props">{{
              $datetime.formatDate(props.row.updatedAt).date
            }}</q-td>
            <q-td key="functions" :props="props">
              <!-- Only show on Desktop -->
              <q-btn-group flat v-if="$q.screen.gt.xs">
                <q-btn
                  flat
                  :loading="loadingWorkDetails"
                  dense
                  icon="search"
                  label="查看"
                  @click="workDetails(props.row.id)"
                />
                <q-btn dense icon="check_circle" label="评分" flat>
                  <q-popup-edit
                    v-model.score="props.row.score"
                    buttons
                    label-set="保存"
                    label-cancel="取消"
                    @save="scoreWork(props.row.score, props.row.id)"
                    persistent
                  >
                    <q-input
                      type="score"
                      v-model.score="props.row.score"
                      hint="分数只能是 0 到 100 分"
                      :error="errorScore"
                      :error-message="errorMessageScore"
                      dense
                      autofocus
                    />
                  </q-popup-edit>
                </q-btn>
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
          <q-tr v-show="props.expand" :props="props">
            <q-td colspan="100%" v-if="$q.screen.lt.sm">
              <!-- Only show on less than SMALL screen -->
              <div style="text-align:center; margin:5px 0">
                <q-btn-group>
                  <q-btn
                    flat
                    :loading="loadingWorkDetails"
                    dense
                    icon="search"
                    label="查看"
                    @click="workDetails(props.row.id)"
                  />
                  <q-btn dense icon="check_circle" flat label="评分">
                    <q-popup-edit
                      v-model.score="props.row.score"
                      buttons
                      label-set="保存"
                      label-cancel="取消"
                      @save="scoreWork(props.row.score, props.row.id)"
                      persistent
                    >
                      <q-input
                        type="score"
                        v-model.score="props.row.score"
                        hint="分数只能是 0 到 100 分"
                        :error="errorScore"
                        :error-message="errorMessageScore"
                        dense
                        autofocus
                      />
                    </q-popup-edit>
                  </q-btn>
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

      <div style="margin-top:20px"></div>
      <q-table
        separator="horizontal"
        :dense="$q.screen.lt.md"
        :data="worksScored"
        :columns="columnsScored"
        row-key="id"
        virtual-scroll
        no-data-label="没有已评分的作业"
        :filter="tableFilterScored"
        :pagination.sync="pagination"
        rows-per-page-label="每页显示"
        flat
      >
        <template v-slot:top-left>
          <div class="text-h6 text-grey-7">
            已评分的作业
            <q-badge color="green">
              {{ worksScored.length }}
              <q-icon name="check_circle" color="white" class="q-ml-xs" />
            </q-badge>
          </div>
        </template>
        <template v-slot:top-right>
          <q-input
            borderless
            dense
            debounce="300"
            v-model="tableFilterScored"
            placeholder="搜索关键字"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props" @click="props.expand = !props.expand">
            <q-td key="username" :props="props">
              <div>
                <q-badge color="grey"
                  >{{ props.row.user.name }} ({{
                    props.row.user.gender
                  }})</q-badge
                >
              </div>
              <div class="text-weight-bold">
                {{ props.row.name }}
              </div>
            </q-td>
            <q-td key="createdAt" :props="props">{{
              $datetime.formatDate(props.row.createdAt).date
            }}</q-td>
            <q-td key="score" :props="props">{{ props.row.score }}</q-td>
            <q-td key="functions" :props="props">
              <!-- Only show on Desktop -->
              <q-btn-group flat v-if="$q.screen.gt.xs">
                <q-btn
                  flat
                  :loading="loadingWorkDetails"
                  dense
                  icon="search"
                  label="查看"
                  @click="workDetails(props.row.id)"
                />
                <q-btn dense icon="check_circle" label="重评" flat>
                  <q-popup-edit
                    v-model.score="props.row.score"
                    buttons
                    label-set="保存"
                    label-cancel="取消"
                    @save="scoreWork(props.row.score, props.row.id)"
                    persistent
                  >
                    <q-input
                      type="score"
                      v-model.score="props.row.score"
                      hint="分数只能是 0 到 100 分"
                      :error="errorScore"
                      :error-message="errorMessageScore"
                      dense
                      autofocus
                    />
                  </q-popup-edit>
                </q-btn>
                <q-btn
                  dense
                  icon="highlight_off"
                  label="驳回"
                  @click="confirmRejectWork(props.row.id)"
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
          <q-tr v-show="props.expand" :props="props">
            <q-td colspan="100%" v-if="$q.screen.lt.sm">
              <!-- Only show on less than SMALL screen -->
              <div style="text-align:center; margin:5px 0">
                <q-btn-group>
                  <q-btn
                    flat
                    :loading="loadingWorkDetails"
                    dense
                    icon="search"
                    label="查看"
                    @click="workDetails(props.row.id)"
                  />
                  <q-btn dense icon="check_circle" flat label="重评">
                    <q-popup-edit
                      v-model.score="props.row.score"
                      buttons
                      label-set="保存"
                      label-cancel="取消"
                      @save="scoreWork(props.row.score, props.row.id)"
                      persistent
                    >
                      <q-input
                        type="score"
                        v-model.score="props.row.score"
                        hint="分数只能是 0 到 100 分"
                        :error="errorScore"
                        :error-message="errorMessageScore"
                        dense
                        autofocus
                      />
                    </q-popup-edit>
                  </q-btn>
                  <q-btn
                    flat
                    dense
                    icon="highlight_off"
                    label="驳回"
                    @click="confirmRejectWork(props.row.id)"
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
    </q-pull-to-refresh>
    <q-dialog
      v-model="dialogDetails"
      transition-show="rotate"
      transition-hide="rotate"
    >
      <q-layout view="Lhh lpR fff" container class="bg-white">
        <q-header class="bg-grey-3 text-black">
          <q-toolbar>
            <q-toolbar-title>{{ details.name }}</q-toolbar-title>
            <q-btn flat v-close-popup round dense icon="close" />
          </q-toolbar>
        </q-header>

        <q-page-container>
          <q-page padding v-html="details.details"> </q-page>
        </q-page-container>
      </q-layout>
    </q-dialog>
  </div>
</template>
<script>
import dbWorks from "controller/dbWorks";
import dbUserClasses from "controller/dbUserClasses";
import dbAssignments from "controller/dbAssignments";
import dbUserMessages from "controller/dbUserMessages";
import login from "utils/login";
import { QSpinnerGears } from "quasar";
import Dialog from "components/dialog";

export default {
  name: "works",

  components: {},

  data() {
    return {
      dialogDetails: false,
      loadingAssignment: false,
      loadingWorkDetails: false,
      details: {},

      //此作业的相关信息
      assignment: {
        id: 0,
        name: "",
        deadline: "",
        details: "",
        active: null,
        course: {
          name: ""
        },
        class: {
          year: 0,
          name: ""
        }
      },
      titleExpanded: false,

      errorMessageScore: "分数只能是 0 到 100 分",
      errorScore: false,

      //已评分的作业数据
      worksScored: [],
      //已驳回的作业数据
      worksRejected: [],
      //未评分的作业数据
      worksUnscored: [],
      //未交作业的学生数据
      noWorkStudents: [],
      //已经交作业的学生Array
      doWorkStudents: [],

      tableFilterUnscored: "",
      tableFilterScored: "",
      tableFilterRejected: "",
      tableFilterNoWorkStudents: "",

      pagination: {
        sortBy: "desc",
        descending: false,
        page: 1,
        rowsPerPage: 10
        // rowsNumber: xx if getting data from a server
      },
      columnsUnscored: [
        {
          name: "username",
          align: "left",
          label: "学生",
          field: item => item.user.name,
          classes: "bg-grey-2 ellipsis",
          headerClasses: "bg-grey-3"
        },
        {
          name: "cellphone",
          align: "center",
          label: "手机号码",
          field: item => item.user.cellphone,
          headerClasses: "bg-grey-3"
        },
        {
          name: "createdAt",
          align: "center",
          label: "上交时间",
          field: item => item.createdAt,
          headerClasses: "bg-grey-3"
        },
        {
          name: "functions",
          headerClasses: "bg-grey-3",
          required: false
        }
      ],
      columnsRejected: [
        {
          name: "username",
          align: "left",
          label: "学生",
          field: item => item.user.name,
          classes: "bg-grey-2 ellipsis",
          headerClasses: "bg-grey-3"
        },
        {
          name: "cellphone",
          align: "center",
          label: "手机号码",
          field: item => item.user.cellphone,
          headerClasses: "bg-grey-3"
        },
        {
          name: "updatedAt",
          align: "center",
          label: "修改时间",
          field: item => item.updatedAt,
          headerClasses: "bg-grey-3"
        },
        {
          name: "functions",
          headerClasses: "bg-grey-3",
          required: false
        }
      ],
      columnsScored: [
        {
          name: "username",
          align: "left",
          label: "学生",
          field: item => item.user.name,
          classes: "bg-grey-2 ellipsis",
          headerClasses: "bg-grey-3"
        },
        {
          name: "createdAt",
          align: "center",
          label: "上交时间",
          field: item => item.createdAt,
          headerClasses: "bg-grey-3"
        },
        {
          name: "score",
          align: "center",
          label: "分数",
          field: item => item.score,
          headerClasses: "bg-grey-3"
        },
        {
          name: "functions",
          headerClasses: "bg-grey-3",
          required: false
        }
      ],
      columnsNoWorkStudents: [
        {
          name: "username",
          align: "left",
          label: "学生",
          field: item => item.user.name,
          classes: "bg-grey-2 ellipsis",
          headerClasses: "bg-grey-3"
        },
        {
          name: "cellphone",
          align: "center",
          label: "手机号码",
          field: item => item.user.cellphone,
          headerClasses: "bg-grey-3"
        },
        {
          name: "functions",
          headerClasses: "bg-grey-3",
          required: false
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
      this.init();
    }
  },
  methods: {
    refresh(done) {
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

      const assignmentData = await dbAssignments.assignmentNoDetails({
        id: this.$route.params.assignmentId
      });
      if (assignmentData) {
        this.assignment = assignmentData;
      }

      this.worksUnscored = [];
      this.worksScored = [];
      this.worksRejected = [];

      var data = await dbWorks.teacherWorksNoDetails({
        assignmentId: this.$route.params.assignmentId.toString()
      });

      data.forEach(item => {
        if (item.workstate.id == 1) {
          this.worksUnscored.push(item);
        }
        if (item.workstate.id == 2) {
          this.worksScored.push(item);
        }
        if (item.workstate.id == 3) {
          this.worksRejected.push(item);
        }
        this.doWorkStudents.push(item.user.id);
      });

      //查询没有上交作业的学生

      this.noWorkStudents = await dbUserClasses.usersUnsubmitWork({
        userIds: "[" + this.doWorkStudents.toString() + "]",
        classId: this.assignment.class.id
      });

      /* Loading finished */
      this.$q.loading.hide();
    },
    // 将 work 评分
    // score: 分数
    // id: work id
    async scoreWork(score, id) {
      if (score > 100 || score < 0 || isNaN(score)) {
        this.errorScore = true;
        return false;
      } else {
        this.errorScore = false;
        let data = await dbWorks.updateWork({
          id: id,
          score: parseFloat(score),
          workstateId: 2
        });
      }
      this.init();
    },
    confirmRejectWork(id) {
      this.$q
        .dialog({
          component: Dialog,
          title: "Confirm",
          name: "请确认",
          text: "是否确认驳回该学生的作业?",
          cancel: true
        })
        .onOk(res => {
          this.rejectWork(id);
        });
    },
    async rejectWork(id) {
      var data = await dbWorks.updateWork({
        id: id,
        workstateId: 3
      });
      this.init();
    },

    async assignmentDetails(id) {
      this.loadingAssignment = true;

      const data = await dbAssignments.assignment({
        id: this.$route.params.assignmentId
      });

      this.loadingAssignment = false;

      if (data) {
        this.details = data;
        this.dialogDetails = true;
      } else {
        this.$q.notify({
          message: "无法载入作业",
          actions: [{ icon: "close", color: "white" }]
        });
      }
    },
    async assignmentClose(id) {
      var text = "终止作业以后，学生将无法再提交作业，是否确认?";
      if (this.noWorkStudents.length) {
        text =
          "还有 <b class='text-h5'>" +
          this.noWorkStudents.length +
          "</b> 名学生没有交作业，终止作业以后，学生将无法再提交作业，是否确认?";
      }
      this.$q
        .dialog({
          component: Dialog,
          title: "Confirm",
          name: "请确认",
          text: text,
          cancel: true
        })
        .onOk(async res => {
          const result = await dbAssignments.deactiveAssignment({
            id: this.$route.params.assignmentId
          });
          if (result.result) {
            var timer = setTimeout(() => {
              this.$router.push({ name: "teacherAssignmentsTodo" });
            }, 3000);

            this.$q.notify({
              message: "作业终止成功! 3秒后返回作业列表",
              actions: [
                {
                  icon: "done",
                  color: "white",
                  handler: () => {
                    clearInterval(timer);
                    this.$router.push({ name: "teacherAssignmentsTodo" });
                  }
                }
              ]
            });
          }
        });
    },
    async workDetails(id) {
      this.loadingWorkDetails = true;

      const data = await dbWorks.work({
        id: id,
        userId: this.user.id
      });

      this.loadingWorkDetails = false;

      if (data) {
        this.details = data;
        this.dialogDetails = true;
      } else {
        this.$q.notify({
          message: "无法载入作业",
          actions: [{ icon: "close", color: "white" }]
        });
      }
    },
    //发送交作业提醒
    async sendMessage(studentId) {
      const data = await dbUserMessages.createUserMessage({
        fromUserId: this.user.id,
        toUserId: studentId,
        details:
          this.assignment.course.name +
          " 课作业 " +
          this.assignment.name +
          " 于 " +
          this.$datetime.formatDate(this.assignment.deadline).full +
          " 截止，请及时上交作业。"
      });

      var message = "";
      if (data) {
        message = "消息已经发送";
      } else {
        message = "消息发送失败";
      }

      this.$q.notify({
        message: message,
        actions: [{ icon: "close", color: "white" }]
      });
    }
  }
};
</script>
