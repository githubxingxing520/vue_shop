<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <el-button type="primary" @click="addRole">添加角色</el-button>
      <el-table :data="roleList" stripe border style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
              :class="['bdbottom', 'flex-align-center', i1 == 0 ? 'bdtop' : '']"
            >
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightsById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                  :class="['flex-align-center', i2 == 0 ? '' : 'bdtop']"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightsById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      closable
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      @close="removeRightsById(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="editRole(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="removeRole(scope.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              size="mini"
              icon="el-icon-setting"
              @click="showSetRightsDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightsDialogVisible"
      width="50%"
      @close="setRightsDialogClose"
    >
      <el-tree
        :data="treeRightsList"
        :props="defaultProps"
        default-expand-all
        show-checkbox
        node-key="id"
        :default-checked-keys="defaultCheckedKey"
        ref="rightsTreeRef"
      >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmSetRights">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRoleDialogVisible"
      width="50%"
      @close="addRoleDialogClose"
    >
      <el-form
        :model="addRoleForm"
        :rules="addRoleFormRules"
        ref="addRoleFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmAddRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改角色对话框 -->
    <el-dialog
      title="修改角色"
      :visible.sync="editRoleDialogVisible"
      width="50%"
    >
      <el-form
        :model="editRoleForm"
        :rules="editRoleFormRules"
        ref="editRoleFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmEditRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      roleList: [], // 角色列表数据
      treeRightsList: [], // 树形菜单权限数据
      setRightsDialogVisible: false, // 分配权限对话框
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      defaultCheckedKey: [], // 默认选中的项
      roleId: '',
      addRoleDialogVisible: false, // 添加角色对话框
      addRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      addRoleFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      },
      editRoleDialogVisible: false, // 修改角色对话框
      editRoleForm: {},
      editRoleFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getRoleList()
  },
  methods: {
    async getRoleList () {
      // 获取角色数据
      let { data: res } = await this.$axios.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表信息失败！')
      }
      this.roleList = res.data
    },
    removeRightsById (role, rightsId) {
      // 根据Id移除权限
      this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          let { data: res } = await this.$axios.delete(
            `roles/${role.id}/rights/${rightsId}`
          )
          if (res.meta.status !== 200) {
            return this.$message.error('删除权限失败！')
          }
          role.children = res.data
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    async showSetRightsDialog (role) {
      this.roleId = role.id // 角色id保存到data中
      // 打开分配权限对话框，并请求tree接口数据
      let { data: res } = await this.$axios.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败！')
      }
      this.treeRightsList = res.data
      this.digui(role, this.defaultCheckedKey)
      this.setRightsDialogVisible = true
    },
    digui (node, arr) {
      // 通过递归获取角色下所有三级权限id 并保存
      if (!node.children) {
        // 没有children说明是三级节点
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.digui(item, arr)
      })
    },
    setRightsDialogClose () {
      // 关闭分配权限对话框时，清空上一次保存的id
      this.defaultCheckedKey = []
    },
    async confirmSetRights () {
      // 分配权限 确定
      let checkedKeys = this.$refs.rightsTreeRef.getCheckedKeys()
      let halfCheckedKeys = this.$refs.rightsTreeRef.getHalfCheckedKeys()
      let keys = [...checkedKeys, ...halfCheckedKeys].join(',')
      let { data: res } = await this.$axios.post(
        `roles/${this.roleId}/rights`,
        {
          rids: keys
        }
      )
      if (res.meta.status !== 200) {
        this.$message.error('更新失败！')
      } else {
        this.$message.success('更新成功')
      }
      this.setRightsDialogVisible = false
      this.getRoleList()
    },
    addRole () {
      // 点击添加角色，打开对话框
      this.addRoleDialogVisible = true
    },
    addRoleDialogClose () {
      // 添加角色对话框关闭，情况表单数据
      this.$refs.addRoleFormRef.resetFields()
    },
    confirmAddRole () {
      // 确定保存添加角色
      this.$refs.addRoleFormRef.validate(async valid => {
        if (!valid) return
        let { data: res } = await this.$axios.post('roles', this.addRoleForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加失败！')
        }
        this.$message.success('添加成功')
        this.addRoleDialogVisible = false
        this.getRoleList()
      })
    },
    async editRole (id) {
      // 点击编辑 弹出修改角色对话框
      let { data: res } = await this.$axios.get(`roles/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色信息失败！')
      }
      this.editRoleForm = res.data
      this.editRoleDialogVisible = true
    },
    confirmEditRole () {
      // 确定保存修改角色
      this.$refs.editRoleFormRef.validate(async valid => {
        if (!valid) return
        let { data: res } = await this.$axios.put(
          `roles/${this.editRoleForm.roleId}`,
          {
            roleName: this.editRoleForm.roleName,
            roleDesc: this.editRoleForm.roleDesc
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('更新失败！')
        }
        this.editRoleDialogVisible = false
        this.$message.success('更新成功')
        this.getRoleList()
      })
    },
    removeRole (id) {
      // 根据角色id删除角色
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          let { data: res } = await this.$axios.delete(`roles/${id}`)
          if (res.meta.status !== 200) {
            return this.$message.error('删除失败！')
          }
          this.$message.success('删除成功')
          this.getRoleList()
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
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.flex-align-center {
  display: flex;
  align-items: center;
}
</style>
