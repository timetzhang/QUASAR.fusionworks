<template>
  <div>
    <q-list bordered style="max-width: 400px">
      <q-item>
        <q-item-section>
          <q-item-label overline style="padding-top:10px;">{{
            user.usertype.name
          }}</q-item-label>
          <q-item-label class="text-h6"
            >{{ user.name }}
            <q-btn
              round
              flat
              size="10px"
              dense
              icon="create"
              @click="dialog.user = true"
            />

            <q-dialog v-model="dialog.user">
              <q-card class="q-dialog-plugin">
                <q-card-section>
                  <q-banner class="bg-primary text-white">
                    为了给您的作业正确的评分，请使用真实的姓名。
                  </q-banner>
                </q-card-section>
                <q-card-section
                  ><q-input
                    ref="name"
                    color="primary"
                    v-model="user.name"
                    dense
                    autofocus
                    counter
                    :error="errorName"
                    :error-message="errorMessageName"
                  >
                    <template v-slot:append>
                      <q-icon name="edit" />
                    </template> </q-input
                ></q-card-section>
                <q-card-actions align="right"
                  ><q-btn label="取 消" size="18px" v-close-popup/>
                  <q-btn
                    label="确 定"
                    size="18px"
                    v-close-popup
                    @click="validateName"
                /></q-card-actions>
              </q-card>
            </q-dialog>
          </q-item-label>
          <q-item-label caption
            >签名： {{ user.sign
            }}<q-btn round flat size="7px" dense icon="create" />
            <q-popup-edit
              v-model="user.sign"
              buttons
              label-set="保存"
              label-cancel="取消"
              :validate="validateSign"
            >
              <q-input
                color="primary"
                v-model="user.sign"
                dense
                autofocus
                counter
              >
                <template v-slot:append>
                  <q-icon name="edit" />
                </template>
              </q-input>
            </q-popup-edit>
          </q-item-label>
          <q-item-label caption
            >性别： {{ user.gender
            }}<q-btn round flat size="7px" dense icon="create" />
            <q-popup-edit
              v-model="user.gender"
              buttons
              label-set="保存"
              label-cancel="取消"
              max-width="80px"
              :validate="validateGender"
            >
              <q-radio v-model="user.gender" val="男" label="男" />
              <q-radio v-model="user.gender" val="女" label="女" />
            </q-popup-edit>
          </q-item-label>
        </q-item-section>

        <q-item-section side @click="dialogUpload = true">
          <q-avatar size="56px" class="q-mb-sm">
            <img :src="user.headImage" />
          </q-avatar>
        </q-item-section>
      </q-item>

      <q-separator spaced />

      <q-item-label header>学校信息</q-item-label>

      <q-item
        v-if="user.usertype.id == 2"
        v-for="(item, index) in user.courses"
        :key="index"
      >
        <q-item-section avatar>
          <q-avatar color="primary" text-color="white" icon="school" />
        </q-item-section>
        <q-item-section> {{ item.college.name }}{{ item.name }}</q-item-section>
        <q-item-section side>
          <q-item-label caption>{{
            item.college.university.name
          }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-item
        v-if="user.usertype.id == 1"
        v-for="(item, index) in user.classes"
        :key="index"
      >
        <q-item-section avatar>
          <q-avatar color="primary" text-color="white" icon="school" />
        </q-item-section>
        <q-item-section>
          {{ item.department.college.name }}
          <br />{{ item.year }}级 {{ item.name }}</q-item-section
        >
        <q-item-section side>
          <q-item-label caption>{{
            item.department.college.university.name
          }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-item v-if="user.usertype.id == 1">
        <q-item-section avatar>
          <q-avatar color="primary" text-color="white" icon="contacts" />
        </q-item-section>

        <q-item-section>
          <q-item-label>学号 / {{ user.internalId }}</q-item-label>
          <q-item-label caption
            >添加学号，可以让老师更清楚的识别您。</q-item-label
          >
        </q-item-section>

        <q-item-section side>
          <q-btn round flat size="10px" dense icon="create" />
          <q-popup-edit
            v-model="user.internalId"
            buttons
            label-set="保存"
            label-cancel="取消"
            :validate="validateInternalId"
          >
            <q-input
              color="primary"
              v-model="user.internalId"
              dense
              autofocus
              counter
              :error="errorInternalId"
              :error-message="errorMessageInternalId"
            >
              <template v-slot:append>
                <q-icon name="edit" />
              </template>
            </q-input>
          </q-popup-edit>
        </q-item-section>
      </q-item>

      <q-separator spaced />
      <q-item-label header>用户信息</q-item-label>
      <q-item>
        <q-item-section avatar>
          <q-avatar color="primary" text-color="white" icon="settings_cell" />
        </q-item-section>

        <q-item-section>
          <q-item-label>手机号码</q-item-label>
          <q-item-label caption>
            可以使用手机号码
            <b>{{ user.cellphone }}</b>
            进行登录。手机号码不能修改。</q-item-label
          >
        </q-item-section>
      </q-item>

      <q-separator spaced inset="item" />
      <q-item>
        <q-item-section avatar>
          <q-avatar color="primary" text-color="white" icon="drag_indicator" />
        </q-item-section>

        <q-item-section>
          <q-item-label>修改密码</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-btn round flat size="10px" dense icon="create" />
          <q-popup-edit
            v-model.oldPassword="user.oldPassword"
            v-model.password="user.newPassword"
            v-model.passwordConfirm="user.newPassword"
            buttons
            label-set="保存"
            label-cancel="取消"
            :validate="validatePassword"
          >
            <q-input
              ref="password"
              label="原密码"
              color="primary"
              v-model="user.oldPassword"
              dense
              autofocus
              counter
              :error="errorOldPassword"
              :error-message="errorMessageOldPassword"
              type="password"
            >
              <template v-slot:append>
                <q-icon name="edit" />
              </template>
            </q-input>
            <q-input
              label="新密码"
              color="primary"
              v-model="user.newPassword"
              dense
              autofocus
              counter
              :error="errorNewPassword"
              :error-message="errorMessageNewPassword"
              type="password"
            >
              <template v-slot:append>
                <q-icon name="edit" />
              </template>
            </q-input>
            <q-input
              label="请再次输入"
              color="primary"
              v-model="user.newPasswordConfirm"
              dense
              autofocus
              counter
              :error="errorNewPasswordConfirm"
              :error-message="errorMessageNewPasswordConfirm"
              type="password"
            >
              <template v-slot:append>
                <q-icon name="edit" />
              </template>
            </q-input>
          </q-popup-edit>
        </q-item-section>
      </q-item>

      <q-separator spaced inset="item" />

      <q-item>
        <q-item-section avatar>
          <q-avatar>
            <img :src="user.headImage" />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>用户名</q-item-label>
          <q-item-label caption
            ><b></b> 可以使用用户名
            <b>{{ user.username }}</b> 进行登录。</q-item-label
          >
        </q-item-section>

        <q-item-section side>
          <q-btn round flat size="10px" dense icon="create" />
          <q-popup-edit
            v-model.username="user.username"
            buttons
            label-set="保存"
            label-cancel="取消"
            :validate="validateUsername"
          >
            <q-input
              v-model.username="user.username"
              dense
              autofocus
              hint="用户名不能低于3位"
              :error="errorUsername"
              :error-message="errorMessageUsername"
            >
              <template v-slot:append>
                <q-icon name="edit" />
              </template>
            </q-input>
          </q-popup-edit>
        </q-item-section>
      </q-item>
      <q-separator spaced inset="item" />
      <q-item>
        <q-item-section avatar>
          <q-avatar color="primary" text-color="white" icon="alternate_email" />
        </q-item-section>

        <q-item-section>
          <q-item-label>Email 地址</q-item-label>
          <q-item-label caption
            >可以使用 Email <b>{{ user.email }}</b> 进行登录。</q-item-label
          >
        </q-item-section>
        <q-item-section side>
          <q-btn round flat size="10px" dense icon="create" />
          <q-popup-edit
            v-model="user.email"
            buttons
            label-set="保存"
            label-cancel="取消"
            :validate="validateEmail"
          >
            <q-input
              color="primary"
              v-model="user.email"
              dense
              autofocus
              counter
              :error="errorEmail"
              :error-message="errorMessageEmail"
            >
              <template v-slot:append>
                <q-icon name="edit" />
              </template>
            </q-input>
          </q-popup-edit>
        </q-item-section>
      </q-item>
    </q-list>
    <q-dialog v-model="dialogUpload">
      <q-uploader
        ref="uploader"
        :url="$config.apiHost + 'uploadFile'"
        accept="image/*"
        field-name="file"
        @uploaded="uploaded"
        @added="uploadAdded"
        multiple
      />
    </q-dialog>
  </div>
</template>

<script>
import dbUsers from "../../controller/dbUsers";
import dbUserClasses from "../../controller/dbUserClasses";
import dbUserCourses from "../../controller/dbUserCourses";
import { QSpinnerGears } from "quasar";
import login from "../../utils/login";
import imageConversion from "image-conversion";

export default {
  name: "info",

  components: {},

  data() {
    return {
      errorMessageName: "",
      errorName: false,
      errorMessageInternalId: "",
      errorInternalId: false,
      errorMessageOldPassword: "",
      errorOldPassword: false,
      errorMessageNewPassword: "",
      errorNewPassword: false,
      errorMessageNewPasswordConfirm: "",
      errorNewPasswordConfirm: false,
      errorMessageUsername: "",
      errorUsername: false,
      errorMessageEmail: "",
      errorEmail: false,

      dialogUpload: false,
      dialog: {
        user: false
      },
      user: {
        id: 0,
        name: "",
        username: "游客",
        headImage: "https://cdn.quasar.dev/img/boy-avatar.png",
        headBackground: "https://cdn.quasar.dev/img/material.png",
        oldPassword: "",
        newPassword: "",
        newPasswordConfirm: "",
        sign: "",
        usertype: {
          id: 0,
          name: "游客"
        },
        classes: [
          {
            id: 0,
            name: "",
            year: "",
            department: {
              name: "",
              college: {
                name: "",
                university: {
                  name: ""
                }
              }
            }
          }
        ],
        courses: [
          {
            id: 0,
            name: "",
            college: {
              name: "",
              university: {
                name: ""
              }
            }
          }
        ]
      }
    };
  },
  mounted() {
    if (!login.check()) {
      this.$router.push({ name: "login" });
      return;
    } else {
      this.init();
    }
  },
  methods: {
    init() {
      /* Loading begins */
      this.$q.loading.show({
        spinner: QSpinnerGears,
        message: "正在载入数据，请稍后..."
      });
      /* End of Loading */

      this.user = JSON.parse(localStorage.getItem("user"));

      /* Loading finished */
      this.$q.loading.hide();
    },
    async uploadAdded(files) {
      //进行文件压缩
      var blob = await imageConversion.compress(files[0], {
        quality: 0.8,
        type: "image/jpeg",
        width: 300
      });
      //将blob转换成file
      var file = new window.File([blob], this.$refs.uploader.files[0].name, {
        type: this.$refs.uploader.files[0].type
      });
      this.$refs.uploader.queuedFiles = [];
      this.$refs.uploader.queuedFiles.push(file);
    },
    uploaded(files) {
      var filename =
        this.$config.uploadsUrl + JSON.parse(files.xhr.response).filename;
      this.user.headImage = filename;
      this.dialogUpload = false;
      this.update();
    },
    validateName() {
      if (!this.user.name.trim()) {
        this.errorMessageName = "姓名不能为空";
        this.errorName = true;
        return false;
      } else {
        this.errorName = false;
      }

      dbUsers
        .updateUser({
          id: this.user.id,
          name: this.user.name.trim()
        })
        .then(res => {
          if (res.result) {
            localStorage.setItem("user", JSON.stringify(this.user));
            this.init();
            this.notify();
            return true;
          }
        });
    },
    validateSign() {
      dbUsers
        .updateUser({
          id: this.user.id,
          sign: this.user.sign.trim()
        })
        .then(res => {
          if (res.result) {
            localStorage.setItem("user", JSON.stringify(this.user));
            this.init();
            this.notify();
            return true;
          }
        });
    },
    validateGender() {
      dbUsers
        .updateUser({
          id: this.user.id,
          gender: this.user.gender
        })
        .then(res => {
          if (res.result) {
            localStorage.setItem("user", JSON.stringify(this.user));
            this.init();
            this.notify();
            return true;
          }
        });
    },
    validateInternalId() {
      if (!this.user.internalId.trim()) {
        this.errorMessageInternalId = "学号不能为空";
        this.errorInternalId = true;
        return false;
      } else {
        this.errorInternalId = false;
      }

      dbUsers
        .updateUser({
          id: this.user.id,
          internalId: this.user.internalId
        })
        .then(res => {
          if (res.result) {
            localStorage.setItem("user", JSON.stringify(this.user));
            this.init();
            this.notify();
          }
        });
    },
    validatePassword() {
      if (!this.user.oldPassword) {
        this.errorMessageOldPassword = "原密码不能为空";
        this.errorOldPassword = true;
        return false;
      } else {
        this.errorOldPassword = false;
      }

      if (!this.user.newPassword) {
        this.errorMessageNewPassword = "新密码不能为空";
        this.errorNewPassword = true;
        return false;
      } else {
        this.errorNewPassword = false;
      }

      if (this.user.newPassword.length < 6) {
        this.errorMessageNewPassword = "新密码不能低于6位";
        this.errorNewPassword = true;
        return false;
      } else {
        this.errorNewPassword = false;
      }

      if (this.user.newPassword != this.user.newPasswordConfirm) {
        this.errorMessageNewPasswordConfirm = "两次输入的密码不相同";
        this.errorNewPasswordConfirm = true;
        return false;
      } else {
        this.errorNewPasswordConfirm = false;
      }

      dbUsers
        .updateUserPassword({
          id: this.user.id,
          oldPassword: this.user.oldPassword,
          newPassword: this.user.newPassword
        })
        .then(res => {
          if (res) {
            this.clearPassword();
            this.notify();
            return true;
          }
        })
        .catch(err => {
          this.$q.notify({
            message: err,
            position: "top",
            color: "negative",
            actions: [{ icon: "close", color: "white" }]
          });
          this.clearPassword();
          return false;
        });
    },
    clearPassword() {
      this.user.oldPassword = "";
      this.user.newPassword = "";
      this.user.newPasswordConfirm = "";
    },
    validateUsername() {
      if (!this.user.username) {
        this.errorMessageUsername = "用户名不能为空";
        this.errorUsername = true;
        return false;
      }

      if (this.user.username.length <= 3) {
        this.errorMessageUsername = "用户名太短了";
        this.errorUsername = true;
        return false;
      }

      dbUsers
        .updateUserUsername({
          id: this.user.id,
          username: this.user.username
        })
        .then(res => {
          if (res.result) {
            localStorage.setItem("user", JSON.stringify(this.user));
            this.init();
            this.notify();
          }
          return true;
        })
        .catch(err => {
          this.$q.notify({
            message: err,
            position: "top",
            color: "negative",
            actions: [{ icon: "close", color: "white" }]
          });
          return false;
        });
    },
    validateEmail() {
      if (!this.user.email) {
        this.errorMessageEmail = "Email不能为空";
        this.errorEmail = true;
        return false;
      }

      if (
        /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(
          this.user.email
        ) == false
      ) {
        this.errorMessageEmail = "Email格式错误";
        this.errorEmail = true;
        return false;
      }

      dbUsers
        .updateUserEmail({
          id: this.user.id,
          email: this.user.email
        })
        .then(res => {
          if (res.result) {
            localStorage.setItem("user", JSON.stringify(this.user));
            this.init();
            this.notify();
          }
          return true;
        })
        .catch(err => {
          this.$q.notify({
            message: err,
            position: "top",
            color: "negative",
            actions: [{ icon: "close", color: "white" }]
          });
          return false;
        });
    },
    notify() {
      this.$q.notify({
        message: "修改成功! ",
        position: "top",
        color: "accent",
        actions: [{ icon: "close", color: "white" }]
      });
    }
  }
};
</script>

<style></style>
