<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input
            placeholder="请输入搜索内容"
            class="input-with-select"
            v-model="queryInfo.query"
            clearable
            @clear="getOrderList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getOrderList"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="orderList" stripe border style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_number" label="订单编号">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="80">
        </el-table-column>
        <el-table-column prop="pay_status" label="是否付款" width="80">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.pay_status == '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="80">
        </el-table-column>
        <el-table-column prop="create_time" label="下单时间" width="200">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat("YYYY-MM-DD HH:mm:ss") }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template>
            <el-tooltip class="item" effect="light" :enterable="false" :visible-arrow="false" content="修改订单地址" placement="bottom-start">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="editAddress"
            ></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="light" :enterable="false" :visible-arrow="false" content="物流信息" placement="bottom-start">
            <el-button
              type="success"
              size="mini"
              icon="el-icon-location"
              @click="showLogisticsInfo"
            ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5, 10,15, 20]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
    <!-- 修改地址对话框 -->
    <el-dialog
  title="修改地址"
  :visible.sync="editAddressDialogVisible"
  width="50%"
  @close="editAddressDialogColse"
 >
 <el-form :model="editAddressForm" :rules="editAddressFormRules" ref="editAddressFormRef" label-width="100px" class="demo-ruleForm">
   <el-form-item label="省市区/县" prop="basicAddress">
   <el-cascader
    v-model="editAddressForm.basicAddress"
    :options="citydata"
    @change="handleChange"
    ></el-cascader>
  </el-form-item>
  <el-form-item label="详细地址" prop="detailAddress">
    <el-input v-model="editAddressForm.detailAddress"></el-input>
  </el-form-item>
 </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editAddressDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editAddressDialogVisible = false">确 定</el-button>
  </span>
</el-dialog>
<!-- 物流信息对话框 -->
<el-dialog
  title="物流进度"
  :visible.sync="LogisticsInfoDialogVisible"
  width="50%"
>
  <el-timeline>
    <el-timeline-item
      v-for="(item, index) in LogisticsInfo"
      :key="index"
      :timestamp="item.time">
      {{item.context}}
    </el-timeline-item>
  </el-timeline>
</el-dialog>
  </div>
</template>

<script>
import citydata from './citydata.js'
export default {
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      orderList: [],
      editAddressDialogVisible: false,
      editAddressForm: {
        basicAddress: [],
        detailAddress: ''
      },
      editAddressFormRules: {
        basicAddress: [
          { required: true, message: '请选择省市区县', trigger: 'blur' }
        ],
        detailAddress: [
          { required: true, message: '请填写详细地址', trigger: 'blur' }
        ]
      },
      citydata: citydata,
      LogisticsInfoDialogVisible: false,
      LogisticsInfo: [] // 物流信息
    }
  },
  created () {
    this.getOrderList()
  },
  methods: {
    async getOrderList () {
      // 获取订单列表数据
      let { data: res } = await this.$axios.get('orders', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取订单列表失败！')
      }
      this.total = res.data.total
      this.orderList = res.data.goods
      console.log('订单列表', this.orderList)
    },
    handleSizeChange (newPageSize) {
      // 改变pagesize时触发
      this.queryInfo.pagesize = newPageSize
      this.getOrderList()
    },
    handleCurrentChange (newPageNum) {
      // 改变pagenum时触发
      this.queryInfo.pagenum = newPageNum
      this.getOrderList()
    },
    editAddress () {
      // 点击修改地址 弹出对话框
      this.editAddressDialogVisible = true
    },
    handleChange () {
      // 级联选择器改变事件
    },
    editAddressDialogColse () {
      // 修改地址对话框关闭,清空表单
      this.$refs.editAddressFormRef.resetFields()
    },
    showLogisticsInfo () {
      // 点击打开对话框，显示物流信息
      this.getLogisticsInfo()
    },
    async getLogisticsInfo () {
      // 获取物流信息
      let { data: res } = await this.$axios.get('kuaidi/1106975712662')
      if (res.meta.status !== 200) {
        return this.$message.error('获取物流信息失败！')
      }
      this.LogisticsInfo = res.data
      this.LogisticsInfoDialogVisible = true
    }
  }
}
</script>
<style lang="less" scoped>
.el-cascader{
  width: 100%;
}
</style>
