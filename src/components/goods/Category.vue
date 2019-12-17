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
      <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
      <!-- 表格 -->
      <tree-table
        class="tree-table"
        :data="goodsCateList"
        :columns="tableColumn"
        :expand-type="false"
        :border="true"
        :selection-type="false"
        :show-index="true"
        index-text="#"
        :show-row-hover="false"
      >
        <template slot="isOK" slot-scope="scope">
          <i
            class="el-icon-success"
            style="color:green"
            v-if="scope.row.cat_deleted === false"
          ></i>
          <i class="el-icon-error" style="color:red" v-else></i>
        </template>
        <template slot="sort" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level == 0">一级</el-tag>
          <el-tag
            size="mini"
            type="success"
            v-else-if="scope.row.cat_level == 1"
            >二级</el-tag
          >
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <template slot="caozuo" slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="editCate(scope.row.cat_id)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="removeCate(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClose"
    >
      <el-form
        ref="addCateFormRef"
        :model="addCateForm"
        :rules="addCateFormRules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectedParentCate"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChange"
            clearable
            filterable
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveAddCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类对话框 -->
    <el-dialog
      title="修改分类"
      :visible.sync="editCateDialogVisible"
      width="50%"
      @close="editCateDialogClose"
    >
      <el-form
        ref="editCateFormRef"
        :model="editCateForm"
        :rules="editCateFormRules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEditCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      queryInfo: {
        type: '',
        pagenum: 1,
        pagesize: 5
      },
      goodsCateList: [], // 商品分类数据
      parentCateList: [], // 父级分类数据
      selectedParentCate: [], // 选择的父级分类
      total: 0, // 总条数
      tableColumn: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          prop: 'cat_deleted',
          type: 'template',
          template: 'isOK'
        },
        {
          label: '排序',
          prop: 'cat_level',
          type: 'template',
          template: 'sort'
        },
        {
          label: '操作',
          type: 'template',
          template: 'caozuo'
        }
      ],
      addCateDialogVisible: false,
      editCateDialogVisible: false,
      addCateForm: {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      editCateForm: {
        cat_id: '',
        cat_name: ''
      },
      editCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // cascader的props配置对象
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      }
    }
  },
  created () {
    this.getGoodsCateData()
  },
  methods: {
    async getGoodsCateData () {
      // 获取商品分类数据
      let { data: res } = await this.$axios.get('categories', {
        params: this.queryInfo
      })
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类数据失败！')
      }
      this.goodsCateList = res.data.result
      this.total = res.data.total
    },
    handleSizeChange (newsize) {
      // 更改每页条数pagesize触发
      this.queryInfo.pagesize = newsize
      this.getGoodsCateData()
    },
    handleCurrentChange (pagenum) {
      // 点击页码更改pagenum时触发
      this.queryInfo.pagenum = pagenum
      this.getGoodsCateData()
    },
    async showAddCateDialog () {
      // 打开添加分类对话框
      // 请求商品分类数据
      let { data: res } = await this.$axios.get('categories', {
        params: { type: 2, pagenum: '', pagesize: '' }
      })
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类数据失败！')
      }
      this.addCateDialogVisible = true
      this.parentCateList = res.data
    },
    parentCateChange () {
      // 父级分类选中节点变化时触发
      // 判断用户选了几级，给form表单参数赋值
      if (this.selectedParentCate.length > 0) {
        // 说明选了父级分类
        let i = this.selectedParentCate.length - 1
        this.addCateForm.cat_pid = this.selectedParentCate[i]
        this.addCateForm.cat_level = this.selectedParentCate.length
      } else {
        // 说明没有选择父级分类
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    addCateDialogClose () {
      // 添加分类对话框关闭,清空表单
      this.$refs.addCateFormRef.resetFields()
      this.selectedParentCate = []
    },
    saveAddCate () {
      // 确定保存添加分类，并关闭对话框
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        let { data: res } = await this.$axios.post(
          'categories',
          this.addCateForm
        )
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败！')
        }
        this.$message.success('添加分类成功')
        this.addCateDialogVisible = false
        this.getGoodsCateData()
      })
    },
    async editCate (catId) {
      // 点击编辑分类 弹出对话框
      // 疑问：为啥可以通过作用域插槽能拿到对话框要展示的数据，还要请求接口去拿
      let { data: res } = await this.$axios.get(`categories/${catId}`)
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类数据失败！')
      }
      this.editCateForm.cat_id = res.data.cat_id
      this.editCateForm.cat_name = res.data.cat_name
      this.editCateDialogVisible = true
    },
    editCateDialogClose () {
      // 编辑分类对话框关闭，清空表单
      this.$refs.editCateFormRef.resetFields()
    },
    saveEditCate () {
      // 确定保存编辑分类
      this.$refs.editCateFormRef.validate(async valid => {
        if (!valid) return
        let { data: res } = await this.$axios.put(
          `categories/${this.editCateForm.cat_id}`,
          {
            cat_name: this.editCateForm.cat_name
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('更新失败！')
        }
        this.editCateDialogVisible = false
        this.$message.success('更新成功')
        this.getGoodsCateData()
      })
    },
    removeCate (catId) {
      // 删除分类
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          let { data: res } = await this.$axios.delete(`categories/${catId}`)
          if (res.meta.status !== 200) {
            return this.$message.error('删除失败！')
          }
          this.$message.success('删除成功')
          this.getGoodsCateData()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>
<style lang="less" scoped>
.tree-table {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
