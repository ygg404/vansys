<template>
  <van-dialog title="质量评分" v-model="visible" width="90%" @cancel="visible = false"
              show-cancel-button @confirm="dataFormSubmit()">
    <div style="overflow:scroll; width:100%; height:500px;">
      <div :key="index" v-for="(scoreDetail, index) in scoreDetailList">
        <div class="form_title" v-if="index==0" style="margin-bottom:10px;padding-left:5px;">作业依据、空间基准及数学精度(权:0.3) <span class="from_span">质量元素扣分: <span style="color: #ff0000">{{kjScore}}</span></span></div>
        <div class="form_title" v-if="index==6" style="margin-bottom:10px;padding-left:5px;">数据采集、处理质量(权:0.4) <span class="from_span">质量元素扣分:<span style="color: red">{{cjScore}}</span></span></div>
        <div class="form_title" v-if="index==18" style="margin-bottom:10px;padding-left:5px;">成果资料质量(权:0.3) <span class="from_span">质量元素扣分:<span style="color: #ff0000">{{cgScore}}</span></span></div>

        <div style="border: 1px dotted rgb(195, 197, 199);margin:5px;padding:6px;">
          <van-row style="margin-bottom:5px;">
            <van-col span="12" style="font-size:14px;padding-left:5px;">检查项内容:{{scoreDetail.checkcontent}}</van-col>
            <van-col span="12">
              <div style="margin-left:10%;width:80%;" class="numinputstyle">
                <van-field v-model="scoreDetail.check_result" placeholder="检查结果" />
              </div>
            </van-col>
          </van-row>

          <van-row style="margin-bottom:5px;">
            <van-col span="10" class="tac fs14">错漏数量:</van-col>
            <van-col span="10" class="tac fs14">检查项扣分:<span style="color: red">{{scoreDetail.score}}</span></van-col>
          </van-row>
          <van-row class="numinputstyle" style="padding-bottom:4px;" type="flex" justify="space-around">
            <van-col span="5"><van-field v-model="scoreDetail.check_a" placeholder="A类" type="number" @change="scoreChangeHandler" /></van-col>
            <van-col span="5"><van-field v-model="scoreDetail.check_b" placeholder="B类" type="number" @change="scoreChangeHandler"/></van-col>
            <van-col span="5"><van-field v-model="scoreDetail.check_c" placeholder="C类" type="number" @change="scoreChangeHandler"/></van-col>
            <van-col span="5"><van-field v-model="scoreDetail.check_d" placeholder="D类" type="number" @change="scoreChangeHandler"/></van-col>
          </van-row>

        </div>
      </div>
    </div>
    <div style="margin-top:10px;margin-left:10px;">总分：<span style="color:#1989fa;">{{allScore}}</span></div>
  </van-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        loading: true,
        checkcontent: [
          // 19年检查内容
          '坐标系统、高程系统的正确性',
          '投影参数、转换参数的正确性',
          '起算数据及选用的正确性、可靠性',
          '控制测量成果',
          '平面坐标精度',
          '平面相对位置精度',
          '高程精度',
          '要素错误、缺漏情况',
          '属性错误、缺漏情况',
          '数据及结构的正确性',
          '图面表达质量',
          '表格表达质量',
          '计算质量',
          '技术文档表达质量',
          '资料完整性、规范性',
          // 20年检查内容
          '作业依据、原始资料（含行政审批资料）使用的正确性、有效性',
          '平面、高程基准（包括投影、转换参数）',
          '平面坐标精度',
          '相对位置（或边长）精度',
          '高程精度',
          '其他',
          '仪器及其使用的符合性',
          '作业内容、范围的符合性',
          '作业记录的规范性',
          '作业记录的正确性、完整性',
          '作业内容（要素、数据）错误情况',
          '作业内容（要素、数据）缺漏情况',
          '属性（定性、分类）错误情况',
          '属性（定性、分类）缺漏情况',
          '图面符号、线划、色彩表达的正确性',
          '图面注记内容及大小的正确性',
          '平差计算过程及结果正确性',
          '其他',
          '图面表达清晰性（符号、注记叠压等）',
          '成果表的清晰、完整、正确性',
          '技术文档内容的完整性',
          '技术文档内容的正确性、标准规范符合性',
          '图、文（表）一致性',
          '资料规整性（字体、大小、格式、页码、纸张大小）',
          '成果资料的齐全性'
        ],
        kjScore: 0, // 空间扣分
        cjScore: 0,   // 采集扣分
        cgScore: 0,  // 成果质量扣分
        allScore: 100, // 总分
        scoreDetailList: [], // 评分明细
        totalOutPut: 0,
        tOutPut: 0,  // 计算中的产值和占比
        tRate: 0,
        projectNo: '',
        scoreList: [],   // 分数列表
      }
    },
    mounted () {

    },
    methods: {
      init (projectNo) {
        this.projectNo = projectNo
        this.initScoreTypeList()
        console.log(this.scoreDetailList)
        this.getQualityScoreList(projectNo).then(data => {
          this.scoreList = data
          for (let scoreItem of this.scoreList) {
            for (let detail of this.scoreDetailList) {
              if (detail.type_id === scoreItem.typeId) {
                detail.check_a = scoreItem.checkA
                detail.check_b = scoreItem.checkB
                detail.check_c = scoreItem.checkC
                detail.check_d = scoreItem.checkD
                detail.check_result = scoreItem.checkResult
                detail.check_type = scoreItem.checkType
              }
            }
          }
          this.scoreChangeHandler()
        })

        this.visible = true
      },
      /**
       * 初始化评分列表
       */
      initScoreTypeList () {
        this.scoreDetailList = []
        for (var i = 15; i < this.checkcontent.length ; i++) {
          let scoreDetail = {
            checkcontent: this.checkcontent[i],
            check_a: '',
            check_b: '',
            check_c: '',
            check_d: '',
            check_result: '',
            check_type: '',
            project_no: this.projectNo,
            score: 0,   // 扣除总分
            type_id: i + 1
          }
          this.scoreDetailList.push(scoreDetail)
        }
      },
      scoreChangeHandler () {
        this.kjScore = 0
        this.cjScore = 0
        this.cgScore = 0
        this.scoreDetailList.forEach((item, index) => {
          item.score = (item.check_a === '' ? 0 : item.check_a * 42)
            + (item.check_b === '' ? 0 : item.check_b * 12)
            + (item.check_c === '' ? 0 : item.check_c * 4)
            + (item.check_d === '' ? 0 : item.check_d * 1)
          if (index >= 0 && index < 6) this.kjScore += item.score
          if (index >= 6 && index < 18) this.cjScore += item.score
          if (index >= 18) this.cgScore += item.score
        })
        this.allScore = (100 - 0.3 * this.kjScore - 0.4 * this.cjScore - 0.3 * this.cgScore).toFixed(2)
      },
      // 根据项目编号获取质量评分列表
      getQualityScoreList (projectNo) {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/project/qualityscore/list`),
            method: 'get',
            params: this.$http.adornParams(
              { 'projectNo': projectNo }
            )
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
      // 提交评分明细
      dataFormSubmit () {
        let scoreList = []
        for (let detail of this.scoreDetailList) {
          if (detail.check_a !== '' || detail.check_b !== '' || detail.check_c !== '' || detail.check_d !== '') {
            scoreList.push({
              'checkA': detail.check_a,
              'checkB': detail.check_b,
              'checkC': detail.check_c,
              'checkD': detail.check_d,
              'checkResult': detail.check_result,
              'checkType': detail.check_type,
              'projectNo': this.projectNo,
              'typeId': detail.type_id
            })
          }
        }
        this.$http({
          url: this.$http.adornUrl(`/project/qualityscore/saveList`),
          method: 'post',
          data: this.$http.adornData({
            'scoreList': scoreList,
            'projectNo': this.projectNo,
            'qualityScore': this.allScore
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500
            })
            this.visible = false
            this.$emit('refreshDataList', this.allScore)
          } else {
            this.$message.error(data.msg)
          }
        })
      }
    }
  }
</script>

<style>
  .form_line{
    /* border-bottom: 1px dotted #ccc; */
    border-radius: 0px;
  }
  .form_disable_item{
    border: 1px dotted #ccc;
    color: #757575;
    padding:1px;
  }
  .form_title {
    color: black;
    font-weight: bolder;
    font-size: 15px;
    margin-top: 10px;
  }
  .form_title .from_span{
    color: black;
    font-weight: bolder;
    font-size: 15px;
  }
  .fs14{
    font-size:14px;
  }
  .numinputstyle .van-field__control{
    border: 1px solid #cfcfcc;
  }
  .numinputstyle .van-cell{
    padding: 0px;
  }
  .tac{
    text-align: center;
  }


</style>
