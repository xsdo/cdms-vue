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
      <el-form-item label="问题" prop="question">
        <el-input
          v-model="queryParams.question"
          placeholder="请输入问题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!--<el-form-item label="答案" prop="answer">-->
        <!--<el-input-->
          <!--v-model="queryParams.answer"-->
          <!--placeholder="请输入答案"-->
          <!--clearable-->
          <!--size="small"-->
          <!--@keyup.enter.native="handleQuery"-->
        <!--/>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="问答所属类型" prop="typeId">-->
        <!--<el-input-->
          <!--v-model="queryParams.typeId"-->
          <!--placeholder="请输入问答所属类型"-->
          <!--clearable-->
          <!--size="small"-->
          <!--@keyup.enter.native="handleQuery"-->
        <!--/>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="检查结果" prop="result">-->
        <!--<el-input-->
          <!--v-model="queryParams.result"-->
          <!--placeholder="请输入检查结果"-->
          <!--clearable-->
          <!--size="small"-->
          <!--@keyup.enter.native="handleQuery"-->
        <!--/>-->
      <!--</el-form-item>-->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <!--<el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>-->
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
          <!--v-hasPermi="['cases:question:export']"-->
        <!--&gt;导出</el-button>-->
      <!--</el-col>-->
    </el-row>

    <el-table v-loading="loading" :data="questionList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!--<el-table-column label="id" align="center" prop="id" />-->
      <el-table-column label="问题" align="center" prop="question" />
      <el-table-column label="回答" align="center" prop="answer" />
      <el-table-column label="所属类型" align="center" prop="type.typeName" />
      <el-table-column label="检查结果" align="center" prop="result" />
      <el-table-column label="核心项目" align="center" prop="isCore" :formatter="isCoreFormat" />
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

    <!-- 添加或修改问诊问题库对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px">
      <el-form ref="form" :model="form" :rules="rules" label-width="90px">

        <el-form-item label="案例患者">
          <el-input v-model="patientName" :disabled="true" />
        </el-form-item>

        <el-form-item label="问题" prop="question">
          <el-input v-model="form.question"  type="textarea" :rows="3" placeholder="请输入问题" />
        </el-form-item>
        <el-form-item label="回答" prop="answer">
          <el-input v-model="form.answer"  type="textarea" :rows="3" placeholder="请输入回答" />
        </el-form-item>
        <el-form-item label="所属类型" prop="typeId">
          <treeselect
            v-model="form.typeId"
            :options="typeOptions"
            placeholder="请选择所属类型" />
        </el-form-item>
        <!--<el-form-item label="问答所属类型" prop="typeId">-->
          <!--<el-input v-model="form.typeId" placeholder="请输入问答所属类型" />-->
        <!--</el-form-item>-->
        <el-form-item label="检查结果" prop="result">
          <el-input v-model="form.result" placeholder="请输入检查结果" />
        </el-form-item>
        <!--<el-form-item label="核心项目" prop="isCore">
          <el-input v-model="form.isCore" placeholder="请输入是否核心项目（1 核心项目 2非核心项目 0待定）" />
        </el-form-item>-->

        <!--<el-col :span="12">
          <el-form-item label="核心项目" prop="isCore" >
            <el-select v-model="form.isCore"  placeholder="请选择是否核心项目" >
              <el-option
                v-for="dict in isCoreOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-col>-->

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
import { listQuestion, getQuestion, delQuestion, addQuestion, updateQuestion, exportQuestion } from "@/api/cases/patient/question";
import { treeselect } from "@/api/cases/type";

import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import Treeselect from "@riophae/vue-treeselect";
import { listPatient, getPatient } from "@/api/cases/patient";

export default {
  components: { Treeselect},
  name:"Question",
  data() {
    return {
      loading: true,
      ids: [],
      single: true,
      multiple: true,
      total: 0,
      patientName:undefined,
      questionList: [],
      patientOptions:[],
      isCoreOptions:[],
      typeOptions: undefined,
      title: "",
      open: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        question: undefined,
        answer: undefined,
        typeId: undefined,
        result: undefined,
        isCore: undefined,
        patientId: undefined,
      },
      form: {},
      rules: {
        question: [
          { required: true, message: "问题不能为空", trigger: "blur" }
        ],
        answer: [
          { required: true, message: "回答不能为空", trigger: "blur" }
        ],
        typeId: [
          { required: true, message: "所属类型不能为空", trigger: "blur" }
        ],
        result: [
          { required: true, message: "结果不能为空", trigger: "blur" }
        ],
        isCore: [
          { required: true, message: "核心项目不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getTreeselect();
    const patientId = this.$route.params && this.$route.params.pid;
    // console.log(patientId);
    this.getPatient(patientId);
    this.getPatientList();
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
        this.getList();
      });


    },
    getPatientList(){
      listPatient().then(response => {
        this.patientOptions = response.rows;
      });
    },
    getList() {
      this.loading = true;
      // console.log(this.queryParams);
      listQuestion(this.queryParams).then(response => {
        this.questionList = response.rows;
        this.total = response.total;
        this.form.patientId = this.queryParams.patientId;
        this.loading = false;
      });
    },
    getTreeselect() {
      treeselect().then(response => {
        this.typeOptions = response.data;
      });
    },
    isCoreFormat(row, column) {
      return this.selectDictLabel(this.isCoreOptions, row.isCore);
    },
    cancel() {
      this.open = false;
      this.reset();
    },
    reset() {
      this.form = {
        id: undefined,
        patientId:this.form.patientId,
        question: undefined,
        answer: undefined,
        typeId: undefined,
        result: undefined,
        isCore: undefined
      };
      this.resetForm("form");
    },
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getPatient(this.queryParams.patientId);
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
      this.open = true;
      this.title = "添加问诊问题库";
    },
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      const id = row.id || this.ids
      getQuestion(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改问诊问题库";
      });
    },
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          console.log(this.form);
          if (this.form.id != undefined) {
            updateQuestion(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addQuestion(this.form).then(response => {
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
      this.$confirm('是否确认删除问题编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delQuestion(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有问诊问题库数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportQuestion(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
