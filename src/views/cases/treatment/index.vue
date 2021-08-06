<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="108px">
      <el-form-item label="治疗项目名称" prop="treatmentName">
        <el-input
          v-model="queryParams.treatmentName"
          placeholder="请输入治疗项目名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <!--<el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>-->
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['cases:treatment:add']"
        >新增</el-button>
      </el-form-item>
    </el-form>


    <el-table
      v-loading="loading"
      :data="treatmentList"
      row-key="treatmentId"
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column label="治疗项目名称"  prop="treatmentName" ></el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['cases:treatment:edit']"
          >修改</el-button>
          <el-button
            type="text"
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd(scope.row)"
            v-hasPermi="['cases:treatment:add']"
          >新增</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['cases:treatment:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>


    <!-- 添加或修改治疗项目对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="上级治疗" prop="pid">
          <treeselect
            v-model="form.pid"
            :options="treatmentOptions"
            :show-count="true"
            placeholder="选择上级治疗" />
        </el-form-item>

        <el-form-item label="治疗名称" prop="treatmentName">
          <el-input v-model="form.treatmentName" placeholder="请输入治疗名称" />
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
import { listTreatment, treeselect, getTreatment, delTreatment, addTreatment, updateTreatment, exportTreatment } from "@/api/cases/treatment";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name:"Treatment",
  components: { Treeselect },
  data() {
    return {
      loading: true,
      ids: [],
      single: true,
      multiple: true,
      total: 0,
      treatmentList: [],
      treatmentOptions:[],
      title: "",
      open: false,
      queryParams: {
        // pageNum: 1,
        // pageSize: 10,
        treatmentName: undefined,
      },
      form: {},
      rules: {
        treatmentName: [
          { required: true, message: "治疗项目名称不能为空", trigger: "blur" }
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
      listTreatment(this.queryParams).then(response => {
        this.treatmentList = response.data;
        this.loading = false;
      });
    },
    getTreeselect() {
      treeselect().then(response => {

        this.treatmentOptions = [];
        const t = { id: 0, label: '大类', children: [] };
        t.children = response.data;
        this.treatmentOptions.push(t);
      });
    },
    cancel() {
      this.open = false;
      this.reset();
    },
    reset() {
      this.form = {
        treatmentId: undefined,
        treatmentName: undefined,
        pid: 0
      };
      this.resetForm("form");
    },
    handleQuery() {
      // this.queryParams.pageNum = 1;
      this.getList();
    },
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.treatmentId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    handleAdd(row) {
      this.reset();
      this.getTreeselect();
      console.log(row)
      if (row != null) {
        this.form.pid = row.treatmentId;
      }
      this.open = true;
      this.title = "添加治疗项目";
    },
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      getTreatment(row.treatmentId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改治疗项目";
      });
    },
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.treatmentId != undefined) {
            updateTreatment(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addTreatment(this.form).then(response => {
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
      this.$confirm('是否确认删除治疗名称为"' + row.treatmentName + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delTreatment(row.treatmentId);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有治疗项目数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportTreatment(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
