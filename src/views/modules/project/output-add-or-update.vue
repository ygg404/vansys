<template>
  <div>
    <van-dialog title="产值明细计算" v-model="outputCalVisible" showCancelButton cancelButtonText="返回" confirmButtonText="确定" @confirm="putProjectOutputToApiHandle">
      <div style="overflow:scroll; width:100%; height:500px;">
        <div class="psts">
          <van-cell is-link @click="pstVisible = true">
            <template solt="title">项目类型</template>
            <template solt="default">
              <van-tag style="margin-left:10px;" plain ype="primary" v-if="selectedTypeName != '' ">
                {{selectedTypeName}}
              </van-tag>
              <van-tag plain type="primary" v-if="selectedTypeNum >= 1" style="margin-left:5px;">
                +{{selectedTypeNum}}
              </van-tag>
            </template>
          </van-cell>
        </div>
        <!---->
        <div class="ptsd os" style="max-height:200px;">
          <van-list :key="workType + index" v-for="(workType, index) in  workTypelist">
            <van-checkbox v-model="workType.checked" v-if="workType.isVisible" size="large" @change="checkOutputVoInit" shape="square" style="margin-bottom:5px;">
              {{workType.typeName}}
            </van-checkbox>
          </van-list>
        </div>
        <!---->
        <div class="mbmt5">
          <span class="fsml">预计总产值：{{totalOutPut}}</span>
        </div>
        <van-row type="flex" justify="space-around" class="f13">
          <van-col span="10" class="tac">作业类型</van-col>
          <van-col span="10" class="tac">量单位</van-col>
        </van-row>
        <van-row class="ptsdv">
          <van-col span="6" class="tac">产值单位</van-col>
          <van-col span="6" class="tac">难度系数</van-col>
          <van-col span="6" class="tac">工作量</van-col>
          <van-col span="6" class="tac">产值</van-col>
        </van-row>
        <div class="os" style="max-height:200px;">
          <div v-if="chooseRatio(workTypelist) !== null">
            <van-list :key="item.id + index" v-for="(item,index) in chooseRatio(workTypelist)">
              <van-row class="ptpd5">
                <van-col span="24">
                  <van-row type="flex" align="center" justify="space-around" class="pglsfirst">
                    <van-col span="10" class="tac">{{item.typeName}}</van-col>
                    <van-col span="10" class="tac">{{item.unit}}</van-col>
                  </van-row>
                  <van-row type="flex" align="center">
                    <van-col span="6" class="tac">{{item.unitOutput}}</van-col>
                    <van-col span="6" class="tac"><div class="nis"><van-field v-model="item.projectRatio" @change="checkOutputVoInit"/></div></van-col>
                    <van-col span="6" class="tac"><div class="nis"><van-field v-model="item.workLoad" @change="checkOutputVoInit"/></div></van-col>
                    <van-col span="6" class="tac">{{item.typeOutput}}</van-col>
                  </van-row>
                </van-col>
              </van-row>
            </van-list>
          </div>
          <div v-else class="nodatasty">暂无数据</div>
        </div>
        <div class="bztx">备注填写</div>
        <textarea class="tas" v-model="outputRemark"/>
      </div>
    </van-dialog>

    <van-popup v-model="pstVisible" style="width: 85%; max-height:600px;">
      <div>
        <div class="header">项目类型</div>
        <div class="check_group" >
          <van-checkbox-group v-model="ptValue" ref="pcGroup" @change="projectTypeChangeHandler()">
            <van-checkbox v-for="item in projectTypelist" :key="item.id" :name="item.id" style="padding: 5px;" shape>{{item.name}}
            </van-checkbox>
          </van-checkbox-group>
        </div>
        <div>
          <button  class="confirmbtn"  @click="pstVisible = false">确认</button>
          <button  class="confirmbtn"  @click="pstVisible = false">取消</button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        selectedTypeName:'',
        selectedTypeNum: 0,
        pstVisible:false,
        projectNo: '',
        outputCalVisible: true,
        ptValue: [],
        outputRemark: '', // 备注
        projectTypelist: [],  // 项目类型列表
        workTypelist: [],     // 工作类型列表
        totalOutPut: 0,    // 预计总产值计算数值
        projectInfo: {
          projectType: ''
        }
      }
    },
    methods: {
      // 预算产值明细计算初始化
      init (project) {
        this.outputCalVisible = true
        this.$nextTick(() => {
          this.projectNo = project.projectNo
          let ptType = project.projectType.split(',')
          this.ptValue = []
          this.totalOutPut = 0
          this.getProjectTypelist().then(success => {
            this.getWorkTypelist(this.projectNo).then(success => {
              for (let pt of this.projectTypelist) {
                for (let type of ptType) {
                  if (pt.name === type) {
                    this.ptValue.push(pt.id)
                  }
                }
              }
              let yy = this.projectTypelist[this.ptValue[0]]
              this.selectedTypeName = yy.name
              this.selectedTypeNum = this.ptValue.length - 1
              if (this.ptValue === undefined) this.ptValue = [0]
              this.projectTypeChangeHandler()
            })
          })
        })
      },
      // 获取统计方法
      getSummaryMethod (param) {
        const { columns, data } = param
        const sums = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '预计产值合计：'
            return
          }
          if (index === 1 || index === 2 || index === 3 || index === 4) {
            sums[index] = '/'
            return
          }
          if (index === 5) {
            const values = data.map(item => Number(item[column.property]))
            let sum = 0
            for (let value of values) {
              sum += value
            }
            sums[index] = sum
            return
          }
        })
        return sums
      },
      // 获取工作类型列表
      getWorkTypelist (projectNo) {
        console.log(projectNo)
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/project/checkoutputtemp/list`),
            method: 'get',
            params: this.$http.adornParams({
              'projectNo': projectNo
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.workTypelist = data.list
              resolve(data.workTypelist)
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      // 获取项目类型列表
      getProjectTypelist () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/set/projecttype/getProjectTypelist`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.projectTypelist = []
              this.projectTypelist.push({id: 0, name: '全部'})
              console.log(this.projectTypelist)
              for (let item of data.list) {
                this.projectTypelist.push({id: item.id, name: item.name})
              }
              resolve(data.projectTypelist)
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      // 工作类型可见或不可见
      workTypeInit () {
        for (let workType of this.workTypelist) {
          workType.isVisible = false
          // 工作类型 不属于 任意项目则设为 可见
          if (workType.projectTypeIdList.length === 0) {
            workType.isVisible = true
          } else {
            for (let ptypeId of workType.projectTypeIdList) {
              for (let ptvalue of this.ptValue) {
                if (ptvalue === ptypeId) workType.isVisible = true
              }
            }
          }
        }
      },
      // 项目类型改变
      projectTypeChangeHandler () {
        for (let ptvalue of this.ptValue) {
          //  全选情况下
          if (ptvalue === 0) {
            this.$refs.pcGroup.toggleAll(true)
            this.ptValue = []
            this.selectedTypeName = this.projectTypelist[1].name
            this.selectedTypeNum = this.projectTypelist.length - 2
            for (let pw of this.projectTypelist)
              if (pw.id !== 0) {
                this.ptValue.push(pw.id)
              }
            break
          }
        }
        // 取出第一个名称回显
        if (this.ptValue.length !== 0) {
          this.selectedTypeName = this.projectTypelist[this.ptValue[0]].name
        }
        //  回显项目类型数量
        this.selectedTypeNum = this.ptValue.length - 1
        console.log(this.ptValue)
        for (let ptvalue of this.ptValue) {
          // 选择全部项目时
          if (ptvalue === 0) {
            this.ptValue = []
            for (let pw of this.projectTypelist) if (pw.id !== 0) this.ptValue.push(pw.id)
            break
          }
        }
        this.workTypeInit()
        this.checkOutputVoInit()
      },
      // 提交 预算产值明细
      putProjectOutputToApiHandle () {
        this.outputCalVisible = false
        this.$http({
          url: this.$http.adornUrl(`/project/checkoutputtemp/save`),
          method: 'post',
          data: this.$http.adornData({
            'projectNo': this.projectNo,
            'tempOutputlist': this.workTypelist
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$notify({ type: 'success', message: '添加预算产值成功',duration: 3000})
            this.outputCalVisible = false
            this.$emit('refreshDataList' , this.projectNo,this.totalOutPut,this.outputRemark)
          } else {
            this.$notify({message: data.msg, type: 'danger',duration: 3000})
          }
        })
      },
      // 根据工作类型可见不可见 来显示右侧工作组工作类型数据
      checkOutputVoInit () {
        let totalOutPut = 0
        let worktypeList = this.workTypelist
        worktypeList.forEach((ele, index) => {
          if (ele.checked) {
            ele.typeOutput = parseFloat((ele.projectRatio * ele.unitOutput * ele.workLoad).toFixed(2))
            totalOutPut = parseFloat((totalOutPut + ele.typeOutput).toFixed(2))
          }
        })
        this.workTypelist = worktypeList
        this.totalOutPut = totalOutPut
      },
      // 工作类型在表格勾选显示
      chooseRatio (params) {
        //  console.log(params)
        let temp = []
        params.forEach(e => {
          if (e.checked) {
            e.typeOutput = this.numFilter(
              e.workLoad * e.projectRatio * e.unitOutput
            )
            if (e.projectRatio == null || e.workLoad == null) {
              e.projectRatio = 1
              e.workLoad = 0
            }
            temp.push(e)
          }
        })
        return temp
      },
      // 保留小数点后两位的过滤器，尾数不四舍五入
      numFilter (value) {
        // 截取当前数据到小数点后三位
        let tempVal = parseFloat(value).toFixed(3)
        let realVal = tempVal.substring(0, tempVal.length - 1)
        return realVal
      },
    }
  }
</script>

<style scoped>
  .header{
    height:40px;
    text-align: center;
    font-size:16px;
    line-height: 40px;
    font-weight: 600;
    border-bottom:1px solid #9f9595;
  }
  .confirmbtn {
    -webkit-tap-highlight-color: transparent;
    user-select: none;
    overflow: visible;
    text-transform: none;
    font: inherit;
    position: relative;
    display: inline-block;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-size: 16px;
    text-align: center;
    border-radius: 2px;
    cursor: pointer;
    transition: opacity .2s;
    -webkit-appearance: none;
    color: #323233;
    background-color: #fff;
    width: 50%;
    height: 50px;
    line-height: 48px;
    border: 0;
    float:right;
    border-top:1px solid  #9f9595;
  }
  .left_work{
    border: 1px solid #6f7180;
    text-align: left;
    overflow-x: hidden;
    overflow-y: auto;
    height: 400px;
  }
  .checkbox_class{
    width: 99%;
    margin-left: 0;
  }
  .card_work{
    margin-top: 20px;
    font-size: 16px;
  }
  .f13{
    border-top:1px solid rgb(195, 197, 199);
    color: rgb(125, 127, 130);
    padding-top:5px;
    padding-bottom:3px;
    font-size:13px;
  }
  .psts .van-cell {
    padding: 5px 17px 3px 9px;
  }
  .bztx{
    border-top:1px solid rgb(195, 197, 199); padding-left:10%;margin-bottom:10px;margin-top:5px;padding-top:5px;
  }
  .pts {
    width: 100%;
    font-size: 16px;
    margin-bottom: 4px;
    margin-top: 4px;
    border-bottom: 1px dotted rgb(195, 197, 199);
    padding-bottom: 4px;
    padding-left: 10px;
  }
  .ptsd {
    width: 100%;
    overflow: scroll;
    height: 150px;
    padding-left: 10px;
    border-bottom: 1px dotted rgb(195, 197, 199)
  }
  .ptsdv {
    font-size:15px;
    padding-top:1px;
    color: rgb(125, 127, 130);
    padding-bottom: 5px;
    border-bottom: 1px solid rgb(195, 197, 199)
  }
  .mbmt5 {
    margin-bottom: 5px;
    margin-top: 5px;
  }
  .fsml {
    color: #1989fa;
    font-size: 15px;
    margin-left: 10px;
  }
  .ptpd5{
    padding-top:5px; padding-bottom:5px;
  }
  .bztx{
    border-top:1px solid rgb(195, 197, 199); padding-left:10%;margin-bottom:10px;margin-top:5px;padding-top:5px;
  }
  .tas{
    width: 80%;
    height:100px;
    margin-left:10%;
    margin-right:10%;
    border: 1px dashed #d9d2d2;
    padding: 0px;
    border-radius: 5px;overflow:scroll; letter-spacing:1.4px;
  }
  .nis {
    margin-left: 10%;
    width: 80%;
  }
  .nis .van-field {
    border: 1px solid #c9c1c1;;
  }
  .nis .van-cell {
    padding: 0px;
  }
  .pglsfirst .van-col {
    padding-bottom: 5px;
    font-size: 14px;
  }
  .os {
    overflow: scroll;
  }
  .nodatasty{
    margin-top:5px;text-align:center;color:rgb(125, 127, 130);
  }
  .tac{
    text-align:center;
  }
</style>
