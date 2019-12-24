<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>
      <el-steps finish-status="success" align-center :active="+activeIndex">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        class="demo-ruleForm"
        label-position="top"
      >
        <el-tabs
          :tab-position="'left'"
          v-model="activeIndex"
          :before-leave="beforeLeave"
          @tab-click="tabClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateDataList"
                :props="cascaderProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTableData"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="itemVals"
                  v-for="(itemVals, i) in item.attr_vals"
                  :key="i"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTableData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              class="upload-demo"
              :action="uploadImgUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="uploadHeaders"
              :on-success="uploadSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce" ref="myQuillEditor">
            </quill-editor>
            <el-button type="primary" class="btnAddGoods" @click="addGoods"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 显示图片对话框 -->
    <el-dialog
      title="图片预览"
      :visible.sync="imgPreviewDialogVisible"
      width="50%"
    >
      <img :src="imgPreviewUrl" alt="" class="imgPreview" />
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data () {
    return {
      activeIndex: '0', // step选中项
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      cateDataList: [], // 商品分类列表
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      manyTableData: [], // 动态参数列表
      onlyTableData: [], // 静态属性列表
      uploadImgUrl: 'http://127.0.0.1:8888/api/private/v1/upload', // 上传图片url
      uploadHeaders: {
        Authorization: window.sessionStorage.getItem('xs')
      },
      imgPreviewDialogVisible: false,
      imgPreviewUrl: ''
    }
  },
  created () {
    this.getCateList()
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
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    beforeLeave (activeName, oldActiveName) {
      // tabs标签切换前的钩子
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类！')
        return false
      }
    },
    async getParamsData (type) {
      // 获取参数列表数据
      let { data: res } = await this.$axios.get(
        `categories/${this.addForm.goods_cat[2]}/attributes`,
        {
          params: { sel: type }
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数列表失败！')
      }
      if (type === 'many') {
        // 处理返回的数据，把attr_vals字段用逗号分隔成数组，便于前台展示tag
        res.data.forEach(item => {
          item.attr_vals =
            item.attr_vals === '' ? [] : item.attr_vals.split(',')
        })
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
      console.log('格式化后', res.data)
      this.$message.success('获取参数列表成功')
    },
    tabClick () {
      // 点击tabs标签页触发
      if (this.activeIndex === '1') {
        // 商品参数
        let type = 'many'
        this.getParamsData(type)
      } else if (this.activeIndex === '2') {
        // 商品属性
        let type = 'only'
        this.getParamsData(type)
      }
    },
    handlePreview (file) {
      // 点击文件列表中已上传的文件时的钩子
      // 点击图片放大显示
      console.log(file)
      this.imgPreviewUrl = file.response.data.url
      this.imgPreviewDialogVisible = true
    },
    handleRemove (file) {
      // 文件列表移除文件时的钩子
      // 根据要删除的图片的路径找到下标，然后从数组中移除掉
      console.log(file)
      let removeImgPath = file.response.data.tmp_path
      let removeIndex = this.addForm.pics.findIndex(
        item => item.pic === removeImgPath
      )
      this.addForm.pics.splice(removeIndex, 1)
    },
    uploadSuccess (res) {
      // 上传成功后的钩子
      console.log('文件上传成功')
      console.log(res)
      let picObj = {
        pic: res.data.tmp_path
      }
      this.addForm.pics.push(picObj)
    },
    addGoods () {
      // 点击添加商品
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请填写必要的表单项！')
        }
        // 把goods_cat用,号连接
        let _addForm = _.cloneDeep(this.addForm)
        _addForm.goods_cat = _addForm.goods_cat.join(',')
        // 1.循环商品参数和商品属性的数据,把每一项的attr_id和attr_name放到一个对象中
        // 2.把组装好的对象push到表单里的attrs中
        this.manyTableData.forEach(item => {
          let attr = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(',')
          }
          _addForm.attrs.push(attr)
        })
        this.onlyTableData.forEach(item => {
          let attr = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          _addForm.attrs.push(attr)
        })
        // 请求接口 添加商品
        let { data: res } = await this.$axios.post('goods', _addForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加失败！')
        }
        this.$message.success('添加成功')
        this.$router.push('/goods')
      })
    }
  }
}
</script>
<style lang="less" scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.imgPreview {
  width: 100%;
}
.btnAddGoods {
  margin-top: 15px;
}
</style>
