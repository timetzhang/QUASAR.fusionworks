<template>
  <div class="q-pa-md">
    <form action="" method="post" onsubmit="return false">
      <q-input
        ref="user"
        autofocus
        v-model="login.user"
        autocomplete="username"
        label="手机号码/Email/用户名"
        lazy-rules
        :rules="[val => !!val || '必填项']"
      >
        <template v-slot:prepend> <q-icon name="account_circle" /> </template>
      </q-input>
      <q-input
        ref="password"
        autocomplete="password"
        v-model="login.password"
        :type="isPwd ? 'password' : 'text'"
        label="密码"
        lazy-rules
        :rules="[val => !!val || '必填项']"
      >
        <template v-slot:prepend> <q-icon name="lock" /> </template>
        <template v-slot:append>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          />
        </template>
      </q-input>
      <div style="text-align:center">
        <q-btn
          @click="submit"
          type="submit"
          size="18px"
          color="primary"
          label="登 录"
        />
      </div>
    </form>
  </div>
</template>

<script>
import dbUsers from "controller/dbUsers";
import dbUserClasses from "controller/dbUserClasses";
import dbUserCourses from "controller/dbUserCourses";
import dbUserDepartments from "controller/dbUserDepartments";
import login from "utils/login";

export default {
  name: "login",

  components: {},

  data() {
    return {
      isPwd: true,
      userValidMessage: "",
      isUserValid: true,
      passwordValidMessage: "",
      isPasswordValid: true,
      login: {
        user: "",
        password: ""
      }
    };
  },
  methods: {
    async submit() {
      if (this.$refs.user.validate() && this.$refs.password.validate()) {
        var user = await dbUsers.login({
          login: this.login.user,
          password: this.login.password
        });

        if (user) {
          //验证成功后 开始进行登录

          //如果登录了 localStorage里面也没有user信息
          //或
          //其他人登录了, cookie里的信息与localStorage里的信息不同
          //都需要重新写入localStorage

          //如果是学生登录
          if (user.usertype.id == 1) {
            var classData = await dbUserClasses.userClasses({
              userId: parseInt(user.id)
            });
            user.classes = [];
            classData.forEach(item => {
              user.classes.push(item.class);
            });
          }

          //如果是教师登录
          if (user.usertype.id == 2) {
            var coursesData = await dbUserCourses.userCourses({
              userId: parseInt(user.id)
            });
            user.courses = [];
            coursesData.forEach(item => {
              user.courses.push(item.course);
            });

            var departmentsData = await dbUserDepartments.userDepartments({
              userId: parseInt(user.id)
            });

            user.departments = [];
            departmentsData.forEach(item => {
              user.departments.push(item.department);
            });
          }

          user.headImage = user.headImage
            ? user.headImage
            : "https://cdn.quasar.dev/img/boy-avatar.png";

          console.log("[SYS]write userinfo to sessionStorage.");
          localStorage.setItem("user", JSON.stringify(user));

          this.$router.push({ name: "index" });
        } else {
          this.$q.notify({
            message: "用户名或密码错误!",
            color: "negative",
            actions: [{ icon: "close", color: "white" }],
            icon: "announcement"
          });
          this.$refs.password.focus();
        }
      }
    }
  }
};
</script>

<style></style>
