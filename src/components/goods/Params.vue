<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <el-alert
        title="
注意：只允许为第三级分类设置相关参数！"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>
      <el-row class="margin15">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            :options="cateDataList"
            v-model="selectCateKeys"
            :props="cascaderProps"
            @change="handleChange"
            clearable
            change-on-select
          >
          </el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="tabsClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isDisabled"
            @click="addParamsDialogVisible = true"
            >添加参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table :data="tableData" style="width: 100%" border>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(tag, i) in scope.row.attr_vals"
                  :key="tag"
                  closable
                  @close="removeTag(i, scope.row)"
                >
                  {{ tag }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="editParams(scope.row.attr_id)"
                  >修改</el-button
                >
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isDisabled"
            @click="addParamsDialogVisible = true"
            >添加属性</el-button
          >
          <!-- 静态属性表格 -->
          <el-table :data="tableData" style="width: 100%" border>
            <el-table-column type="expand">
             <template slot-scope="scope">
                <el-tag
                  v-for="(tag, i) in scope.row.attr_vals"
                  :key="tag"
                  closable
                  @close="removeTag(i, scope.row)"
                >
                  {{ tag }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="editParams(scope.row.attr_id)"
                  >修改</el-button
                >
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数和添加属性对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addParamsDialogVisible"
      width="50%"
      @close="addParamsDialogClose"
    >
      <el-form
        :model="addParamsForm"
        :rules="addParamsFormRules"
        ref="addParamsFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmAddParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数和添修改属性对话框 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editParamsDialogVisible"
      width="50%"
    >
      <el-form
        :model="editParamsForm"
        :rules="editParamsFormRules"
        ref="editParamsFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmEditParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      cateDataList: [],
      selectCateKeys: [], // 选择的分类id
      // cascader的props配置对象
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      activeName: 'many', // tabs选中项,only代表静态属性，many代表动态参数
      tableData: [], // 表格数据
      addParamsDialogVisible: false, // 添加参数对话框状态
      addParamsForm: {
        attr_name: ''
      },
      addParamsFormRules: {
        attr_name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      },
      editParamsDialogVisible: false, // 修改参数对话框状态
      editParamsForm: {
        attr_id: '',
        attr_name: ''
      },
      editParamsFormRules: {
        attr_name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.getCateList()
  },
  computed: {
    isDisabled () {
      // 默认禁用按钮，如果选择了第三级商品分类就启动
      return this.selectCateKeys.length !== 3
    },
    getCateId () {
      // 获取分类id
      if (this.selectCateKeys.length === 3) {
        return this.selectCateKeys[2]
      }
      return null
    },
    titleText () {
      // 动态计算标题是 动态参数还是静态属性
      if (this.activeName === 'only') {
        return '静态属性'
      }
      return '动态参数'
    }
  },
  methods: {
    async getCateList () {
      // 获取分类数据
      let { data: res } = await this.$axios.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类数据失败！')
      }
      this.cateDataList = res.data
    },
    handleChange () {
      // 判断数组长度 阻止用户直接选择一级二级
      if (this.selectCateKeys.length !== 3) {
        this.selectCateKeys = []
        this.tableData = []
      } else {
        this.getParamsData(this.activeName)
      }
    },
    async getParamsData (type) {
      // 获取参数列表数据
      let { data: res } = await this.$axios.get(
        `categories/${this.getCateId}/attributes`,
        {
          params: { sel: type }
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数列表失败！')
      }
      // 处理返回的数据，把attr_vals字段用逗号分隔成数组，便于前台展示tag
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals === '' ? [] : item.attr_vals.split(',')
        item.inputVisible = false // 控制是显示按钮还是显示input
        item.inputValue = '' // tag input内容
      })
      this.tableData = res.data
      console.log('格式化后', res.data)
      this.$message.success('获取参数列表成功')
    },
    tabsClick () {
      // 点击tab项
      this.getParamsData(this.activeName)
    },
    addParamsDialogClose () {
      // 关闭对话框，清空表单数据
      this.$refs.addParamsFormRef.resetFields()
    },
    confirmAddParams () {
      // 确定添加参数 属性
      this.$refs.addParamsFormRef.validate(async valid => {
        if (!valid) return
        let { data: res } = await this.$axios.post(
          `categories/${this.getCateId}/attributes`,
          {
            attr_name: this.addParamsForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 201) {
          return this.$message.error('添加失败！')
        }
        this.addParamsDialogVisible = false
        this.$message.success('添加成功')
        this.getParamsData(this.activeName)
      })
    },
    async editParams (attrId) {
      // 点击修改 查询数据并弹出修改对话框
      let {
        data: res
      } = await this.$axios.get(
        `categories/${this.getCateId}/attributes/${attrId}`,
        { params: { attr_sel: this.activeName } }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取失败！')
      }
      this.editParamsForm.attr_id = attrId
      this.editParamsForm.attr_name = res.data.attr_name
      this.editParamsDialogVisible = true
    },
    confirmEditParams () {
      this.$refs.editParamsFormRef.validate(async valid => {
        if (!valid) return
        let { data: res } = await this.$axios.put(
          `categories/${this.getCateId}/attributes/${this.editParamsForm.attr_id}`,
          {
            attr_name: this.editParamsForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('修改失败！')
        }
        this.editParamsDialogVisible = false
        this.$message.success('修改成功')
        this.getParamsData(this.activeName)
      })
    },
    removeParams (attrId) {
      // 删除参数 属性
      this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          let { data: res } = await this.$axios.delete(
            `categories/${this.getCateId}/attributes/${attrId}`
          )
          if (res.meta.status !== 200) {
            return this.$message.error('删除失败！')
          }
          this.$message.success('删除成功')
          this.getParamsData(this.activeName)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    async saveAttrVals (row) {
      // 保存tag的添加和删除的更新改变
      let attrVals = row.attr_vals.join(',')
      let { data: res } = await this.$axios.put(
        `categories/${this.getCateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: this.activeName,
          attr_vals: attrVals
        }
      )
      if (res.meta.status !== 200) {
        this.$message.error('修改参数项失败！')
      } else {
        this.$message.success('修改参数项成功')
      }
    },
    handleInputConfirm (row) {
      // 确认输入
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
      } else {
        row.attr_vals.push(row.inputValue.trim())
        // 请求接口把新增的tag保存到数据库
        this.saveAttrVals(row)
        row.inputValue = ''
      }
      row.inputVisible = false
    },
    showInput (row) {
      // tag button点击显示input
      row.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    removeTag (i, row) {
      // 点击移除tag
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    }
  }
}
</script>
<style lang="less" scoped>
.margin15 {
  margin: 15px 0;
}
.el-tag {
  margin: 10px 5px;
}
.input-new-tag {
  width: 120px;
}
</style>
