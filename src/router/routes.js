const routes = [
  {
    path: "/discover",
    name: "index",
    component: () => import("../pages/index.vue")
  },
  {
    path: "/",
    redirect: "/discover"
  },
  {
    path: "/works/:id",
    name: "workDetails",
    component: () => import("../pages/works/details.vue")
  },

  /*
    TEACHERS PAGES
  */

  {
    path: "/teachers/new",
    name: "teacherNew",
    component: () => import("../pages/teachers/new.vue")
  },
  {
    path: "/teachers/assignments/todo",
    name: "teacherAssignmentsTodo",
    component: () => import("../pages/teachers/assignments/todo.vue")
  },
  {
    path: "/teachers/assignments/done",
    name: "teacherAssignmentsDone",
    component: () => import("../pages/teachers/assignments/done.vue")
  },
  {
    path: "/teachers/assignments/new/",
    name: "teacherAssignmentNew",
    component: () => import("../pages/teachers/assignments/new.vue")
  },
  {
    path: "/teachers/assignments/edit/:id",
    name: "teacherAssignmentEdit",
    component: () => import("../pages/teachers/assignments/edit.vue")
  },
  {
    path: "/teachers/works/:assignmentId",
    name: "teacherWorks",
    component: () => import("../pages/teachers/works/works.vue")
  },

  {
    path: "/teachers/statis/students",
    name: "teacherStatisStudents",
    component: () => import("../pages/teachers/statis/students.vue")
  },
  /*
    STUDENTS PAGES
  */
  {
    path: "/students/new",
    name: "studentNew",
    component: () => import("../pages/students/new.vue")
  },
  {
    path: "/students/assignments/todo",
    name: "studentAssignmentsTodo",
    component: () => import("../pages/students/assignments/todo.vue")
  },
  {
    path: "/students/works/unscored",
    name: "studentWorkUnscored",
    component: () => import("../pages/students/works/unscored.vue")
  },
  {
    path: "/students/works/rejected",
    name: "studentWorkRejected",
    component: () => import("../pages/students/works/rejected.vue")
  },
  {
    path: "/students/works/scored",
    name: "studentWorkScored",
    component: () => import("../pages/students/works/scored.vue")
  },
  {
    path: "/students/works/new/:assignmentId",
    name: "studentWorkNew",
    component: () => import("../pages/students/works/new.vue")
  },
  {
    path: "/students/works/edit/:id/",
    name: "studentWorkEdit",
    component: () => import("../pages/students/works/edit.vue")
  },
  /*
    USER GENERALS
   */
  {
    path: "/users/fav",
    name: "fav",
    component: () => import("../pages/users/fav.vue")
  },
  {
    path: "/users/login",
    name: "login",
    component: () => import("../pages/users/login.vue")
  },
  {
    path: "/users/info",
    name: "info",
    component: () => import("../pages/users/info.vue")
  },
  {
    path: "/users/messages",
    name: "messages",
    component: () => import("../pages/users/messages.vue")
  },

  {
    path: "/users/medals",
    name: "medals",
    component: () => import("../pages/users/medals.vue")
  }
];

// Always leave this as last one
if (process.env.MODE !== "ssr") {
  routes.push({
    path: "*",
    component: () => import("pages/Error404.vue")
  });
}

export default routes;
