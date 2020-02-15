<template>
  <div>
    <div class="text-h5" style="margin-bottom:10px">
      <q-icon name="assignment_later" />
      完成作业
    </div>
    <q-card class="my-card" flat bordered>
      <q-card-section>
        <div class="text-overline text-orange-9">
          {{ assignment.course.name }}
        </div>
        <div class="text-h6">
          {{ assignment.name }}
        </div>
        <div
          class="text-caption text-grey"
          v-html="assignment.details"
          style="margin-top: 10px; line-height: 1.4rem"
        ></div>
      </q-card-section>
      <q-separator />
      <q-card-actions>
        <q-space />
        <q-btn flat icon="event" label="截止日期" />
        <q-separator inset vertical />
        <q-btn-group flat>
          <q-btn
            :label="$datetime.formatDate(assignment.deadline).date"
            style="font-weight: bold"
          />
          <q-btn
            style="font-weight: bold"
            :label="$datetime.formatDate(assignment.deadline).time"
          />
        </q-btn-group>
      </q-card-actions>
    </q-card>
    <div style="margin-top:20px"></div>
    <div class="text-h6">
      以下是要提交的内容
    </div>
    <q-input
      ref="titleEditor"
      no-error-icon
      v-model="work.name"
      label="标题"
      :rules="[val => !!val || '标题不能为空']"
    />
    <q-field :error="errorDetails" no-error-icon>
      <RichEditor v-model="work.details" />
    </q-field>
    <div style="text-align:center; margin:10px 0">
      <q-btn-group>
        <q-btn icon="border_color" label="提交作业" @click="submit" />
      </q-btn-group>
    </div>
  </div>
</template>
<script>
import dbAssignments from "controller/dbAssignments";
import dbWorks from "controller/dbWorks";
import login from "utils/login";
import { QSpinnerGears } from "quasar";
import Dialog from "components/dialog";
import RichEditor from "components/richEditor";

export default {
  name: "studentNewWork",

  components: { RichEditor },

  data() {
    return {
      assignment: {
        course: {
          name: ""
        },
        name: "",
        details: ""
      },
      work: {
        name: "",
        details: ""
      },
      errorDetails: false
    };
  },
  async mounted() {
    this.init();
  },
  methods: {
    async init() {
      /* Loading begins */
      this.$q.loading.show({
        spinner: QSpinnerGears,
        message: "正在载入数据，请稍后..."
      });
      /* End of Loading */

      const data = await dbAssignments.assignment({
        id: this.$route.params.assignmentId
      });
      this.assignment = data;

      /* Loading finished */
      this.$q.loading.hide();
    },
    validateDetailsEditor() {
      if (this.work.details) {
        return true;
      } else {
        this.errorDetails = true;
        return false;
      }
    },
    async submit() {
      if (this.$refs.titleEditor.validate() && this.validateDetailsEditor()) {
        /* Loading begins */
        this.$q.loading.show({
          spinner: QSpinnerGears,
          message: "正在载入数据，请稍后..."
        });
        /* End of Loading */

        let result = await dbWorks.createWork({
          userId: JSON.parse(localStorage.getItem("user")).id,
          assignmentId: this.$route.params.assignmentId,
          workstateId: 1,
          name: this.work.name,
          details: this.work.details
        });

        /* Loading finished */
        this.$q.loading.hide();

        if (result) {
          this.$q
            .dialog({
              component: Dialog,
              title: "Success",
              name: "提交成功",
              text:
                "您的作业已经提交成功，请保持关注“作业”页面来查看评分。如被驳回，请修改作业内容。"
            })
            .onOk(res => {
              this.$router.push({ name: "studentWorkUnscored" });
            });
        }
      }
    }
  }
};
</script>
