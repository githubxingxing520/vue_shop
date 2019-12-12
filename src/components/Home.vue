<template>
  <el-container class="home_container">
    <el-header>
      <div class="loginbox">
        <img src="../assets/home_logo.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="loginOut">退出登录</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle_collapse" @click="toggleCollapse">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
        >
          <el-submenu
            :index="item.id + ''"
            v-for="item in asideMenuList"
            :key="item.id"
          >
            <template slot="title">
              <i :class="icons[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              :index="'/' + subitem.path"
              v-for="subitem in item.children"
              :key="subitem.id"
              @click="saveNavState('/' + subitem.path)"
            >
              <i class="el-icon-menu"></i>
              <span>{{ subitem.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      asideMenuList: [],
      icons: {
        '125': 'iconfont icon-users',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      isCollapse: false, // 是否折叠左侧菜单
      activePath: '' // 当前选中项的path
    }
  },
  created () {
    this.getAsideMenuData()
    this.activePath = window.sessionStorage.getItem('active-path')
  },
  methods: {
    loginOut () {
      // 退出登录
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getAsideMenuData () {
      // 获取左侧菜单数据
      let { data: res } = await this.$axios.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.asideMenuList = res.data
      console.log(this.asideMenuList)
    },
    toggleCollapse () {
      // 点击切换折叠左侧菜单
      this.isCollapse = !this.isCollapse
    },
    saveNavState (navpath) {
      this.activePath = navpath
      // 把当前选中项的index属性保存到sessionStorage中
      window.sessionStorage.setItem('active-path', navpath)
    }
  }
}
</script>
<style lang="less" scoped>
.home_container {
  height: 100%;
  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 20px;
    color: #fff;
    font-weight: bold;
    > div {
      display: flex;
      align-items: center;
      > span {
        margin-left: 15px;
      }
    }
  }
  .el-aside {
    background-color: #333744;
    .toggle_collapse {
      font-size: 10px;
      line-height: 24px;
      letter-spacing: 0.2em;
      color: #fff;
      text-align: center;
      background-color: #4a5064;
      cursor: pointer;
    }
    .el-menu {
      border-right: none;
      .iconfont {
        margin-right: 10px;
      }
    }
  }
  .el-main {
    background-color: #eaedf1;
  }
}
</style>
