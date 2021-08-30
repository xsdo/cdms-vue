<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="学生ID" prop="stuId">
        <el-input
          v-model="queryParams.stuId"
          placeholder="请输入学生ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="病人ID" prop="patientId">
        <el-input
          v-model="queryParams.patientId"
          placeholder="请输入病人ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="记录ID" prop="recordId">
        <el-input
          v-model="queryParams.recordId"
          placeholder="请输入记录ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!--<el-form-item label="病史采集分数" prop="historyScore">
        <el-input
          v-model="queryParams.historyScore"
          placeholder="请输入病史采集分数"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="体格检查分数" prop="tgScore">
        <el-input
          v-model="queryParams.tgScore"
          placeholder="请输入体格检查分数"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="精神检查分数" prop="jsScore">
        <el-input
          v-model="queryParams.jsScore"
          placeholder="请输入精神检查分数"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="辅助检查分数" prop="fzScore">
        <el-input
          v-model="queryParams.fzScore"
          placeholder="请输入辅助检查分数"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="诊断分数" prop="impScore">
        <el-input
          v-model="queryParams.impScore"
          placeholder="请输入诊断分数"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="治疗分数" prop="treatScore">
        <el-input
          v-model="queryParams.treatScore"
          placeholder="请输入治疗分数"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="病历分数" prop="medicalScore">
        <el-input
          v-model="queryParams.medicalScore"
          placeholder="请输入病历分数"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="总分" prop="sumScore">
        <el-input
          v-model="queryParams.sumScore"
          placeholder="请输入总分"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
        <el-form-item label="打分状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择打分状态" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remarks">
        <el-input
          v-model="queryParams.remarks"
          placeholder="请输入备注"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="结束时间" prop="updataTime">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.updataTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择结束时间">
        </el-date-picker>
      </el-form-item>-->
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
          v-hasPermi="['student:record:add']"
        >新增</el-button>
      </el-col>
      <!--<el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['student:record:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['student:record:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['student:record:export']"
        >导出</el-button>
      </el-col>-->
    </el-row>

    <el-table v-loading="loading" :data="recordList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
<!--      <el-table-column label="ID" align="center" prop="id" />-->
<!--      <el-table-column label="学生ID" align="center" prop="stuId" />-->
<!--      <el-table-column label="病人ID" align="center" prop="patientId" />-->
      <el-table-column label="记录ID" align="center" prop="recordId" />
      <el-table-column label="病史采集分数" align="center" prop="historyScore" />
      <el-table-column label="体格检查分数" align="center" prop="tgScore" />
      <el-table-column label="精神检查分数" align="center" prop="jsScore" />
      <el-table-column label="辅助检查分数" align="center" prop="fzScore" />
      <el-table-column label="诊断分数" align="center" prop="impScore" />
      <el-table-column label="治疗分数" align="center" prop="treatScore" />
      <el-table-column label="病历分数" align="center" prop="medicalScore" />
      <el-table-column label="总分" align="center" prop="sumScore" />
      <el-table-column label="打分状态" align="center" prop="status" />
      <el-table-column label="备注" align="center" prop="remarks" />
<!--      <el-table-column label="结束时间" align="center" prop="updataTime" width="180">-->
<!--        <template slot-scope="scope">-->
<!--          <span>{{ parseTime(scope.row.updataTime) }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['student:record:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['student:record:remove']"
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

    <!-- 添加或修改学生训练分数对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="学生ID" prop="stuId">
          <el-input v-model="form.stuId" placeholder="请输入学生ID" />
        </el-form-item>
        <el-form-item label="病人ID" prop="patientId">
          <el-input v-model="form.patientId" placeholder="请输入病人ID" />
        </el-form-item>
        <el-form-item label="记录ID" prop="recordId">
          <el-input v-model="form.recordId" placeholder="请输入记录ID" />
        </el-form-item>
        <el-form-item label="病史采集分数" prop="historyScore">
          <el-input v-model="form.historyScore" placeholder="请输入病史采集分数" />
        </el-form-item>
        <el-form-item label="体格检查分数" prop="tgScore">
          <el-input v-model="form.tgScore" placeholder="请输入体格检查分数" />
        </el-form-item>
        <el-form-item label="精神检查分数" prop="jsScore">
          <el-input v-model="form.jsScore" placeholder="请输入精神检查分数" />
        </el-form-item>
        <el-form-item label="辅助检查分数" prop="fzScore">
          <el-input v-model="form.fzScore" placeholder="请输入辅助检查分数" />
        </el-form-item>
        <el-form-item label="诊断分数" prop="impScore">
          <el-input v-model="form.impScore" placeholder="请输入诊断分数" />
        </el-form-item>
        <el-form-item label="治疗分数" prop="treatScore">
          <el-input v-model="form.treatScore" placeholder="请输入治疗分数" />
        </el-form-item>
        <el-form-item label="病历分数" prop="medicalScore">
          <el-input v-model="form.medicalScore" placeholder="请输入病历分数" />
        </el-form-item>
        <el-form-item label="总分" prop="sumScore">
          <el-input v-model="form.sumScore" placeholder="请输入总分" />
        </el-form-item>
        <el-form-item label="打分状态">
          <el-radio-group v-model="form.status">
            <el-radio label="0">未完成</el-radio>
            <el-radio label="1">已完成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="form.remarks" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="更新时间" prop="updataTime">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.updataTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择更新时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listRecord, getRecord, delRecord, addRecord, updateRecord, exportRecord } from "@/api/student/record";

export default {
  data() {
    return {
      loading: true,
      ids: [],
      single: true,
      multiple: true,
      total: 0,
      recordList: [],
      title: "",
      open: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        stuId: undefined,
        patientId: undefined,
        recordId: undefined,
        historyScore: undefined,
        tgScore: undefined,
        jsScore: undefined,
        fzScore: undefined,
        impScore: undefined,
        treatScore: undefined,
        medicalScore: undefined,
        sumScore: undefined,
        status: undefined,
        remarks: undefined,
        updataTime: undefined
      },
      form: {},
      rules: {
        recordId: [
          { required: true, message: "所属记录id不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      listRecord(this.queryParams).then(response => {
        this.recordList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    cancel() {
      this.open = false;
      this.reset();
    },
    reset() {
      this.form = {
        id: undefined,
        stuId: undefined,
        patientId: undefined,
        recordId: undefined,
        historyScore: undefined,
        tgScore: undefined,
        jsScore: undefined,
        fzScore: undefined,
        impScore: undefined,
        treatScore: undefined,
        medicalScore: undefined,
        sumScore: undefined,
        status: "0",
        remarks: undefined,
        createTime: undefined,
        updataTime: undefined
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
      this.open = true;
      this.title = "添加学生训练分数";
    },
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getRecord(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改学生训练分数";
      });
    },
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateRecord(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addRecord(this.form).then(response => {
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
      this.$confirm('是否确认删除学生训练分数编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delRecord(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有学生训练分数数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportRecord(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
