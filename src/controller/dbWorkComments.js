import Vue from "vue";
import gql from "graphql-tag";

var query = {
  /**
   * Query "Work Comments" list.
   *
   *@param {JSON}[variables] {workId: ID, pagesize: 每页大小, pagenum: 第几页}
   *@return {Array} works list
   */
  workComments: variables => {
    return new Promise((resolve, reject) => {
      var queryString = ""; //查询字段
      queryString = gql`
        query($workId: ID!, $pageSize: Int!, $pageNum: Int!) {
          workComments(
            workId: $workId
            pageSize: $pageSize
            pageNum: $pageNum
          ) {
            id
            details
            createdAt
            updatedAt
            user {
              name
              headImage
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
          if (res.data.data.workComments) {
            resolve(res.data.data.workComments);
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
  createWorkComment: variables => {
    return new Promise((resolve, reject) => {
      var queryString = ""; //查询字段
      //通过UserId查询作业
      //通常用于老师来查询自己布置的作业
      queryString = gql`
        mutation($details: String!, $workId: ID!, $userId: Int) {
          createWorkComment(
            details: $details
            workId: $workId
            userId: $userId
          ) {
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
          if (res.data.data.createWorkComment) {
            resolve(res.data.data.createWorkComment);
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
