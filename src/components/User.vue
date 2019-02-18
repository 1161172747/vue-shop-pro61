<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryParams.query"
            :clearable="true"
            @clear="getUserInfos"
            @keyup.enter.native="getUserInfos"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserInfos"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="addGetUser=true">添加用户</el-button>
        </el-col>
      </el-row>

      <el-dialog title="添加用户" :visible.sync="addGetUser" width="50%" @close="resetFrom">
        <el-form :rules="addFormRules" ref="addFormRef" :model="addForm" label-width="80px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addGetUser = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>

      <el-table :data="userInfos" border style="width: 100%">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="mobile" label="手机号码" width="140"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="130"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="150"></el-table-column>
        <el-table-column label="状态" width="70">
          <el-switch
            v-model="info.row.mg_state"
            slot-scope="info"
            @change="getChange(info.row.id,info.row.mg_state)"
          ></el-switch>
        </el-table-column>
        <el-table-column prop="address" label="操作" width="230">
          <template slot-scope="info">
            <el-button type="primary" icon="el-icon-edit" size="mini" 
            @click="editUser(info.row.id)"></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delUser(info.row.id)"
            ></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top-start"
              :enterable="false"
            >
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 修改用户的弹框 -->
      <el-dialog title="修改用户信息" :visible.sync="editDialogVisible" width="50%">
        <el-form :rules="editFormRules" ref="editFormRef" :model="editForm" label-width="80px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="editForm.username" :disabled="true"></el-input>
          </el-form-item>

          <el-form-item label="邮箱">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="showUser">确 定</el-button>
        </span>
      </el-dialog>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="queryParams.pagenum"
        :page-sizes="[2, 5, 10, 20]"
        :page-size="queryParams.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="queryParams.total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getUserInfos()
  },
  data() {
    var checkMobile = (rule, value, callback) => {
      if (!/^1[35789]\d{9}$/.test(value)) {
        // 校验失败
        return callback(new Error('手机号码格式不正确'))
      }
      callback()
    }
    return {
      editDialogVisible: false,
      editForm: {
        username: '',
        email: '',
        mobile: ''
      },
      editFormRules:{
         mobile: [
          { required: true, message: '手机号码不能为空', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      addGetUser: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addFormRules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '手机号码不能为空', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      userInfos: [],
      queryParams: {
        query: '',
        pagenum: 1,
        pagesize: 2,
        total: 0
      }
    }
  },
  methods: {
    async showUser() {
      const {data:res} = await this.$http.put('users/'+this.editForm.id,this.editForm);
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      };
      this.editDialogVisible = false;
      this.$message.success(res.meta.msg);
      this.getUserInfos()
    },
   async editUser(id) {
     this.editDialogVisible = true;
      const {data:res} = await this.$http.get('users/'+id);
      console.log(res);
      if (res.meta.status !==200) {
        return this.$message.error(res.meta.msg)
      };
      this.editForm = res.data
    },
    async delUser(id) {
      this.$confirm('确定删除嘛?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete('users/' + id)
          console.log(res)
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          this.$message.success(res.meta.msg)
          this.getUserInfos()
        })
        .catch(() => {})
    },
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.post('users', this.addForm)
          console.log(res)
          if (res.meta.status !== 201) {
            return this.$message.error(res.meta.msg)
          }

          this.addGetUser = false
          this.$message.success(res.meta.msg)
          this.getUserInfos()
        }
      })
    },
    resetFrom() {
      this.$refs.addFormRef.resetFields()
    },
    async getChange(id, state) {
      const { data: res } = await this.$http.put(`users/${id}/state/${state}`)

      if (res.meta.status !== 200) {
        return this.$message.error('修改失败')
      }
      this.$message({
        message: '修改用户状态成功',
        type: 'success',
        duration: 1500
      })
    },
    handleSizeChange(val) {
      this.queryParams.pagesize = val
      this.getUserInfos()
    },
    handleCurrentChange(val) {
      this.queryParams.pagenum = val
      this.getUserInfos()
    },
    async getUserInfos() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryParams
      })
      console.log(res)

      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.queryParams.total = res.data.total
      console.log(res.data.total)
      this.userInfos = res.data.users
    }
  }
}
</script>

<style lang="less" scoped>
.el-card {
  margin-top: 15px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
  .el-table {
    margin-top: 15px;
    font-size: 12px;
  }
  .el-pagination {
    margin-top: 15px;
    font-size: 12px;
  }
}
</style>
