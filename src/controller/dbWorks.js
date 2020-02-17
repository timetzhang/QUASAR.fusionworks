import Vue from "vue";
import gql from "graphql-tag";

var query = {
  /**
   * Query "Works" list, specially for page "Discover".
   *
   *@param {JSON}[variables] {pagesize: 每页大小, pagenum: 第几页}
   *@return {Array} works list
   */
  works: variables => {
    return new Promise((resolve, reject) => {
      var queryString = ""; //查询字段
      queryString = gql`
        query($pageSize: Int!, $pageNum: Int!) {
          works(pageSize: $pageSize, pageNum: $pageNum) {
            id
            name
            details
            createdAt
            updatedAt
            assignment {
              course {
                name
              }
            }
            user {
              name
            }
          }
        }
      `.loc.source.body;

      Vue.prototype.$http
        .post(Vue.prototype.$config.graphQLHost, {
          query: queryString,
          variables: variables
        })
        .then(res => {
          if (res.data.errors) {
            reject(Vue.prototype.$error.format(res.data.errors).message);
          }
          if (res.data.data.works) {
            resolve(res.data.data.works);
          } else {
            resolve(0);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  /**
   * 查询某一个作业详情.
   *
   *@param {JSON}[variables] {id: Work ID, userId: User ID}
   *@return {JSON} work
   */
  work: variables => {
    return new Promise((resolve, reject) => {
      var queryString = "";
      queryString = gql`
        query($id: ID!, $userId: Int) {
          work(id: $id, userId: $userId) {
            id
            name
            details
            score
            clicks
            userLiked
            likes
            userFaved
            favs
            createdAt
            updatedAt
            user {
              id
              name
              sign
            }
            assignment {
              id
              name
              details
              deadline
              course {
                id
                name
              }
            }
            workstate {
              id
              name
            }
          }
        }
      `.loc.source.body;

      Vue.prototype.$http
        .post(Vue.prototype.$config.graphQLHost, {
          query: queryString,
          variables: variables
        })
        .then(res => {
          if (res.data.errors) {
            reject(Vue.prototype.$error.format(res.data.errors).message);
          }
          if (res.data.data.work) {
            resolve(res.data.data.work);
          } else {
            resolve(0);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  /**
   * 老师查询作业, 包含所有字段.
   *
   *@param {JSON}[variables] {assignmentId: Assignment ID}
   *@return {Array} works list.
   */
  teacherWorks: variables => {
    return new Promise((resolve, reject) => {
      var queryString = "";

      queryString = gql`
        query($assignmentId: ID) {
          teacherWorks(assignmentId: $assignmentId) {
            id
            name
            details
            works
            score
            createdAt
            updatedAt
            user {
              id
              internalId
              gender
              name
              cellphone
            }
            workstate {
              id
              name
            }
          }
        }
      `.loc.source.body;

      Vue.prototype.$http
        .post(Vue.prototype.$config.graphQLHost, {
          query: queryString,
          variables: variables
        })
        .then(res => {
          if (res.data.errors) {
            reject(Vue.prototype.$error.format(res.data.errors).message);
          }
          if (res.data.data.teacherWorks) {
            resolve(res.data.data.teacherWorks);
          } else {
            resolve(0);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  /**
   * 老师查询作业, 不包含"details"字段.
   *
   *@param {JSON}[variables] {assignmentId: Assignment ID}
   *@return {Array} works list.
   */
  teacherWorksNoDetails: variables => {
    return new Promise((resolve, reject) => {
      var queryString = ""; //查询字段
      //通过UserId查询作业
      //通常用于老师来查询自己布置的作业
      queryString = gql`
        query($assignmentId: ID) {
          teacherWorks(assignmentId: $assignmentId) {
            id
            name
            works
            score
            createdAt
            updatedAt
            user {
              id
              internalId
              gender
              name
              cellphone
            }
            workstate {
              id
              name
            }
          }
        }
      `.loc.source.body;

      Vue.prototype.$http
        .post(Vue.prototype.$config.graphQLHost, {
          query: queryString,
          variables: variables
        })
        .then(res => {
          if (res.data.errors) {
            reject(Vue.prototype.$error.format(res.data.errors).message);
          }
          if (res.data.data.teacherWorks) {
            resolve(res.data.data.teacherWorks);
          } else {
            resolve(0);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  /**
   * 老师查询作业, 只返回ID.
   * 用于查看该Assignment下是否有Works
   *
   *@param {JSON}[variables] {assignmentId: Assignment ID}
   *@return {Array} works list.
   */
  teacherWorksId: variables => {
    return new Promise((resolve, reject) => {
      var queryString = ""; //查询字段
      //通过UserId查询作业
      //通常用于老师来查询自己布置的作业
      queryString = gql`
        query($assignmentId: ID) {
          teacherWorks(assignmentId: $assignmentId) {
            id
          }
        }
      `.loc.source.body;

      Vue.prototype.$http
        .post(Vue.prototype.$config.graphQLHost, {
          query: queryString,
          variables: variables
        })
        .then(res => {
          if (res.data.errors) {
            reject(Vue.prototype.$error.format(res.data.errors).message);
          }
          if (res.data.data.teacherWorks) {
            resolve(res.data.data.teacherWorks);
          } else {
            resolve(0);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  /**
   * 学生查询作业,
   * 通过作业的状态来查询
   *
   *@param {JSON}[variables] {userId: 学生ID, workstateId: 作业的状态}
   *@return {Array} works list.
   */
  studentWorks: variables => {
    return new Promise((resolve, reject) => {
      var queryString = ""; //查询字段
      queryString = gql`
        query($userId: Int, $workstateId: Int) {
          studentWorks(userId: $userId, workstateId: $workstateId) {
            id
            name
            score
            createdAt
            updatedAt
            assignment {
              id
              name
              course {
                id
                name
              }
            }
            workstate {
              id
              name
            }
          }
        }
      `.loc.source.body;

      Vue.prototype.$http
        .post(Vue.prototype.$config.graphQLHost, {
          query: queryString,
          variables: variables
        })
        .then(res => {
          if (res.data.errors) {
            reject(Vue.prototype.$error.format(res.data.errors).message);
          }
          if (res.data.data.studentWorks) {
            resolve(res.data.data.studentWorks);
          } else {
            resolve(0);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  /**
   * 查询用户收藏的作业
   *
   *@param {JSON}[variables] {userId: 用户ID}
   *@return {Array} works list.
   */
  userWorkFavs: variables => {
    return new Promise((resolve, reject) => {
      var queryString = ""; //查询字段
      queryString = gql`
        query($userId: Int!, $pageSize: Int!, $pageNum: Int!) {
          userWorkFavs(
            userId: $userId
            pageSize: $pageSize
            pageNum: $pageNum
          ) {
            work {
              id
              name
              details
              user {
                id
                name
              }
              assignment {
                course {
                  id
                  name
                }
              }
            }
            createdAt
          }
        }
      `.loc.source.body;

      Vue.prototype.$http
        .post(Vue.prototype.$config.graphQLHost, {
          query: queryString,
          variables: variables
        })
        .then(res => {
          if (res.data.errors) {
            reject(Vue.prototype.$error.format(res.data.errors).message);
          }
          if (res.data.data.userWorkFavs) {
            resolve(res.data.data.userWorkFavs);
          } else {
            resolve(0);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  /**
   * 创建一个新作业,
   *
   *@param {JSON}[variables] 
            { 
              userId: Int
              assignmentId: ID
              workstateId: Int
              name: String
              details: String
            }
   *@return {JSON} works.
   */
  createWork: variables => {
    return new Promise((resolve, reject) => {
      Vue.prototype.$http
        .post(Vue.prototype.$config.graphQLHost, {
          query: gql`
            mutation(
              $userId: Int
              $assignmentId: ID
              $workstateId: Int
              $name: String
              $details: String
            ) {
              createWork(
                userId: $userId
                assignmentId: $assignmentId
                workstateId: $workstateId
                name: $name
                details: $details
              ) {
                id
              }
            }
          `.loc.source.body,
          variables: variables
        })
        .then(res => {
          if (res.data.errors) {
            reject(Vue.prototype.$error.format(res.data.errors).message);
          }
          if (res.data.data.createWork) {
            resolve(res.data.data.createWork);
          } else {
            resolve(0);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  /**
   * 修改一个新作业,
   *
   *@param {JSON}[variables] 
            { 
              id: ID
              workstateId: Int
              name: String
              details: String
              score: Float
            }
   *@return {JSON} {result: ID}.
   */
  updateWork: variables => {
    return new Promise((resolve, reject) => {
      Vue.prototype.$http
        .post(Vue.prototype.$config.graphQLHost, {
          query: gql`
            mutation(
              $id: ID
              $workstateId: Int
              $name: String
              $details: String
              $score: Float
            ) {
              updateWork(
                id: $id
                workstateId: $workstateId
                name: $name
                details: $details
                score: $score
              ) {
                result
              }
            }
          `.loc.source.body,
          variables: variables
        })
        .then(res => {
          if (res.data.errors) {
            reject(Vue.prototype.$error.format(res.data.errors).message);
          }
          if (res.data.data.updateWork) {
            resolve(res.data.data.updateWork);
          } else {
            resolve(0);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  /**
   * 赞一个作业,, 如果已赞，则取消赞
   *
   *@param {JSON}[variables] 
            { 
              workId: ID!,
              userId: Int
            }
   *@return {JSON} {result: ID}.
   */
  toggleLikeWork: variables => {
    return new Promise((resolve, reject) => {
      var queryString = ""; //查询字段
      //通过UserId查询作业
      //通常用于老师来查询自己布置的作业
      queryString = gql`
        mutation($workId: ID!, $userId: Int) {
          toggleLikeWork(workId: $workId, userId: $userId) {
            result
          }
        }
      `.loc.source.body;

      Vue.prototype.$http
        .post(Vue.prototype.$config.graphQLHost, {
          query: queryString,
          variables: variables
        })
        .then(res => {
          if (res.data.errors) {
            reject(Vue.prototype.$error.format(res.data.errors).message);
          }
          if (res.data.data.toggleLikeWork) {
            resolve(res.data.data.toggleLikeWork);
          } else {
            resolve(0);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  /**
   * 收藏一个作业, 如果已收藏，则取消收藏
   *
   *@param {JSON}[variables] 
            { 
              workId: ID!,
              userId: Int
            }
   *@return {JSON} {result: ID}.
   */
  toggleFavWork: variables => {
    return new Promise((resolve, reject) => {
      var queryString = ""; //查询字段
      //通过UserId查询作业
      //通常用于老师来查询自己布置的作业
      queryString = gql`
        mutation($workId: ID!, $userId: Int) {
          toggleFavWork(workId: $workId, userId: $userId) {
            result
          }
        }
      `.loc.source.body;

      Vue.prototype.$http
        .post(Vue.prototype.$config.graphQLHost, {
          query: queryString,
          variables: variables
        })
        .then(res => {
          if (res.data.errors) {
            reject(Vue.prototype.$error.format(res.data.errors).message);
          }
          if (res.data.data.toggleFavWork) {
            resolve(res.data.data.toggleFavWork);
          } else {
            resolve(0);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  }
};
export default query;
