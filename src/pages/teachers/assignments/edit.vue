<template>
  <div>
    <div class="text-h5" style="margin-bottom:10px">
      <q-icon name="create" />
      修改作业
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
    <div style="text-align:center; margin:10px 0">
      <q-btn-group>
        <q-btn
          label="返 回"
          icon="keyboard_arrow_left"
          @click="$router.back()"
        />
        <q-separator inset vertical />
        <q-btn label="提 交" icon="done" @click="validate" />
      </q-btn-group>
    </div>
  </div>
</template>
<script>
import dbAssignments from "controller/dbAssignments";
import { QSpinnerGears } from "quasar";
import Dialog from "components/dialog";
import RichEditor from "components/richEditor";

export default {
  name: "assignmentEdit",
  components: {
    RichEditor
  },
  data() {
    return {
      confirm: false,
      errorDetails: false,
      assignment: {
        name: "",
        details: "",
        deadline: ""
      }
    };
  },
  mounted() {
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

      var data = await dbAssignments.assignment({
        id: this.$route.params.id
      });

      if (data) {
        this.assignment = data;

        //divide deadline to 'date' and 'time'
        //for q-input
        this.assignment.deadline = {
          date: this.$datetime.formatDate(this.assignment.deadline).date,
          time: this.$datetime.formatDate(this.assignment.deadline).time
        };
      } else {
        this.$router.push({ name: "teacherAssignmentsTodo" });
      }

      /* Loading finished */
      this.$q.loading.hide();
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
      /* Loading begins */
      this.$q.loading.show({
        spinner: QSpinnerGears,
        message: "正在载入数据，请稍后..."
      });
      /* End of Loading */

      //combine date and time for deadline
      this.assignment.deadline =
        this.assignment.deadline.date + " " + this.assignment.deadline.time;

      var data = await dbAssignments.updateAssignment(this.assignment);
      if (data.result == "1") {
        this.$router.push({ name: "teacherAssignmentsTodo" });
      }

      /* Loading finished */
      this.$q.loading.hide();
    }
  }
};
</script>
