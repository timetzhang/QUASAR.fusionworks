<template>
  <div class="q-gutter-sm">
    <q-stepper flat v-model="step" ref="stepper" color="primary" animated>
      <q-step
        :name="1"
        title="基本信息"
        caption="Basic"
        icon="settings"
        :done="step > 1"
      >
        <div class="q-gutter-none">
          <q-input
            outlined
            v-model="user.name"
            label="姓名 Name"
            @blur="validateName()"
            :error-message="errorMessageName"
            :error="errorName"
          />
          <q-input
            outlined
            v-model="user.cellphone"
            label="手机号码 Cellphone"
            @blur="validateCellphone()"
            :error-message="errorMessageCellphone"
            :error="errorCellphone"
          >
            <template v-slot:append>
              <q-btn
                dense
                size="14px"
                flat
                label="发送验证码"
                @click="sendAuthcode"
              />
            </template>
          </q-input>
          <q-input
            outlined
            v-model="user.cellphoneAuthcode"
            label="输入验证码 Authcode"
            :error-message="errorMessageAuthcode"
            :error="errorAuthcode"
            @blur="validateAuthcode"
          />
          <q-input
            outlined
            v-model="user.password"
            label="密码 Password"
            :error-message="errorMessagePassword"
            :error="errorPassword"
            @blur="validatePassword()"
          />

          <q-input
            outlined
            v-model="user.passwordConfirm"
            label="再次输入密码 Password Confirm"
            :error-message="errorMessagePasswordConfirm"
            :error="errorPasswordConfirm"
            @blur="validatePasswordConfirm()"
          />
        </div>
      </q-step>

      <q-step
        :name="2"
        title="学校信息"
        caption="College"
        icon="create_new_folder"
        :done="step > 2"
      >
        <div class="q-gutter-sm">
          <q-select
            outlined
            v-model="selectedUniversity"
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            label="学校名"
            :options="filteredUniversities"
            @filter="filterUniversities"
            @input="inputUniversities"
            behavior="menu"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"
                  >请输入关键字查询</q-item-section
                >
              </q-item>
            </template>
          </q-select>

          <q-select
            outlined
            v-model="selectedCollege"
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            label="学院"
            :options="filteredColleges"
            @filter="filterColleges"
            @input="inputColleges"
            behavior="menu"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"
                  >请输入关键字查询</q-item-section
                >
              </q-item>
            </template>
          </q-select>
          <q-field
            :error="errorDepartment"
            :error-message="errorMessageDepartment"
            no-error-icon
          >
            <q-select
              outlined
              use-input
              hide-selected
              fill-input
              input-debounce="0"
              v-model="selectedDepartment"
              label="系"
              :options="filteredDepartments"
              @filter="filterDepartments"
              @input="inputDepartments"
              behavior="menu"
              style="width:100%"
            />
          </q-field>

          <q-field
            :error="errorCourse"
            :error-message="errorMessageCourse"
            no-error-icon
          >
            <q-select
              outlined
              use-input
              hide-selected
              fill-input
              input-debounce="0"
              v-model="selectedCourse"
              label="课程"
              :options="filteredCourses"
              @filter="filterCourses"
              behavior="menu"
              style="width:100%"
            />
          </q-field>
        </div>
      </q-step>

      <template v-slot:navigation>
        <q-stepper-navigation style="text-align:center">
          <q-btn
            @click="submit"
            color="primary"
            :label="step === 2 ? '完 成 Finish' : '下一步 >'"
          />
          <q-btn
            v-if="step > 1"
            flat
            color="primary"
            @click="$refs.stepper.previous()"
            label="< 上一步"
            class="q-ml-sm"
          />
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </div>
</template>

<script>
// @ is an alias to /src
import dbUsers from "../../controller/dbUsers";
import dbUniversities from "../../controller/dbUniversities";
import dbColleges from "../../controller/dbColleges";
import dbDepartments from "../../controller/dbDepartments";
import dbCourses from "../../controller/dbCourses";
import dbCellphoneAuthcode from "../../controller/dbCellphoneAuthcode";
import { QSpinnerGears } from "quasar";
import Dialog from "components/dialog";

export default {
  name: "newTeacher",
  data() {
    return {
      user: {
        name: "",
        gender: "男",
        cellphone: "",
        cellphoneAuthcode: "",
        usertypeId: 2,
        password: "",
        departmentId: null
      },

      selectedUniversity: {}, //选择好的大学，包含{label, value}
      allUniversities: [], //查询到的大学
      filteredUniversities: [],

      selectedCollege: {},
      allColleges: [], //查询到的学院
      filteredColleges: [],

      selectedDepartment: {},
      allDepartments: [],
      filteredDepartments: [],

      selectedCourse: [],
      allCourses: [],
      filteredCourses: [],

      step: 1,
      errorMessageName: "请输入正确的姓名",
      errorName: false,
      errorMessageCellphone: "请输入正确的手机号码",
      errorCellphone: false,
      errorMessageAuthcode: "验证码错误",
      errorAuthcode: false,
      errorMessagePassword: "密码不能低于6位",
      errorPassword: false,
      errorMessagePasswordConfirm: "两次输入的密码不相同",
      errorPasswordConfirm: false,
      errorMessageDepartment: "请选择您的系",
      errorDepartment: false,
      errorMessageCourse: "请选择您所教授的课程",
      errorCourse: false
    };
  },
  components: {},
  mounted() {
    this.initUniversities();
  },
  methods: {
    async sendAuthcode() {
      if (await this.validateCellphone()) {
        var seconds = 5;
        this.sendAuthcodeDisable = true;

        this.sendAuthcodeLabel = seconds + "秒后";
        var timer = setInterval(() => {
          seconds--;
          this.sendAuthcodeLabel = seconds + "秒后";
          if (seconds <= 0) {
            clearInterval(timer);
            this.sendAuthcodeDisable = false;
            this.sendAuthcodeLabel = "发送验证码";
          }
        }, 1000);

        dbCellphoneAuthcode.send({ cellphone: this.user.cellphone });
      }
    },
    /**
     * 表单验证
     */
    validateName() {
      if (!this.user.name) {
        this.errorMessageName = "必填项";
        this.errorName = true;
        return false;
      } else {
        this.errorName = false;
      }

      if (this.user.name.length < 2) {
        this.errorMessageName = "请输入正确的姓名";
        this.errorName = true;
        return false;
      } else {
        this.errorName = false;
        return true;
      }
    },
    async validateCellphone() {
      if (!this.user.cellphone) {
        this.errorMessageCellphone = "必填项";
        this.errorCellphone = true;
        return false;
      } else {
        this.errorCellphone = false;
      }

      if (!/^1[3456789]\d{9}$/.test(this.user.cellphone)) {
        this.errorMessageCellphone = "请输入正确的手机号码";
        this.errorCellphone = true;
        return false;
      } else {
        //验证数据库内是否已经有该手机号码
        const result = await dbUsers.cellphone({
          cellphone: this.user.cellphone
        });
        if (result.id) {
          this.errorMessageCellphone = "该手机号码已经注册";
          this.errorCellphone = true;
          return false;
        } else {
          this.errorCellphone = false;
          return true;
        }
      }
    },
    async validateAuthcode() {
      if (!this.user.cellphoneAuthcode) {
        this.errorMessageAuthcode = "必填项";
        this.errorAuthcode = true;
        return false;
      } else {
        this.errorAuthcode = false;

        //此处验证码
        let result = await dbCellphoneAuthcode.validate({
          cellphone: this.user.cellphone,
          authcode: this.user.cellphoneAuthcode
        });
        if (result.length) {
          return true;
        } else {
          this.errorMessageAuthcode = "验证码不正确";
          this.errorAuthcode = true;
          return false;
        }
      }
    },
    validatePassword() {
      if (!this.user.password) {
        this.errorMessagePassword = "必填项";
        this.errorPassword = true;
        return false;
      } else {
        this.errorPassword = false;
      }

      if (this.user.password.length < 6) {
        this.errorMessagePassword = "密码长度不能小于6位";
        this.errorPassword = true;
        return false;
      } else {
        this.errorPassword = false;
        return true;
      }
    },
    validatePasswordConfirm() {
      if (this.user.password != this.user.passwordConfirm) {
        this.errorPasswordConfirm = true;
        return false;
      } else {
        this.errorPasswordConfirm = false;
        return true;
      }
    },
    validateDepartment() {
      if (!this.selectedDepartment.value) {
        this.errorDepartment = true;
        return false;
      } else {
        return true;
      }
    },
    validateCourse() {
      if (!this.selectedCourse.value) {
        this.errorCourse = true;
        return false;
      } else {
        return true;
      }
    },

    /**
     * 提交
     */
    async submit() {
      if (this.step == 1) {
        if (
          this.validateName() &&
          (await this.validateCellphone()) &&
          (await this.validateAuthcode()) &&
          this.validatePassword() &&
          this.validatePasswordConfirm()
        ) {
          this.$refs.stepper.next();
          return;
        } else {
          return false;
        }
      }
      if (this.step == 2) {
        //提交注册信息
        if (this.validateCourse()) {
          /* Loading begins */
          this.$q.loading.show({
            spinner: QSpinnerGears,
            message: "正在载入数据，请稍后..."
          });
          /* End of Loading */

          this.user.courseId = this.selectedCourse.value;
          this.user.departmentId = this.selectedDepartment.value;
          var data = await dbUsers.createUser(this.user);

          /* Loading finished */
          this.$q.loading.hide();

          if (data) {
            this.$q
              .dialog({
                component: Dialog,
                title: "Success",
                name: "注册成功",
                text:
                  "您可以通过手机号码和密码来进行登录，登录后就可以查看作业了。"
              })
              .onOk(res => {
                this.$router.push({ name: "login" });
              });
          }
        }
      }
    },

    /**
     * 学校信息处理
     */

    //学校名称
    async initUniversities() {
      let data = await dbUniversities.universities();
      this.allUniversities = [];
      data.forEach(item => {
        //因为选项框需要{label: xxxx, value: xxx}
        this.allUniversities.push({
          label: item.name,
          value: item.id
        });
      });
      this.filteredUniversities = this.allUniversities;
    },
    filterUniversities(val, update) {
      if (val == "") {
        update(() => {
          this.filteredUniversities = this.allUniversities;
        });
        return;
      } else {
        update(() => {
          this.filteredUniversities = [];
          this.allUniversities.forEach(item => {
            if (item.label.indexOf(val) > -1) {
              this.filteredUniversities.push(item);
            }
          });
        });
      }
    },
    inputUniversities() {
      //当大学名称更换时，需要清除学院 系等下级...

      this.selectedCollege = "";
      this.allColleges = [];

      this.selectedDepartment = "";
      this.allDepartments = [];

      this.selectedCourse = "";
      this.allCourses = [];

      if (this.selectedUniversity.value) {
        this.initColleges();
      }
    },

    //学院名称
    async initColleges() {
      var data = await dbColleges.colleges({
        universityId: this.selectedUniversity.value
      });
      this.allColleges = [];
      data.forEach(item => {
        this.allColleges.push({
          label: item.name,
          value: item.id
        });
      });
      this.filteredColleges = this.allColleges;
    },
    filterColleges(val, update) {
      if (val == "") {
        update(() => {
          this.filteredColleges = this.allColleges;
        });
        return;
      } else {
        update(() => {
          this.filteredColleges = [];
          this.allColleges.forEach(item => {
            if (item.label.indexOf(val) > -1) {
              this.filteredColleges.push(item);
            }
          });
        });
      }
    },
    inputColleges() {
      this.selectedDepartment = "";
      this.allDepartments = [];

      this.selectedCourse = "";
      this.allCourses = [];

      if (this.selectedCollege.value) {
        this.initDepartments();
      }
    },

    //系名称
    async initDepartments() {
      var data = await dbDepartments.departments({
        collegeId: this.selectedCollege.value
      });
      this.allDepartments = [];
      data.forEach(item => {
        this.allDepartments.push({
          label: item.name,
          value: item.id
        });
      });
    },
    filterDepartments(val, update) {
      if (val == "") {
        update(() => {
          this.filteredDepartments = this.allDepartments;
        });
        return;
      } else {
        update(() => {
          this.filteredDepartments = [];
          this.allDepartments.forEach(item => {
            if (item.label.indexOf(val) > -1) {
              this.filteredDepartments.push(item);
            }
          });
        });
      }
    },
    inputDepartments() {
      console.log(this.selectedDepartment);
      this.selectedCourse = "";
      this.allCourses = [];

      this.initCourses();
    },

    //班级
    async initCourses() {
      var data = await dbCourses.courses({
        collegeId: this.selectedCollege.value
      });
      this.allCourses = [];
      data.forEach(item => {
        this.allCourses.push({
          label: item.name,
          value: item.id
        });
      });
    },
    filterCourses(val, update) {
      if (val == "") {
        update(() => {
          this.filteredCourses = this.allCourses;
        });
        return;
      } else {
        update(() => {
          this.filteredCourses = [];
          this.allCourses.forEach(item => {
            if (item.label.indexOf(val) > -1) {
              this.filteredCourses.push(item);
            }
          });
        });
      }
    }
  }
};
</script>
<style lang="sass">
input,span
  font-weight: bold !important
  font-size: 1.1rem
</style>
