<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="案例诊断" prop="diagnosis">
        <el-input
          v-model="queryParams.diagnosis"
          placeholder="请输入案例诊断"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>


      <el-form-item label="患者姓名" prop="patientName">
        <el-input
          v-model="queryParams.patientName"
          placeholder="请输入患者姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="症状" prop="symptom">
        <el-input
          v-model="queryParams.symptom"
          placeholder="请输入症状"
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
          v-hasPermi="['cases:patient:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['cases:patient:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['cases:patient:remove']"
        >删除</el-button>
      </el-col>
      <!--<el-col :span="1.5">-->
        <!--<el-button-->
          <!--type="warning"-->
          <!--icon="el-icon-download"-->
          <!--size="mini"-->
          <!--@click="handleExport"-->
          <!--v-hasPermi="['cases:patient:export']"-->
        <!--&gt;导出</el-button>-->
      <!--</el-col>-->
    </el-row>

    <el-table v-loading="loading" :data="patientList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!--<el-table-column label="患者ID" align="center" prop="id" />-->
      <el-table-column label="案例诊断" align="center" prop="diagnosis" />
      <el-table-column label="患者姓名" align="center" prop="patientName" />
      <el-table-column label="性别" align="center" prop="sex" :formatter="sexFormat" />
      <el-table-column label="年龄" align="center" prop="age" />
      <el-table-column label="症状" align="center" prop="symptom" />
      <el-table-column label="检查项目库" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <router-link :to="'/case/patient/item/' + scope.row.id" class="link-type">
            <span>查看项目库</span>
          </router-link>

        </template>
      </el-table-column>
      <el-table-column label="问诊问题库" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <router-link :to="'/case/patient/question/' + scope.row.id" class="link-type">
            <span>查看问题库</span>
          </router-link>

        </template>
      </el-table-column>

      <el-table-column label="评分标准" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <router-link :to="'/case/patient/standard/' + scope.row.id" class="link-type">
            <span>查看评分标准</span>
          </router-link>

        </template>
      </el-table-column>
      <!--<el-table-column label="就诊时间" align="center" prop="visitDate" width="180">-->
      <!--<template slot-scope="scope">-->
          <!--<span>{{ parseTime(scope.row.visitDate) }}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column label="婚姻状况" align="center" prop="maritalStatus" :formatter="maritalStatusFormat" />-->
      <!--<el-table-column label="民族" align="center" prop="nation" />-->
      <!--<el-table-column label="籍贯" align="center" prop="nativePlace" />-->
      <!--<el-table-column label="职业" align="center" prop="occupation" />-->
      <!--<el-table-column label="工作单位" align="center" prop="affiliation" />-->
      <!--<el-table-column label="家庭住址" align="center" prop="home" />-->
      <!--<el-table-column label="联系电话" align="center" prop="telephone" />-->
      <!--<el-table-column label="付款方式" align="center" prop="payment" />-->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['cases:patient:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['cases:patient:remove']"
          >删除</el-button>

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

    <!-- 添加或修改案例患者对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px">
      <el-form ref="form" :model="form" :rules="rules" label-width="84px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="案例诊断" prop="diagnosis">
              <el-input v-model="form.diagnosis" placeholder="请输入案例诊断" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名" prop="patientName">
              <el-input v-model="form.patientName" placeholder="请输入患者姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" prop="sex">
              <el-select v-model="form.sex" placeholder="请选择性别" >
                <el-option
                  v-for="dict in sexOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年龄" prop="age">
              <el-input v-model="form.age" placeholder="请输入年龄" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="症状" prop="symptom">
              <el-input v-model="form.symptom" placeholder="请输入症状" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="就诊时间" prop="visitDate">
              <el-date-picker clearable size="small" style="width: 200px"
                              v-model="form.visitDate"
                              type="date"
                              value-format="yyyy-MM-dd"
                              placeholder="选择就诊时间">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item  label="上传图片">
              <el-upload
                ref="avatar"
                :limit="1"
                :before-upload="beforeUpload"
                :auto-upload="true"
                :headers="headers"
                :on-success="handleSuccess1"
                :on-error="handleError"
                :before-remove="beforeRemove1"
                :action="fileUploadApi +'/common/upload'"
                :file-list="fileList1"
                accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PBG,.GIF,.BMP"
              >
                <el-button class="eladmin-upload" type="primary" size="mini"><i class="el-icon-upload" />添加患者图片</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item >
              <el-image style="width: 120px;height: 120px"
                        :src="fileUploadApi + form.avatar"
                        :preview-src-list="[fileUploadApi + form.avatar]"
                        fit="contain"
                        class="el-avatar"
              >
                <div slot="error">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="婚姻状况" prop="maritalStatus">
              <el-radio-group v-model="form.maritalStatus">
                <el-radio
                  v-for="dict in maritalStatusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                >{{dict.dictLabel}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="民族" prop="nation">
              <el-select v-model="form.nation" placeholder="请选择民族" >
                <el-option
                  v-for="dict in nationOptions"
                  :key="dict.dictLabel"
                  :label="dict.dictLabel"
                  :value="dict.dictLabel"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="籍贯" prop="nativePlace">
              <el-input v-model="form.nativePlace" placeholder="请输入籍贯" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职业" prop="occupation">
              <el-input v-model="form.occupation" placeholder="请输入职业" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工作单位" prop="affiliation">
              <el-input v-model="form.affiliation" placeholder="请输入工作单位" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="家庭住址" prop="home">
              <el-input v-model="form.home" placeholder="请输入家庭住址" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="telephone">
              <el-input v-model="form.telephone" placeholder="请输入联系电话" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="付款方式" prop="payment">
              <el-input v-model="form.payment" placeholder="请输入付款方式" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="既往病史" prop="anamnesis">
              <el-input v-model="form.anamnesis" placeholder="请输入既往病史" />
            </el-form-item>

          </el-col>
          <el-col :span="12">
            <el-form-item  label="上传图片">
              <el-upload
                ref="upload"
                :limit="1"
                :before-upload="beforeUpload"
                :auto-upload="true"
                :headers="headers"
                :on-success="handleSuccess"
                :on-error="handleError"
                :before-remove="beforeRemove"
                :action="fileUploadApi +'/common/upload'"
                :file-list="fileList"
                accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PBG,.GIF,.BMP"
              >
                <el-button class="eladmin-upload" type="primary" size="mini"><i class="el-icon-upload" />添加病史图片</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item >
              <el-image style="width: 120px;height: 120px"
                        :src="fileUploadApi + form.anamnesisImg"
                        :preview-src-list="[fileUploadApi + form.anamnesisImg]"
                        fit="contain"
                        class="el-avatar"
              >
                <div slot="error">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="病史陈述者" prop="declarant">
              <el-input v-model="form.declarant" placeholder="请输入病史陈述者" />
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {listNation, listPatient, getPatient, delPatient, addPatient, updatePatient, exportPatient } from "@/api/cases/patient";
import { getToken } from '@/utils/auth'
export default {
  data() {
    return {
      loading: true,
      fileUploadApi:"",
      headers:{'Authorization': getToken()},
      picUrl:"",
      ids: [],
      single: true,
      multiple: true,
      total: 0,
      fileList:[],
      fileList1:[],
      patientList: [],
      sexOptions: [],
      maritalStatusOptions: [],
      nationOptions: [],
      title: "",
      open: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        diagnosis:undefined,
        patientName: undefined,
        symptom: undefined,

      },
      form: {},
      rules: {
        patientName: [
          { required: true, message: "患者姓名不能为空", trigger: "blur" }
        ],
        diagnosis: [
          { required: true, message: "案例诊断不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_user_sex").then(response => {
      this.sexOptions = response.data;
    });
    this.getDicts("sys_user_maritalStatus").then(response => {
      this.maritalStatusOptions = response.data;
    });
  },
  methods: {
    getList() {
      this.loading = true;
      this.fileUploadApi = process.env.VUE_APP_BASE_API;
      listPatient(this.queryParams).then(response => {
        this.patientList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
      listNation().then(response => {
        this.nationOptions=response.data;
      });
    },
    cancel() {
      this.open = false;
      this.reset();
    },
    reset() {
      this.fileList=[];
      this.fileList1=[];
      this.picUrl="";
      this.form = {
        id: undefined,
        patientName: undefined,
        sex: undefined,
        age: undefined,
        symptom: undefined,
        visitDate: undefined,
        maritalStatus: "0",
        nation: undefined,
        nativePlace: undefined,
        occupation: undefined,
        affiliation: undefined,
        home: undefined,
        telephone: undefined,
        payment: undefined,
        anamnesis: undefined,
        declarant: undefined,
        diagnosis:undefined,
        anamnesisImg: "",
        avatar: "",
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined
      };
      this.resetForm("form");
    },

    // 上传文件
    beforeUpload(file) {
      var testmsg = /^image\/(jpeg|png|jpg|gif|bmp)$/.test(file.type);
      if (!testmsg) {
        this.$message.error('上传图片格式不正确！')
        return
      }
      let isLt2M = true;
      let mysize = "";
      isLt2M = file.size / 1024 / 1024 < 100
      if (!isLt2M) {
        this.loading = false;
        this.$message.error('上传文件大小不能超过 100MB!')
      }
      if( file.size > 1024*1024){
        mysize = ( file.size / 1024 / 1024 ).toFixed(2) +"M";
      }else if( file.size > 1024 ){
        mysize = ( file.size / 1024 ).toFixed(2) +"K";
      }else{
        mysize = size.toFixed(2) + "B";
      }
      return isLt2M
    },
    handleSuccess(res) {
      this.form.anamnesisImg = res.fileName;

    },
    handleSuccess1(res) {
      this.form.avatar = res.fileName;

    },
    // 监听上传失败
    handleError(e, file, fileList) {
      const msg = JSON.parse(e.message)
      this.$notify({
        title: msg.message,
        type: 'error',
        duration: 2500
      })
      this.loading = false
    },
    //删除文件
    beforeRemove(file) {

      this.$confirm(`确认删除该图片吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 点击确认 发送请求，在请求回调中操作列表数据
        this.$refs.upload.clearFiles();
        this.form.anamnesisImg="";
      }).catch(() => {
        // 点击取消，什么也不做！

      });
      return false

    },
    beforeRemove1(file) {

      this.$confirm(`确认删除该图片吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 点击确认 发送请求，在请求回调中操作列表数据
        this.$refs.avatar.clearFiles();
        this.form.avatar="";
      }).catch(() => {
        // 点击取消，什么也不做！

      });
      return false

    },
    sexFormat(row, column) {
      return this.selectDictLabel(this.sexOptions, row.sex);
    },

    maritalStatusFormat(row, column) {
      return this.selectDictLabel(this.maritalStatusOptions, row.maritalStatus);
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
      this.open = true;
      this.title = "添加案例患者";
    },
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getPatient(id).then(response => {
        this.form = response.data;

        if(this.form.anamnesisImg){
          let obj = new Object();
          obj.url = this.form.anamnesisImg;
          this.fileList.push(obj);
        }
        if(this.form.avatar){
          let obj = new Object();
          obj.url = this.form.avatar;
          this.fileList1.push(obj);
        }
        this.open = true;
        this.title = "修改案例患者";
      });
    },
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {

          if (this.form.id != undefined) {
            updatePatient(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();

              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addPatient(this.form).then(response => {
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
      this.$confirm('是否确认删除案例患者编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delPatient(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有案例患者数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportPatient(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
