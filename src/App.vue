<template>
  <div id="q-app">
    <q-layout view="hHh Lpr lff">
      <q-header class="bg-primary text-white" height-hint="98">
        <q-toolbar flat>
          <q-btn flat round icon="menu" @click="left = !left" />
          <q-toolbar-title style="font-size: 15px">
            师大美院作业系统
          </q-toolbar-title>
          <q-space />
          <q-btn
            flat
            round
            @click="$q.fullscreen.toggle()"
            :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
          />
        </q-toolbar>
      </q-header>

      <q-drawer show-if-above v-model="left" side="left" :width="280">
        <q-scroll-area
          style="height: calc(100% - 251px); margin-top: 250px"
          class="bg-grey-3"
        >
          <q-list>
            <q-item active-class="menu-active" clickable to="/discover">
              <q-item-section avatar>
                <q-icon name="flight_takeoff" />
              </q-item-section>
              <q-item-section>发现</q-item-section>
            </q-item>
            <q-separator />
            <q-item
              active-class="menu-active"
              clickable
              v-if="!user.id"
              to="/users/login"
            >
              <q-item-section avatar>
                <q-icon name="account_box" />
              </q-item-section>
              <q-item-section>登录</q-item-section>
            </q-item>

            <q-item
              active-class="menu-active"
              clickable
              v-if="!user.id"
              to="/students/new"
            >
              <q-item-section avatar>
                <q-icon name="face" />
              </q-item-section>
              <q-item-section>注册新学生</q-item-section>
            </q-item>

            <!----------------------------------------
                  学生菜单
            ---------------------------------------->
            <q-item
              active-class="menu-active"
              clickable
              to="/students/assignments/todo"
              v-if="user.usertype.id == 1"
            >
              <q-item-section avatar>
                <q-icon name="assignment_later" />
              </q-item-section>

              <q-item-section>需要完成的作业</q-item-section>
              <q-item-section side>
                <q-badge align="middle" color="red">
                  {{ this.studentAssignmentsTodoCount }}
                </q-badge></q-item-section
              >
            </q-item>

            <q-item
              active-class="menu-active"
              clickable
              to="/students/works/unscored"
              v-if="user.usertype.id == 1"
            >
              <q-item-section avatar>
                <q-icon name="assignment" />
              </q-item-section>

              <q-item-section>等待评分的作业</q-item-section>
            </q-item>

            <q-item
              active-class="menu-active"
              clickable
              to="/students/works/rejected"
              v-if="user.usertype.id == 1"
            >
              <q-item-section avatar>
                <q-icon name="assignment_return" />
              </q-item-section>

              <q-item-section>被驳回的作业</q-item-section>
            </q-item>

            <q-item
              active-class="menu-active"
              clickable
              to="/students/works/scored"
              v-if="user.usertype.id == 1"
            >
              <q-item-section avatar>
                <q-icon name="assignment_turned_in" />
              </q-item-section>

              <q-item-section>已完成的作业</q-item-section>
            </q-item>

            <q-item
              active-class="menu-active"
              clickable
              to="/students/works/reel"
              v-if="user.usertype.id == 1"
            >
              <q-item-section avatar>
                <q-icon name="class" />
              </q-item-section>
              <q-item-section>我的作品集</q-item-section>
            </q-item>

            <!----------------------------------------
                  老师菜单
            ---------------------------------------->
            <q-item
              active-class="menu-active"
              clickable
              to="/teachers/assignments/todo"
              v-if="user.usertype.id == 2"
            >
              <q-item-section avatar>
                <q-icon name="assignment" />
              </q-item-section>

              <q-item-section>作业</q-item-section>
              <q-item-section side>
                <q-badge align="middle" color="red">
                  {{ this.teacherAssignmentsTodoCount }}
                </q-badge>
              </q-item-section>
            </q-item>

            <q-item
              active-class="menu-active"
              clickable
              to="/teachers/assignments/done"
              v-if="user.usertype.id == 2"
            >
              <q-item-section avatar>
                <q-icon name="offline_pin" />
              </q-item-section>

              <q-item-section>已结束的作业</q-item-section>
            </q-item>

            <q-item
              active-class="menu-active"
              clickable
              to="/teachers/statis/students"
              v-if="user.usertype.id == 2"
            >
              <q-item-section avatar>
                <q-icon name="storage" />
              </q-item-section>

              <q-item-section>成绩统计</q-item-section>
            </q-item>

            <!----------------------------------------
                  通用菜单
            ---------------------------------------->
            <q-item
              active-class="menu-active"
              v-if="user.id"
              clickable
              to="/users/medals"
            >
              <q-item-section avatar>
                <q-icon name="verified_user" />
              </q-item-section>
              <q-item-section>我的成就</q-item-section>
            </q-item>
            <q-item
              active-class="menu-active"
              v-if="user.id"
              clickable
              to="/users/messages"
            >
              <q-item-section avatar>
                <q-icon name="chat" />
              </q-item-section>
              <q-item-section>我的信息</q-item-section>
            </q-item>
            <q-item
              active-class="menu-active"
              v-if="user.id"
              clickable
              to="/users/fav"
            >
              <q-item-section avatar>
                <q-icon name="star" />
              </q-item-section>
              <q-item-section>我的收藏</q-item-section>
            </q-item>
            <q-item clickable v-if="user.id" @click="logoff">
              <q-item-section avatar>
                <q-icon name="exit_to_app" />
              </q-item-section>
              <q-item-section>退出登录</q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>

        <q-img
          class="absolute-top"
          :src="
            user.headImage
              ? user.headImage
              : 'https://cdn.quasar.dev/img/material.png'
          "
          style="height: 250px"
          :img-style="{ filter: 'saturate(60%) brightness(70%)' }"
        >
          <div class="absolute-bottom bg-transparent">
            <q-avatar size="56px" class="q-mb-sm">
              <img :src="user.headImage" />
            </q-avatar>
            <div class="text-weight-bold">{{ user.name }}</div>

            <!-- 

            学生的资料显示

          -->
            <div v-if="user.usertype.id == 1" class="text-caption">
              <div>
                {{ user.classes[0].department.college.university.name
                }}{{ user.classes[0].department.college.name }}
              </div>
              <div>
                {{ user.classes[0].year }}
                {{ user.classes[0].name }}
              </div>
            </div>

            <!-- 

            教师的资料显示

          -->
            <div v-if="user.usertype.id == 2" class="text-caption">
              <div>
                {{ user.courses[0].college.university.name
                }}{{ user.courses[0].college.name }}
              </div>
            </div>
            <div>@{{ user.username }}</div>
          </div>

          <q-btn
            flat
            icon="account_circle"
            color="white"
            class="absolute-bottom-right"
            to="/users/info"
          />
        </q-img>
      </q-drawer>
      <q-page-container>
        <div :class="$q.platform.is.mobile ? 'q-pa-sm' : 'q-pa-lg'">
          <router-view />
        </div>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
import dbAssignments from "controller/dbAssignments";
import login from "utils/login";

export default {
  name: "Layout",

  data() {
    return {
      left: false,
      user: {
        id: 0,
        name: "",
        username: "游客",
        headImage: "https://cdn.quasar.dev/img/boy-avatar.png",
        headBackground: "https://cdn.quasar.dev/img/material.png",
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
      },
      studentAssignmentsTodoCount: 0,
      teacherAssignmentsTodoCount: 0
    };
  },
  watch: {
    $route() {
      this.init();
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    logoff() {
      login.logoff();
      //清空USER
      this.user = {
        id: 0,
        name: "",
        username: "游客",
        headImage: "https://cdn.quasar.dev/img/boy-avatar.png",
        headBackground: "https://cdn.quasar.dev/img/material.png",
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
      };
      this.$router.push({ name: "index" });
    },
    async init() {
      //检查是否登录
      if (login.check()) {
        this.user = JSON.parse(localStorage.getItem("user"));

        //如果是学生
        //查找未完成的作业数量
        if (this.user.usertype.id == 1) {
          const data = await dbAssignments.studentAssignmentsTodoCount({
            classId: this.user.classes[0].id,
            userId: this.user.id
          });
          this.studentAssignmentsTodoCount = data.result;
        }

        //如果是老师
        //查找布置的作业数量
        if (this.user.usertype.id == 2) {
          const data = await dbAssignments.teacherAssignmentsTodoCount({
            userId: this.user.id
          });
          this.teacherAssignmentsTodoCount = data.result;
        }
      }
    }
  }
};
</script>

<style lang="sass">
.menu-active
  color: white !important
  background: $primary

input, .q-field__native.row.items-center span
  font-weight: bold !important
  font-size: 1.0rem !important

.q-table th
  font-weight: bold !important
</style>
