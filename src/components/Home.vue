<template>
  <el-container>
    <el-header>
      <div id="home-box">
        <img src="../assets/img/heima.png" alt>
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="menushow?'65px':'200px'">
        <div
          style="height:25px;color:white;text-align:center;line-height:25px;background-color:rgb(74,80,100);font-size:12px;letter-spacing:0.1em;cursor:pointer;user-select:none;"
          @click="menushow=!menushow"
        >|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          :collapse="menushow"
          :collapse-transition="false"
          :style="menushow?'width:65px;':'width:200px;'"
          :unique-opened="true"
        >
          <el-submenu :index="item.id+''" v-for="(item,k) in modelist" :key="item.id">
            <template slot="title">
              <i :class="'iconfont icon-' + picture[k]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item
                :index="item.id+'-'+item2.id"
                v-for="item2 in item.children"
                :key="item2.id"
              >
                <i class="el-icon-menu"></i>
                <span>{{item2.authName}}</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view /> 
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created() {
    this.getMenuList()
  },
  data() {
    return {
      menushow: false,
      modelist: [],
      picture: ['users', 'tijikongjian', 'shangpin', 'danju', 'baobiao']
    }
  },
  methods: {
    logout() {
      this.$confirm('是否退出?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$router.push('login')
        })
        .catch(() => {})
    },
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.modelist = res.data
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
  .el-header {
    background-color: #373d41;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 20px;
    #home-box {
      font-size: 22px;
      color: #fff;
      display: flex;
      align-items: center;
      user-select: none;
      img {
        height: 50px;
        width: 50px;
        margin-right: 10px;
      }
    }
  }
  .el-aside {
    background-color: #333744;
  }
  .el-main {
    background-color: #eaedf1;
  }
}
</style>
