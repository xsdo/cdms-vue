<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="案例患者" >
        <el-select v-model="queryParams.patientId" size="small">
          <el-option
            v-for="item in patientOptions"
            :key="item.id"
            :label="item.patientName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="检查类型" prop="category">
        <el-select v-model="queryParams.category" placeholder="请选择检查类型" clearable size="small">
          <el-option
            v-for="dict in categoryOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <!--<el-button-->
          <!--type="primary"-->
          <!--icon="el-icon-plus"-->
          <!--size="mini"-->
          <!--@click="handleAdd"-->
          <!--v-hasPermi="['cases:patientitem:add']"-->
        <!--&gt;新增</el-button>-->
      </el-form-item>
    </el-form>


    <el-table
      v-loading="loading"
      :data="patientItemList"
      row-key="itemId"
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >

      <el-table-column label="项目名称"  prop="itemName" ></el-table-column>
      <el-table-column label="检查类型"  prop="category" :formatter="categoryFormat" ></el-table-column>
      <el-table-column label="检查记录"  prop="patientItem.records"></el-table-column>
      <el-table-column label="检查记录图片"  prop="patientItem.recordsImg">
        <template width="90" slot-scope="scope"
                  v-if="scope.row.patientItem.recordsImg !=null"
        >
          <el-image style="width: 80px;height: 80px"
                    :src="fileUploadApi + scope.row.patientItem.recordsImg"
                    :preview-src-list="[fileUploadApi + scope.row.patientItem.recordsImg]"
                    fit="contain"
          >
            <div slot="error">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>

        </template>
      </el-table-column>
      <el-table-column label="临床意义"  prop="patientItem.significance" ></el-table-column>
      <el-table-column label="核心项目"  prop="patientItem.isCore" :formatter="isCoreFormat"  />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['cases:patient:edit']"
            v-if="scope.row.patientItem.records !=null || scope.row.patientItem.recordsImg !=null || scope.row.patientItem.significance !=null"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            v-hasPermi="['cases:patient:add']"
            v-if="scope.row.patientItem.records ==null && scope.row.patientItem.recordsImg ==null && scope.row.patientItem.significance==null"
          >添加</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['cases:patient:remove']"
            v-if="scope.row.patientItem.records !=null || scope.row.patientItem.recordsImg !=null || scope.row.patientItem.significance !=null"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--<pagination-->
      <!--v-show="total>0"-->
      <!--:total="total"-->
      <!--:page.sync="queryParams.pageNum"-->
      <!--:limit.sync="queryParams.pageSize"-->
      <!--@pagination="getList"-->
    <!--/>-->

    <!-- 添加或修改案例患者和检查项目关联对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px">
      <el-form ref="form" :model="form" :rules="rules" label-width="90px">

        <el-form-item label="案例患者">
          <el-input v-model="patientName" :disabled="true" />
        </el-form-item>
        <el-form-item label="检查项目">
          <el-input v-model="itemName" :disabled="true" />
        </el-form-item>
        <el-form-item label="检查记录" prop="records">
          <el-input v-model="form.records"  type="textarea" :rows="2" placeholder="请输入检查记录" />
        </el-form-item>
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

            <el-button class="eladmin-upload" type="primary" size="mini"><i class="el-icon-upload" />添加检查记录</el-button>

          </el-upload>

        </el-form-item>

        <el-form-item >

          <el-image style="width: 120px;height: 120px"
                    :src="fileUploadApi + form.recordsImg"
                    :preview-src-list="[fileUploadApi + form.recordsImg]"
                    fit="contain"
                    class="el-avatar"
          >
            <div slot="error">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
        </el-form-item>

        <el-form-item label="临床意义" prop="significance">
          <el-input v-model="form.significance"  type="textarea" :rows="3" placeholder="请输入临床意义" />
        </el-form-item>

      <!--<el-form-item label="核心项目" prop="isCore">
        <el-input v-model="form.isCore"  type="textarea" :rows="1" placeholder="请输入是否核心项目（1 核心项目 2非核心项目 0待定）" />
      </el-form-item>-->

       <!-- <el-col :span="12">
          <el-form-item label="核心项目" prop="isCore" >
            <el-select v-model="form.isCore" placeholder="请选择是否核心项目" >
              <el-option
                v-for="dict in isCoreOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-col>
        -->
        <el-col :span="24">
          <el-form-item label="核心项目" prop="isCore" >
            <el-radio-group v-model="form.isCore">
              <el-radio :label="1">核心项目</el-radio>
              <el-radio :label="2">非核心项目</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>



      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listItem, getItem, delItem, addItem, updateItem } from "@/api/cases/patient/item";
import { listPatient, getPatient } from "@/api/cases/patient";
import { treeselect} from "@/api/cases/item";

import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { getToken } from '@/utils/auth'
  export default {
    components: { Treeselect },
    name:"Item",
  data() {
    return {
      fn:"",
      icon:"",
      loading: true,
      ids: [],
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      picUrl:"",
      fileUploadApi:"",
      fileList:[],
      headers:{'Authorization': getToken()},
      single: true,
      multiple: true,
      total: 0,
      patientItemList: [],
      title: "",
      isAdd:true,
      patientOptions:[],
      categoryOptions: [],
      itemOptions:[],
      isCoreOptions:[],
      open: false,
      queryParams: {
        // pageNum: 1,
        // pageSize: 10,
        patientId: undefined,
        category: undefined,
        isCore: undefined,
      },
      patientName:"",
      itemName:"",
      form: {},
      rules: {
        // records: [
        //   { required: true, message: "检查记录/结果不能为空", trigger: "blur" }
        // ],

      }
    };
  },
  created() {
    const patientId = this.$route.params && this.$route.params.pid;
    this.getPatient(patientId);
    this.getPatientList();
    this.getDicts("case_item_type").then(response => {
      this.categoryOptions = response.data;
    });
    this.getDicts("sys_is_core").then(response => {
      this.isCoreOptions = response.data;
    });
  },
  methods: {

    //查询案例患者
    getPatient(patientId) {
      getPatient(patientId).then(response => {
        this.queryParams.patientId = response.data.id;
        this.patientName = response.data.patientName;
      });
      this.getList(patientId);

    },
    getPatientList(){
      listPatient().then(response => {
        this.patientOptions = response.rows;
      });
    },
    getList(patientId) {
      this.loading = true;
      this.fileUploadApi = process.env.VUE_APP_BASE_API;
      listItem(this.queryParams,patientId).then(response => {
        this.patientItemList = response.data;
        this.form.patientId = patientId;
        this.loading = false;
      });
    },
    getTreeselect() {
      treeselect().then(response => {
        // this.itemOptions = [];
        // const t = { id: 0, label: '大类', children: [] };
        // t.children = response.data;
        // this.itemOptions.push(t);
        this.itemOptions = response.data;
      });
    },
    isCoreFormat(row, column) {
      // console.log(row.patientItem.isCore);
      if (row.patientItem.isCore!=null){
        return this.selectDictLabel(this.isCoreOptions, row.patientItem.isCore);

      }
    },
    //删除文件
    beforeRemove(file) {

      this.$confirm(`确认删除该图片吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 点击确认 发送请求，在请求回调中操作列表数据
        this.picUrl = "";
        this.$refs.upload.clearFiles();
        this.form.recordsImg="";
      }).catch(() => {
        // 点击取消，什么也不做！
      });
      return false

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
      this.form.recordsImg = res.fileName;
      // this.$refs.upload.clearFiles();
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
    categoryFormat(row, column) {
      return this.selectDictLabel(this.categoryOptions, row.category);
    },

    cancel() {
      this.open = false;
      this.reset();
    },
    reset() {
      this.fileList=[];
      this.picUrl="";
      this.form = {
        patientId:this.form.patientId,
        itemId: undefined,
        records: undefined,
        recordsImg:"",
        significance: undefined,
        isCore: undefined
      };
      this.resetForm("form");
    },
    handleQuery() {
      // this.queryParams.pageNum = 1;
      // this.getList();
      this.getPatient(this.queryParams.patientId);
    },
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.patientId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    handleAdd(row) {
      this.reset();
      this.isAdd=true;
      this.itemName = row.itemName;
      this.form.itemId = row.itemId;
      this.open = true;
      this.title = "添加案例患者下的检查项目";
    },
    handleUpdate(row) {
      this.reset();
      this.isAdd=false;
      this.itemName = row.itemName;
      const patientId = this.form.patientId;

      const itemId = row.itemId;
      getItem(patientId,itemId).then(response => {
        this.form = response.data;
        // console.log(this.form.records)
        if(this.form.recordsImg){
          let obj = new Object();
          obj.url = this.form.recordsImg;
          this.fileList.push(obj);
        }
        this.open = true;
        this.title = "修改案例患者下的检查项目";
      });
    },
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {

          if (this.isAdd) {
            addItem(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList(this.form.patientId);
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            updateItem(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList(this.form.patientId);
              } else {
                this.msgError(response.msg);
              }
            });

          }
        }
      });
    },
    handleDelete(row) {
      const patientId = this.form.patientId
      console.log(typeof this.form.patientId)
      const itemName = row.itemName;
      this.$confirm('是否确认删除该案例下的检查项目为"' + itemName + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delItem(patientId,row.itemId);
        }).then(() => {
          this.getList(this.form.patientId);
          this.msgSuccess("删除成功");
        }).catch(function() {
          console.log("111")
      });
    },
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有案例患者和检查项目关联数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportItem(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>

