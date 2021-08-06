<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="72px">
      <el-form-item label="学生姓名" prop="stuName">
        <el-input
          v-model="queryParams.stuName"
          placeholder="请输入学生姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
        <!--<el-form-item label="性别" prop="sex">-->
        <!--<el-select v-model="queryParams.sex" placeholder="请选择性别" clearable size="small">-->
          <!--<el-option label="请选择字典生成" value="" />-->
        <!--</el-select>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="班级" prop="classNo">-->
        <!--<el-input-->
          <!--v-model="queryParams.classNo"-->
          <!--placeholder="请输入班级"-->
          <!--clearable-->
          <!--size="small"-->
          <!--@keyup.enter.native="handleQuery"-->
        <!--/>-->
      <!--</el-form-item>-->

      <!--<el-form-item label="学院/系部" prop="deptId">-->
        <!--<el-input-->
          <!--v-model="queryParams.deptId"-->
          <!--placeholder="请输入学院/系部"-->
          <!--clearable-->
          <!--size="small"-->
          <!--@keyup.enter.native="handleQuery"-->
        <!--/>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="年级" prop="grade">-->
        <!--<el-input-->
          <!--v-model="queryParams.grade"-->
          <!--placeholder="请输入年级"-->
          <!--clearable-->
          <!--size="small"-->
          <!--@keyup.enter.native="handleQuery"-->
        <!--/>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="专业" prop="major">-->
        <!--<el-input-->
          <!--v-model="queryParams.major"-->
          <!--placeholder="请输入专业"-->
          <!--clearable-->
          <!--size="small"-->
          <!--@keyup.enter.native="handleQuery"-->
        <!--/>-->
      <!--</el-form-item>-->

        <!--<el-form-item label="状态" prop="status">-->
        <!--<el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">-->
          <!--<el-option label="请选择字典生成" value="" />-->
        <!--</el-select>-->
      <!--</el-form-item>-->
      <el-form-item label="学号" prop="sno">
        <el-input
          v-model="queryParams.sno"
          placeholder="请输入学号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['student:student:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['student:student:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['student:student:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['student:student:export']"
        >导出</el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button
          type="info"
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
          v-hasPermi="['student:student:import']"
        >导入</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="studentList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!--<el-table-column label="编号" align="center" prop="id" />-->
      <el-table-column label="学号" align="center" prop="sno" />
      <el-table-column label="姓名" align="center" prop="stuName" />
      <el-table-column label="性别" align="center" prop="sex">
        <template slot-scope="scope">{{ scope.row.sex === '0' ? '男' : '女' }}</template>
      </el-table-column>
      <el-table-column label="学院/系部" align="center" prop="dept.deptName" />
      <el-table-column label="专业" align="center" prop="major" />
      <el-table-column label="年级" align="center" prop="grade" />
      <el-table-column label="班级" align="center" prop="classNo" />
      <!--<el-table-column label="年龄" align="center" prop="age" />-->
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="0"
            inactive-value="1"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['student:student:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['student:student:remove']"
          >删除</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-key"
            @click="handleResetPwd(scope.row)"
            v-hasPermi="['system:user:resetPwd']"
          >重置</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改学生对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">

        <el-row>
          <el-col :span="12">
            <el-form-item label="学号" prop="sno">
              <el-input v-model="form.sno" placeholder="请输入学号" :disabled="able" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学生姓名" prop="stuName">
              <el-input v-model="form.stuName" placeholder="请输入学生姓名" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="用户性别">
              <el-select v-model="form.sex" placeholder="请选择">
                <el-option
                  v-for="dict in sexOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="学院/系部" prop="deptId">
              <treeselect
                v-model="form.deptId"
                :options="deptOptions"
                placeholder="请选择归属学院/系部" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="专业" prop="major">
              <el-input v-model="form.major" placeholder="请输入专业" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="班级" prop="classNo">
              <el-input v-model="form.classNo" placeholder="请输入班级" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="年级" prop="grade">
              <el-input v-model="form.grade" placeholder="请输入年级" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年龄" prop="age">
              <el-input v-model="form.age" placeholder="请输入年龄" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in statusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                >{{dict.dictLabel}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px">
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls, .XLSX, .XLS"
        :headers="upload.headers"
        :action="upload.url"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :before-upload="beforeUpload"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">
          <el-link type="info" style="font-size:12px" @click="importTemplate">下载模板（需根据提供模板填写数据）</el-link>
        </div>
        <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div>

      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listStudent, getStudent, delStudent, addStudent, updateStudent, exportStudent, importStudent,importTemplate ,resetStuPwd, changeStuStatus } from "@/api/student/student";
import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { getToken } from "@/utils/auth";
export default {
  name: "Student",
  components: { Treeselect },
  data() {
    return {
      loading: true,
      ids: [],
      single: true,
      fileList: [],
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,

        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/student/student/import"
      },
      able:false,
      multiple: true,
      total: 0,
      studentList: [],
      title: "",
      deptOptions: undefined,
      open: false,
      deptName: undefined,
      initPassword: undefined,
      statusOptions: [],
      sexOptions: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        stuName: undefined,
        sex: undefined,
        classNo: undefined,
        password: undefined,
        deptId: undefined,
        grade: undefined,
        major: undefined,
        age: undefined,
        status: undefined,
        sno: undefined
      },
      form: {},
      rules: {
        sno: [
          { required: true, message: "学号不能为空", trigger: "blur" }
        ],
        stuName: [
          { required: true, message: "学生名字不能为空", trigger: "blur" }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" }
        ],
        deptId: [
          { required: true, message: "归属学院/系部不能为空", trigger: "blur" }
        ],
      }
    };
  },
  watch: {
    deptName(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.getList();
    this.getTreeselect();
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
    this.getDicts("sys_user_sex").then(response => {
      this.sexOptions = response.data;
    });
    this.getConfigKey("sys.user.initPassword").then(response => {
      this.initPassword = response.data;
    });
  },
  methods: {
    importTemplate() {
      importTemplate().then(response => {
        this.download(response.msg);
      });
    },

    beforeUpload(file){
      const fileType = file.name.substring(file.name.lastIndexOf('.'))
      if (fileType.toLowerCase() != '.xlsx' && fileType.toLowerCase() != '.xls') {
        this.$message.error('文件必须为.xlsx或.xls类型')
        this.fileList = [];
        return false;
      }

    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },

    handleImport(){
      this.upload.title = "学生数据导入";
      this.upload.open = true;
    },


    getList() {
      this.loading = true;
      listStudent(this.queryParams).then(response => {
        this.studentList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    getTreeselect() {
      treeselect().then(response => {

        this.deptOptions = response.data;
      });
    },
    handleStatusChange(row) {
      let text = row.status === "0" ? "启用" : "停用";
      this.$confirm('确认要"' + text + '""' + row.sno + '"用户吗?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return changeStuStatus(row.id, row.status);
      }).then(() => {
        this.msgSuccess(text + "成功");
      }).catch(function() {
        row.status = row.status === "0" ? "1" : "0";
      });
    },
    cancel() {
      this.open = false;
      this.reset();
    },
    reset() {
      this.form = {
        id: undefined,
        stuName: undefined,
        sex: undefined,
        classNo: undefined,
        password: undefined,
        deptId: undefined,
        grade: undefined,
        major: undefined,
        age: undefined,
        status: "0",
        sno: undefined
      };
      this.resetForm("form");
    },
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    handleAdd() {
      this.reset();
      this.getTreeselect();
      this.able=false;
      this.open = true;
      this.title = "添加学生";
      this.form.password = this.initPassword;

    },
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      const id = row.id || this.ids
      getStudent(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改学生";
        this.able=true;
        this.form.password = "";
      });
    },

    handleResetPwd(row) {
      this.$prompt('请输入"' + row.sno + '"的新密码', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(({ value }) => {
        resetStuPwd(row.id, value).then(response => {
          if (response.code === 200) {
            this.msgSuccess("修改成功，新密码是：" + value);
          } else {
            this.msgError(response.msg);
          }
        });
      }).catch(() => {});
    },

    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateStudent(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addStudent(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          }
        }
      });
    },
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除学生编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delStudent(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有学生数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportStudent(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },


  }
};
</script>
