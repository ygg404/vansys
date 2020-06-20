<template>
  <van-dialog width="80%" v-model="visible" confirm-button-text="返回">
    <template slot="title">
      <div class="span_header">参评人数:<span>{{person}}</span></div>
    </template>
    <table border="1" cellspacing="0" width="100%" style="text-align: center;margin-top:5px;">
      <thead>
        <tr>
          <th>用户名</th><th>是否提交</th>
        </tr>
      </thead>
        <tbody style="overflow-y:auto;max-height:300px;">
        <tr :key="item.userName + index" v-for="(item,index) in uRoleList">
          <td>{{item.userName}}</td>
          <td>
            <van-tag v-if="item.isAssess" type="primary">已提交</van-tag>
            <van-tag v-else>未提交</van-tag>
          </td>
        </tr>
        </tbody>
    </table>
  </van-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        uRoleList: [],
        dataForm: {
          curYear: '',
          updown: 0
        },
        person: 0
      }
    },
    computed: {
      documentClientHeight: {
        get () {
          return this.$store.state.common.documentClientHeight
        }
      }
    },
    methods: {
      init (dataForm) {
        this.dataForm = dataForm
        this.getUaccessList().then(list => {
          this.uRoleList = list
          this.person = this.getAssessPerson(list)
        })
        this.visible = true
      },
      // 获取已经评分的用户列表
      getUaccessList () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/perf/access/uAssessList`),
            method: 'get',
            params: this.$http.adornParams({
              year: this.dataForm.curYear.getFullYear(),
              updown: this.dataForm.updown
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              resolve(data.list)
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      // 显示参加评选人数
      getAssessPerson (list) {
        let person = 0
        for (let assess of list) {
          if (assess.isAssess) person += 1
        }
        return person
      }
    }
  }
</script>

<style scoped>
  .user_card {
    max-height: 500px;
    overflow-y: auto;
    box-shadow: 5px 5px 3px #1fd3e9;
    border: 1px solid #1fd3e9;
  }
  .span_header {
    font-weight: 700;
    font-size: 16px;
  }
  .span_header span{
    color: green;
  }
  .tac{
    text-align:center;
  }

  table tbody {
    display:block;
    overflow-y:scroll;
    overflow-x:hidden;
  }
  ::-webkit-scrollbar {
    width: 1px;
  }
  table thead,tbody tr,tfoot tr,thead tr {
    display:table;
    width:100%;
    table-layout:fixed;
  }

</style>
